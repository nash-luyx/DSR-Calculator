export interface IncomeState {
  basicSalary: number;
  fixedAllowance1: number;
  fixedAllowance2: number;
  fixedAllowance3: number;
  commission: number;
  otherIncome: number;
}

export interface DeductionsState {
  epf: number;
  socso: number;
  pcb: number;
  otherDeductions: number;
}

export interface CommitmentRow {
  id: string;
  loanType: string;
  monthlyCommitment: number;
  settlementAmount: number;
}

export type EligibilityStatus = 'ELIGIBLE' | 'BORDERLINE' | 'NOT_ELIGIBLE';

export interface DsrResults {
  grossIncome: number;
  totalDeductions: number;
  netIncome: number;
  totalMonthlyCommitment: number;
  totalSettlement: number;
  dsrPercentage: number;
  ndi: number;
  maxEligibleInstalment: number;
  status: EligibilityStatus;
}

export interface DebtConsolidationState {
  totalSettlement: number;
  financingAmount: number;
  interestRate: number; // annual percentage
  loanTenure: number; // in years
  stampDuty: number;
  takaful: number;
  legalFee: number;
  processingFee: number;
}

export interface DebtConsolidationResults {
  monthlyInstalment: number;
  totalRepayment: number;
  totalFees: number;
  cashOut: number;
}

export type PersonalLoanCalcType = 'FLAT' | 'REDUCING';

export interface PersonalLoanState {
  loanAmount: number;
  interestRate: number; // annual percentage
  loanTenure: number; // in years
  calcType: PersonalLoanCalcType;
}

export interface PersonalLoanResults {
  monthlyInstalment: number;
  totalInterest: number;
  totalRepayment: number;
}

export interface CalculatorSummary {
  dsrPercentage: number;
  ndi: number;
  maxEligibleInstalment: number;
  totalSettlement: number;
  selectedMonthlyInstalment: number;
  cashOut: number;
}
