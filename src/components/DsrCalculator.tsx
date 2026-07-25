import React from 'react';
import { CurrencyInput } from './CurrencyInput';
import {
  IncomeState,
  DeductionsState,
  CommitmentRow,
  DsrResults,
} from '../types/calculator';
import { formatCurrency } from '../utils/formatters';

interface DsrCalculatorProps {
  income: IncomeState;
  setIncome: React.Dispatch<React.SetStateAction<IncomeState>>;
  deductions: DeductionsState;
  setDeductions: React.Dispatch<React.SetStateAction<DeductionsState>>;
  commitments: CommitmentRow[];
  setCommitments: React.Dispatch<React.SetStateAction<CommitmentRow[]>>;
  dsrThreshold: number;
  setDsrThreshold: (val: number) => void;
  results: DsrResults;
}

const COMMON_LOAN_TYPES = [
  'Housing Loan / Mortgages',
  'Car Loan / Hire Purchase',
  'Personal Loan',
  'Credit Card (5% Min)',
  'ASB Financing',
  'Overdraft / Credit Line',
  'Cooperative Loan (Koperasi)',
  'Other Commitment',
];

export const DsrCalculator: React.FC<DsrCalculatorProps> = ({
  income,
  setIncome,
  deductions,
  setDeductions,
  commitments,
  setCommitments,
  dsrThreshold,
  setDsrThreshold,
  results,
}) => {
  const updateIncomeField = (field: keyof IncomeState, value: number) => {
    setIncome((prev) => ({ ...prev, [field]: value }));
  };

  const updateDeductionField = (field: keyof DeductionsState, value: number) => {
    setDeductions((prev) => ({ ...prev, [field]: value }));
  };

  const addCommitmentRow = () => {
    const newRow: CommitmentRow = {
      id: 'row-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      loanType: COMMON_LOAN_TYPES[0],
      monthlyCommitment: 0,
      settlementAmount: 0,
    };
    setCommitments((prev) => [...prev, newRow]);
  };

  const deleteCommitmentRow = (id: string) => {
    setCommitments((prev) => prev.filter((r) => r.id !== id));
  };

  const updateCommitmentRow = (
    id: string,
    field: keyof CommitmentRow,
    value: string | number
  ) => {
    setCommitments((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Color styling based on eligibility status
  const getStatusStyles = () => {
    switch (results.status) {
      case 'ELIGIBLE':
        return {
          bg: 'bg-emerald-50 border-emerald-300',
          text: 'text-emerald-800',
          badgeBg: 'bg-emerald-600 text-white',
          label: 'Eligible',
          icon: '✓',
        };
      case 'BORDERLINE':
        return {
          bg: 'bg-amber-50 border-amber-300',
          text: 'text-amber-800',
          badgeBg: 'bg-amber-500 text-white',
          label: 'Borderline',
          icon: '!',
        };
      case 'NOT_ELIGIBLE':
      default:
        return {
          bg: 'bg-rose-50 border-rose-300',
          text: 'text-rose-800',
          badgeBg: 'bg-rose-600 text-white',
          label: 'Not Eligible',
          icon: '✕',
        };
    }
  };

  const statusStyle = getStatusStyles();

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Section 1: DSR & NDI Calculator
          </h2>
          <p className="text-xs text-slate-500">
            Calculate Gross Income, Net Income, Total Commitments, and Debt Service Ratio eligibility.
          </p>
        </div>

        {/* Target DSR Threshold Configuration */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
          <label htmlFor="dsr-limit" className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Max DSR Limit:
          </label>
          <div className="flex items-center w-20">
            <input
              id="dsr-limit"
              type="number"
              min="1"
              max="100"
              value={dsrThreshold}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= 100) {
                  setDsrThreshold(val);
                }
              }}
              className="w-12 py-1 px-1 text-center font-bold text-slate-900 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-600"
            />
            <span className="ml-1 text-xs font-bold text-slate-600">%</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Income Subsection */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              1. Customer Income
            </h3>
            <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
              Gross Income: <span className="text-blue-700 font-bold">{formatCurrency(results.grossIncome)}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CurrencyInput
              label="Basic Salary"
              value={income.basicSalary}
              onChange={(v) => updateIncomeField('basicSalary', v)}
            />
            <CurrencyInput
              label="Fixed Allowance 1"
              value={income.fixedAllowance1}
              onChange={(v) => updateIncomeField('fixedAllowance1', v)}
            />
            <CurrencyInput
              label="Fixed Allowance 2"
              value={income.fixedAllowance2}
              onChange={(v) => updateIncomeField('fixedAllowance2', v)}
            />
            <CurrencyInput
              label="Fixed Allowance 3"
              value={income.fixedAllowance3}
              onChange={(v) => updateIncomeField('fixedAllowance3', v)}
            />
            <CurrencyInput
              label="Commission (Avg / Declared)"
              value={income.commission}
              onChange={(v) => updateIncomeField('commission', v)}
            />
            <CurrencyInput
              label="Other Income"
              value={income.otherIncome}
              onChange={(v) => updateIncomeField('otherIncome', v)}
            />
          </div>
        </div>

        {/* Statutory Deductions Subsection */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              2. Statutory Deductions
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Deductions: <strong className="text-rose-600">{formatCurrency(results.totalDeductions)}</strong>
              </span>
              <span className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
                Net Income: <span className="text-emerald-700 font-bold">{formatCurrency(results.netIncome)}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <CurrencyInput
              label="EPF (KWSP)"
              value={deductions.epf}
              onChange={(v) => updateDeductionField('epf', v)}
            />
            <CurrencyInput
              label="SOCSO (PERKESO)"
              value={deductions.socso}
              onChange={(v) => updateDeductionField('socso', v)}
            />
            <CurrencyInput
              label="PCB (Tax)"
              value={deductions.pcb}
              onChange={(v) => updateDeductionField('pcb', v)}
            />
            <CurrencyInput
              label="Other Deductions"
              value={deductions.otherDeductions}
              onChange={(v) => updateDeductionField('otherDeductions', v)}
            />
          </div>
        </div>

        {/* Existing Commitments Subsection */}
        <div>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                3. Existing Commitments
              </h3>
              <p className="text-xs text-slate-500">Add dynamic commitment rows for accurate total calculations.</p>
            </div>
            <button
              type="button"
              onClick={addCommitmentRow}
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3 py-2 rounded-lg transition-colors shadow-2xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Loan
            </button>
          </div>

          {/* Commitment Rows Table */}
          <div className="space-y-3">
            {commitments.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No existing commitments added yet.</p>
                <button
                  type="button"
                  onClick={addCommitmentRow}
                  className="mt-2 text-xs font-semibold text-blue-600 hover:underline"
                >
                  + Add First Commitment
                </button>
              </div>
            ) : (
              commitments.map((row, index) => (
                <div
                  key={row.id}
                  className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="w-6 text-xs font-bold text-slate-400 self-center hidden sm:block">
                    #{index + 1}
                  </div>
                  
                  {/* Loan Type */}
                  <div className="flex-1">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Loan Type</label>
                    <select
                      value={row.loanType}
                      onChange={(e) => updateCommitmentRow(row.id, 'loanType', e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                    >
                      {COMMON_LOAN_TYPES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Monthly Commitment */}
                  <div className="w-full sm:w-44">
                    <CurrencyInput
                      label="Monthly Commitment"
                      value={row.monthlyCommitment}
                      onChange={(v) => updateCommitmentRow(row.id, 'monthlyCommitment', v)}
                    />
                  </div>

                  {/* Settlement Amount */}
                  <div className="w-full sm:w-44">
                    <CurrencyInput
                      label="Settlement Amount"
                      value={row.settlementAmount}
                      onChange={(v) => updateCommitmentRow(row.id, 'settlementAmount', v)}
                    />
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => deleteCommitmentRow(row.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors self-end border border-transparent hover:border-rose-200"
                    title="Delete commitment"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Commitments Summary Sub-bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between bg-slate-100 p-3 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700">
            <div>
              Total Monthly Commitment:{' '}
              <span className="text-slate-900 font-bold text-sm ml-1">
                {formatCurrency(results.totalMonthlyCommitment)}
              </span>
            </div>
            <div>
              Total Settlement Required:{' '}
              <span className="text-blue-700 font-bold text-sm ml-1">
                {formatCurrency(results.totalSettlement)}
              </span>
            </div>
          </div>
        </div>

        {/* Section 1 Results Cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
              DSR & NDI Results
            </h3>
            <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 ${statusStyle.badgeBg}`}>
              <span>{statusStyle.icon}</span>
              <span>{statusStyle.label}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* DSR Card */}
            <div className={`p-5 rounded-xl border ${statusStyle.bg} transition-colors flex flex-col justify-between`}>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">DSR %</span>
              <div className="my-2">
                <span className={`text-3xl font-extrabold ${statusStyle.text}`}>
                  {results.dsrPercentage.toFixed(1)}%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Limit: {dsrThreshold}% ({results.dsrPercentage <= dsrThreshold ? 'Within standard' : 'Exceeds standard'})
              </p>
            </div>

            {/* NDI Card */}
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                Net Disposable Income (NDI)
              </span>
              <div className="my-2">
                <span className={`text-3xl font-extrabold ${results.ndi >= 1000 ? 'text-emerald-700' : results.ndi >= 500 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {formatCurrency(results.ndi)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Net Income minus total commitments
              </p>
            </div>

            {/* Max Eligible Instalment Card */}
            <div className="p-5 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-col justify-between">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                Maximum Eligible Instalment
              </span>
              <div className="my-2">
                <span className="text-3xl font-extrabold text-blue-700">
                  {formatCurrency(results.maxEligibleInstalment)}
                </span>
              </div>
              <p className="text-[11px] text-blue-600/80 font-medium">
                Available monthly headroom at {dsrThreshold}% DSR
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
