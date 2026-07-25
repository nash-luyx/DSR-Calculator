import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { DsrCalculator } from './components/DsrCalculator';
import { DebtConsolidationCalculator } from './components/DebtConsolidationCalculator';
import { PersonalLoanCalculator } from './components/PersonalLoanCalculator';
import { FloatingSummary } from './components/FloatingSummary';
import {
  IncomeState,
  DeductionsState,
  CommitmentRow,
  DebtConsolidationState,
  PersonalLoanState,
  CalculatorSummary,
} from './types/calculator';
import {
  calculateDsrResults,
  calculateDebtConsolidation,
  calculatePersonalLoan,
} from './utils/formatters';

const INITIAL_INCOME: IncomeState = {
  basicSalary: 0,
  fixedAllowance1: 0,
  fixedAllowance2: 0,
  fixedAllowance3: 0,
  commission: 0,
  otherIncome: 0,
};

const INITIAL_DEDUCTIONS: DeductionsState = {
  epf: 0,
  socso: 0,
  pcb: 0,
  otherDeductions: 0,
};

const INITIAL_COMMITMENTS: CommitmentRow[] = [
  {
    id: 'c-1',
    loanType: 'Housing Loan / Mortgages',
    monthlyCommitment: 0,
    settlementAmount: 0,
  },
  {
    id: 'c-2',
    loanType: 'Car Loan / Hire Purchase',
    monthlyCommitment: 0,
    settlementAmount: 0,
  },
  {
    id: 'c-3',
    loanType: 'Personal Loan',
    monthlyCommitment: 0,
    settlementAmount: 0,
  },
];

const INITIAL_DEBT_CONSOLIDATION: DebtConsolidationState = {
  totalSettlement: 0,
  financingAmount: 0,
  interestRate: 4.5,
  loanTenure: 5,
  stampDuty: 0,
  takaful: 0,
  legalFee: 0,
  processingFee: 0,
};

const INITIAL_PERSONAL_LOAN: PersonalLoanState = {
  loanAmount: 0,
  interestRate: 3.88,
  loanTenure: 5,
  calcType: 'FLAT',
};

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dsr-toolkit');
  const [dsrThreshold, setDsrThreshold] = useState<number>(60);

  const [income, setIncome] = useState<IncomeState>(INITIAL_INCOME);
  const [deductions, setDeductions] = useState<DeductionsState>(INITIAL_DEDUCTIONS);
  const [commitments, setCommitments] = useState<CommitmentRow[]>(INITIAL_COMMITMENTS);

  const [debtConsolidation, setDebtConsolidation] =
    useState<DebtConsolidationState>(INITIAL_DEBT_CONSOLIDATION);

  const [personalLoan, setPersonalLoan] =
    useState<PersonalLoanState>(INITIAL_PERSONAL_LOAN);

  // Instant calculation updates
  const dsrResults = useMemo(() => {
    return calculateDsrResults(income, deductions, commitments, dsrThreshold);
  }, [income, deductions, commitments, dsrThreshold]);

  const debtConsolidationResults = useMemo(() => {
    return calculateDebtConsolidation(debtConsolidation);
  }, [debtConsolidation]);

  const personalLoanResults = useMemo(() => {
    return calculatePersonalLoan(personalLoan);
  }, [personalLoan]);

  // Derived summary for floating card & clipboard export
  const summary: CalculatorSummary = useMemo(() => {
    const selectedMonthlyInstalment =
      debtConsolidationResults.monthlyInstalment > 0
        ? debtConsolidationResults.monthlyInstalment
        : personalLoanResults.monthlyInstalment;

    return {
      dsrPercentage: dsrResults.dsrPercentage,
      ndi: dsrResults.ndi,
      maxEligibleInstalment: dsrResults.maxEligibleInstalment,
      totalSettlement: dsrResults.totalSettlement,
      selectedMonthlyInstalment,
      cashOut: debtConsolidationResults.cashOut,
    };
  }, [dsrResults, debtConsolidationResults, personalLoanResults]);

  // Reset all fields across every section
  const handleResetAll = () => {
    setIncome(INITIAL_INCOME);
    setDeductions(INITIAL_DEDUCTIONS);
    setCommitments(INITIAL_COMMITMENTS);
    setDsrThreshold(60);
    setDebtConsolidation(INITIAL_DEBT_CONSOLIDATION);
    setPersonalLoan(INITIAL_PERSONAL_LOAN);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 flex flex-col pb-24 lg:pb-12">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Main Calculator Column */}
          <div className="flex-1 w-full space-y-6">
            {/* Section 1: DSR & NDI Calculator */}
            <DsrCalculator
              income={income}
              setIncome={setIncome}
              deductions={deductions}
              setDeductions={setDeductions}
              commitments={commitments}
              setCommitments={setCommitments}
              dsrThreshold={dsrThreshold}
              setDsrThreshold={setDsrThreshold}
              results={dsrResults}
            />

            {/* Section 2: Debt Consolidation Calculator */}
            <DebtConsolidationCalculator
              state={debtConsolidation}
              setState={setDebtConsolidation}
              results={debtConsolidationResults}
              section1TotalSettlement={dsrResults.totalSettlement}
            />

            {/* Section 3: Personal Loan Calculator */}
            <PersonalLoanCalculator
              state={personalLoan}
              setState={setPersonalLoan}
              results={personalLoanResults}
            />
          </div>

          {/* Floating Sticky Summary Panel */}
          <FloatingSummary summary={summary} onReset={handleResetAll} />
        </div>
      </main>

      {/* Internal Advisory Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p>© 2026 Malaysia Loan Toolkit - Internal Advisory System</p>
          <p className="text-slate-400">Strictly for Internal Bank & Financial Sales Use Only</p>
        </div>
      </footer>
    </div>
  );
};
