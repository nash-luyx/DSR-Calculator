import React from 'react';
import { CurrencyInput } from './CurrencyInput';
import { PersonalLoanState, PersonalLoanResults } from '../types/calculator';
import { formatCurrency } from '../utils/formatters';

interface PersonalLoanCalculatorProps {
  state: PersonalLoanState;
  setState: React.Dispatch<React.SetStateAction<PersonalLoanState>>;
  results: PersonalLoanResults;
}

export const PersonalLoanCalculator: React.FC<PersonalLoanCalculatorProps> = ({
  state,
  setState,
  results,
}) => {
  const updateField = (field: keyof PersonalLoanState, value: any) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Card Header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            Section 3: Personal Loan Calculator
          </h2>
          <p className="text-xs text-slate-500">
            Compare flat rate personal financing vs reducing balance (amortized) loan options.
          </p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <CurrencyInput
            label="Loan Amount Requested"
            value={state.loanAmount}
            onChange={(v) => updateField('loanAmount', v)}
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="pl-interest-rate" className="text-xs font-semibold text-slate-700 tracking-wide">
              Interest Rate (% p.a.)
            </label>
            <div className="relative flex items-center rounded-lg border border-slate-300 bg-white shadow-xs overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100">
              <input
                id="pl-interest-rate"
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={state.interestRate || ''}
                onChange={(e) => updateField('interestRate', parseFloat(e.target.value) || 0)}
                placeholder="3.88"
                className="w-full py-2.5 px-3 text-slate-900 font-bold text-base bg-transparent focus:outline-none"
              />
              <span className="pr-3 text-slate-500 font-bold text-sm select-none">%</span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="pl-loan-tenure" className="text-xs font-semibold text-slate-700 tracking-wide">
              Loan Tenure (Years)
            </label>
            <select
              id="pl-loan-tenure"
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

          {/* Calculation Type Toggle */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-slate-700 tracking-wide">
              Calculation Type
            </label>
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 h-[46px] items-center">
              <button
                type="button"
                onClick={() => updateField('calcType', 'FLAT')}
                className={`h-full text-xs font-bold rounded-md transition-all ${
                  state.calcType === 'FLAT'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Flat Rate
              </button>
              <button
                type="button"
                onClick={() => updateField('calcType', 'REDUCING')}
                className={`h-full text-xs font-bold rounded-md transition-all ${
                  state.calcType === 'REDUCING'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Reducing Bal.
              </button>
            </div>
          </div>
        </div>

        {/* Live Calculation Results */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-slate-100 pt-5">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider block mb-1">
              Monthly Instalment
            </span>
            <span className="text-2xl font-extrabold text-blue-700">
              {formatCurrency(results.monthlyInstalment)}
            </span>
            <span className="text-[11px] text-blue-600 block mt-1">
              {state.calcType === 'FLAT' ? 'Fixed monthly payment' : 'Amortized monthly instalment'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">
              Total Interest Payable
            </span>
            <span className="text-2xl font-extrabold text-slate-800">
              {formatCurrency(results.totalInterest)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-1">
              Total interest charged over {state.loanTenure} years
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
              Principal ({formatCurrency(state.loanAmount)}) + Total Interest
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
