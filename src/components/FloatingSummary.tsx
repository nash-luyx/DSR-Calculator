import React, { useState } from 'react';
import { CalculatorSummary } from '../types/calculator';
import { formatCurrency, generateClipboardText } from '../utils/formatters';

interface FloatingSummaryProps {
  summary: CalculatorSummary;
  onReset: () => void;
}

export const FloatingSummary: React.FC<FloatingSummaryProps> = ({ summary, onReset }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyResults = () => {
    const textToCopy = generateClipboardText(summary);
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const formattedDsr = Math.round(summary.dsrPercentage);

  return (
    <>
      {/* Desktop Sticky Floating Side Card */}
      <aside className="hidden lg:block sticky top-20 w-80 shrink-0">
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl border border-slate-800 space-y-5">
          {/* Card Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse"></span>
              <h3 className="text-sm font-bold tracking-wider text-slate-100 uppercase">
                Live Summary
              </h3>
            </div>
            <span className="text-[10px] uppercase font-extrabold bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-700/50">
              Auto-Sync
            </span>
          </div>

          {/* Specified 6 Metrics Only */}
          <div className="space-y-3 font-mono text-xs">
            {/* 1. DSR */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 font-sans font-medium text-xs">DSR</span>
              <span className={`font-bold text-sm ${formattedDsr <= 60 ? 'text-emerald-400' : formattedDsr <= 70 ? 'text-amber-400' : 'text-rose-400'}`}>
                {formattedDsr}%
              </span>
            </div>

            {/* 2. NDI */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 font-sans font-medium text-xs">NDI</span>
              <span className="font-bold text-sm text-slate-100">
                {formatCurrency(summary.ndi)}
              </span>
            </div>

            {/* 3. Maximum Instalment */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 font-sans font-medium text-xs">Maximum Instalment</span>
              <span className="font-bold text-sm text-blue-400">
                {formatCurrency(summary.maxEligibleInstalment)}
              </span>
            </div>

            {/* 4. Total Settlement */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 font-sans font-medium text-xs">Total Settlement</span>
              <span className="font-bold text-sm text-slate-100">
                {formatCurrency(summary.totalSettlement)}
              </span>
            </div>

            {/* 5. Monthly Instalment */}
            <div className="flex items-center justify-between py-1.5 border-b border-slate-800/60">
              <span className="text-slate-400 font-sans font-medium text-xs">Monthly Instalment</span>
              <span className="font-bold text-sm text-blue-400">
                {formatCurrency(summary.selectedMonthlyInstalment)}
              </span>
            </div>

            {/* 6. Cash Out */}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-slate-400 font-sans font-medium text-xs">Cash Out</span>
              <span className={`font-bold text-sm ${summary.cashOut >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(summary.cashOut)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onReset}
              className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset All
            </button>

            <button
              type="button"
              onClick={handleCopyResults}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors shadow-sm flex items-center justify-center gap-1.5 relative overflow-hidden"
            >
              {copied ? (
                <>
                  <svg className="w-3.5 h-3.5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-emerald-200">Copied!</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  <span>Copy Results</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile / Tablet Fixed Bottom Floating Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 border-t border-slate-800 text-white shadow-2xl p-3">
        <div className="max-w-7xl mx-auto space-y-2">
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-1 text-center font-mono text-[11px]">
            <div className="bg-slate-800/80 p-1.5 rounded">
              <span className="text-[10px] text-slate-400 block font-sans">DSR</span>
              <span className={`font-bold ${formattedDsr <= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {formattedDsr}%
              </span>
            </div>
            <div className="bg-slate-800/80 p-1.5 rounded">
              <span className="text-[10px] text-slate-400 block font-sans">NDI</span>
              <span className="font-bold text-slate-100">{formatCurrency(summary.ndi)}</span>
            </div>
            <div className="bg-slate-800/80 p-1.5 rounded">
              <span className="text-[10px] text-slate-400 block font-sans">Cash Out</span>
              <span className={`font-bold ${summary.cashOut >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(summary.cashOut)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onReset}
              className="py-2 px-3 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg text-center"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={handleCopyResults}
              className="py-2 px-3 bg-blue-600 text-white font-bold text-xs rounded-lg text-center flex items-center justify-center gap-1"
            >
              {copied ? '✓ Copied!' : 'Copy Results'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
