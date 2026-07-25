import {
  IncomeState,
  DeductionsState,
  CommitmentRow,
  DsrResults,
  EligibilityStatus,
  DebtConsolidationState,
  DebtConsolidationResults,
  PersonalLoanState,
  PersonalLoanResults,
  CalculatorSummary,
} from '../types/calculator';

/**
 * Format raw number to Malaysian Ringgit string (e.g. RM12,345.67)
 */
export function formatCurrency(amount: number, includeSymbol = true): string {
  if (isNaN(amount) || !isFinite(amount)) {
    return includeSymbol ? 'RM0.00' : '0.00';
  }
  const isNegative = amount < 0;
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toLocaleString('en-MY', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (includeSymbol) {
    return isNegative ? `-RM${formatted}` : `RM${formatted}`;
  }
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * Parse input string to raw clean number.
 */
export function parseCurrencyInput(value: string | number): number {
  if (typeof value === 'number') return isNaN(value) ? 0 : value;
  if (!value) return 0;
  
  // Keep digits and one decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  if (!cleaned) return 0;

  // Handle multiple decimal points if typed
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    const combined = parts[0] + '.' + parts.slice(1).join('');
    const parsed = parseFloat(combined);
    return isNaN(parsed) ? 0 : parsed;
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Live format user typing input with commas (e.g. "1234567" -> "1,234,567")
 */
export function formatLiveTypingNumber(value: string): string {
  if (!value) return '';
  
  // Extract clean digits and decimal
  const cleanVal = value.replace(/[^\d.]/g, '');
  if (!cleanVal) return '';

  const parts = cleanVal.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] !== undefined ? parts[1].slice(0, 2) : undefined;

  const formattedInteger = integerPart ? parseInt(integerPart, 10).toLocaleString('en-US') : '0';

  if (decimalPart !== undefined) {
    return `${formattedInteger}.${decimalPart}`;
  } else if (cleanVal.includes('.')) {
    return `${formattedInteger}.`;
  }
  return formattedInteger;
}

/**
 * Calculate DSR & NDI metrics
 */
export function calculateDsrResults(
  income: IncomeState,
  deductions: DeductionsState,
  commitments: CommitmentRow[],
  dsrThreshold: number = 60
): DsrResults {
  const grossIncome =
    (income.basicSalary || 0) +
    (income.fixedAllowance1 || 0) +
    (income.fixedAllowance2 || 0) +
    (income.fixedAllowance3 || 0) +
    (income.commission || 0) +
    (income.otherIncome || 0);

  const totalDeductions =
    (deductions.epf || 0) +
    (deductions.socso || 0) +
    (deductions.pcb || 0) +
    (deductions.otherDeductions || 0);

  const netIncome = Math.max(0, grossIncome - totalDeductions);

  let totalMonthlyCommitment = 0;
  let totalSettlement = 0;

  commitments.forEach((row) => {
    totalMonthlyCommitment += row.monthlyCommitment || 0;
    totalSettlement += row.settlementAmount || 0;
  });

  const dsrPercentage = netIncome > 0 ? (totalMonthlyCommitment / netIncome) * 100 : 0;
  const ndi = netIncome - totalMonthlyCommitment;

  // Max Eligible Monthly Commitment based on target DSR Limit
  const maxCommitmentAllowed = (netIncome * (dsrThreshold / 100));
  const maxEligibleInstalment = Math.max(0, maxCommitmentAllowed - totalMonthlyCommitment);

  let status: EligibilityStatus = 'ELIGIBLE';
  if (dsrPercentage > 70 || ndi < 500) {
    status = 'NOT_ELIGIBLE';
  } else if (dsrPercentage > dsrThreshold || ndi < 1000) {
    status = 'BORDERLINE';
  }

  return {
    grossIncome,
    totalDeductions,
    netIncome,
    totalMonthlyCommitment,
    totalSettlement,
    dsrPercentage,
    ndi,
    maxEligibleInstalment,
    status,
  };
}

/**
 * Calculate Debt Consolidation metrics
 */
export function calculateDebtConsolidation(state: DebtConsolidationState): DebtConsolidationResults {
  const {
    totalSettlement,
    financingAmount,
    interestRate,
    loanTenure,
    stampDuty,
    takaful,
    legalFee,
    processingFee,
  } = state;

  const totalFees = (stampDuty || 0) + (takaful || 0) + (legalFee || 0) + (processingFee || 0);
  
  // Cash out = Financing - Total Settlement - Total Fees
  const cashOut = (financingAmount || 0) - (totalSettlement || 0) - totalFees;

  const tenureMonths = (loanTenure || 0) * 12;
  let monthlyInstalment = 0;
  let totalRepayment = 0;

  if (financingAmount > 0 && tenureMonths > 0) {
    // Flat rate assumption for personal debt consolidation
    const totalInterest = financingAmount * (interestRate / 100) * (loanTenure || 0);
    totalRepayment = financingAmount + totalInterest;
    monthlyInstalment = totalRepayment / tenureMonths;
  }

  return {
    monthlyInstalment,
    totalRepayment,
    totalFees,
    cashOut,
  };
}

/**
 * Calculate Personal Loan metrics
 */
export function calculatePersonalLoan(state: PersonalLoanState): PersonalLoanResults {
  const { loanAmount, interestRate, loanTenure, calcType } = state;

  const tenureMonths = (loanTenure || 0) * 12;
  if (loanAmount <= 0 || tenureMonths <= 0) {
    return { monthlyInstalment: 0, totalInterest: 0, totalRepayment: 0 };
  }

  if (calcType === 'FLAT') {
    const totalInterest = loanAmount * (interestRate / 100) * loanTenure;
    const totalRepayment = loanAmount + totalInterest;
    const monthlyInstalment = totalRepayment / tenureMonths;
    return {
      monthlyInstalment,
      totalInterest,
      totalRepayment,
    };
  } else {
    // Reducing Balance (Standard Amortization EMI)
    const monthlyRate = interestRate / 100 / 12;
    if (monthlyRate === 0) {
      const monthlyInstalment = loanAmount / tenureMonths;
      return {
        monthlyInstalment,
        totalInterest: 0,
        totalRepayment: loanAmount,
      };
    }

    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
      (Math.pow(1 + monthlyRate, tenureMonths) - 1);

    const totalRepayment = emi * tenureMonths;
    const totalInterest = totalRepayment - loanAmount;

    return {
      monthlyInstalment: emi,
      totalInterest,
      totalRepayment,
    };
  }
}

/**
 * Generate clean formatted summary text for copying to clipboard
 */
export function generateClipboardText(summary: CalculatorSummary): string {
  const formattedDsr = Math.round(summary.dsrPercentage);
  const formattedNdi = formatCurrency(summary.ndi);
  const formattedMaxInstalment = formatCurrency(summary.maxEligibleInstalment);
  const formattedSettlement = formatCurrency(summary.totalSettlement);
  const formattedCashOut = formatCurrency(summary.cashOut);
  const formattedInstalment = formatCurrency(summary.selectedMonthlyInstalment);

  return [
    `DSR : ${formattedDsr}%`,
    `NDI : ${formattedNdi}`,
    `Eligible Instalment : ${formattedMaxInstalment}`,
    `Settlement : ${formattedSettlement}`,
    `Monthly Instalment : ${formattedInstalment}`,
    `Cash Out : ${formattedCashOut}`,
  ].join('\n');
}
