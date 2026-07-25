import React, { useEffect } from 'react';
import { CurrencyInput } from './CurrencyInput';
import { DebtConsolidationState, DebtConsolidationResults } from '../types/calculator';
import { formatCurrency } from '../utils/formatters';

interface DebtConsolidationCalculatorProps {
  state: DebtConsolidationState;
  setState: React.Dispatch<React.SetStateAction<DebtConsolidationState>>;
  results: DebtConsolidationResults;
  section1TotalSettlement: number;
}

export const DebtConsolidationCalculator: React.FC<DebtConsolidationCalculatorProps> = ({
  state,
  setState,
  results,
  section1TotalSettlement,
}) => {
  // Sync total settlement automatically from Section 1 when Section 1 settlement changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      totalSettlement: section1TotalSettlement,
    }));
  }, [section1TotalSettlement, setState]);

  const updateField = (field: keyof DebtConsolidationState, value: number) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Section 2: Debt Consolidation Calculator
          </h2>
          <p className="text-xs text-slate-500">
            Combine existing settlements into a single new loan and calculate net cash out to customer.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Main Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CurrencyInput
            label="Total Settlement Required"
            value={state.totalSettlement}
            onChange={(v) => updateField('totalSettlement', v)}
          />

          <CurrencyInput
            label="Financing Amount (New Loan)"
            value={state.financingAmount}
            onChange={(v) => updateField('financingAmount', v)}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="dc-interest-rate" className="text-xs font-semibold text-slate-700 tracking-wide">
              Interest Rate (% p.a.)
            </label>
            <div className="relative flex items-center rounded-lg border border-slate-300 bg-white shadow-xs overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
              <input
                id="dc-interest-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={state.interestRate || ''}
                onChange={(e) => updateField('interestRate', parseFloat(e.target.value) || 0)}
                placeholder="4.50"
                className="w-full py-2.5 px-3 text-slate-900 font-bold text-base bg-transparent focus:outline-none"
              />
              <span className="pr-3 text-slate-500 font-bold text-sm select-none">%</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="dc-loan-tenure" className="text-xs font-semibold text-slate-700 tracking-wide">
              Loan Tenure (Years)
            </label>
            <select
              id="dc-loan-tenure"
              value={state.loanTenure}
              onChange={(e) => updateField('loanTenure', parseInt(e.target.value, 10) || 1)}
              className="w-full py-2.5 px-3 bg-white border border-slate-300 rounded-lg font-bold text-slate-900 text-base shadow-xs focus:outline-none focus:border-blue-600"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((yr) => (
                <option key={yr} value={yr}>
                  {yr} {yr === 1 ? 'Year' : 'Years'} ({yr * 12} Months)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Fees Subsection */}
        <div>
          <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Deductions & Loan Processing Fees
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <CurrencyInput
              label="Stamp Duty"
              value={state.stampDuty}
              onChange={(v) => updateField('stampDuty', v)}
            />
            <CurrencyInput
              label="Takaful / Insurance"
              value={state.takaful}
              onChange={(v) => updateField('takaful', v)}
            />
            <CurrencyInput
              label="Legal Fee"
              value={state.legalFee}
              onChange={(v) => updateField('legalFee', v)}
            />
            <CurrencyInput
              label="Processing Fee"
              value={state.processingFee}
              onChange={(v) => updateField('processingFee', v)}
            />
          </div>
        </div>

        {/* Results Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block mb-1">
              Monthly Instalment
            </span>
            <span className="text-2xl font-extrabold text-blue-700">
              {formatCurrency(results.monthlyInstalment)}
            </span>
            <span className="text-[11px] text-blue-600 block mt-1">
              {state.loanTenure * 12} monthly payments
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Total Repayment
            </span>
            <span className="text-2xl font-extrabold text-slate-800">
              {formatCurrency(results.totalRepayment)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Principal + Interest over {state.loanTenure} years
            </span>
          </div>

          <div className={`p-4 rounded-xl border ${results.cashOut >= 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'}`}>
            <span className={`text-xs font-bold uppercase tracking-wider block mb-1 ${results.cashOut >= 0 ? 'text-emerald-800' : 'text-rose-800'}`}>
              Net Cash Out to Customer
            </span>
            <span className={`text-2xl font-extrabold ${results.cashOut >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {formatCurrency(results.cashOut)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Financing minus settlement & fees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
