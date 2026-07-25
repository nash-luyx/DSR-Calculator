import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const tools = [
    { id: 'dsr-toolkit', name: 'DSR & Loan Toolkit', active: true },
    { id: 'mortgage', name: 'Mortgage Calculator', active: false, badge: 'Soon' },
    { id: 'ccris', name: 'CCRIS Summary', active: false, badge: 'Soon' },
    { id: 'dsr-comparison', name: 'DSR Comparison', active: false, badge: 'Soon' },
    { id: 'commission', name: 'Commission Calc', active: false, badge: 'Soon' },
    { id: 'loan-margin', name: 'Loan Margin', active: false, badge: 'Soon' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3.5 gap-3">
          {/* Header Title & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-xs">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Malaysia Loan Toolkit</h1>
                <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-md border border-blue-200">
                  Internal Banking System
                </span>
              </div>
              <p className="text-xs font-medium text-slate-500">Internal Financial Calculator for Telesales & Advisory</p>
            </div>
          </div>

          {/* System Environment Info */}
          <div className="flex items-center gap-3 text-xs text-slate-500 self-start md:self-auto">
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-medium px-2.5 py-1 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Calculation Engine
            </span>
            <span className="hidden sm:inline-block text-slate-400">|</span>
            <span className="hidden sm:inline-block font-mono text-slate-400">v2.4.0-internal</span>
          </div>
        </div>

        {/* Modular Expansion Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 no-scrollbar text-xs">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => tool.active && setActiveTab(tool.id)}
              disabled={!tool.active}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                tool.id === activeTab
                  ? 'bg-blue-600 text-white shadow-xs'
                  : tool.active
                  ? 'text-slate-600 hover:bg-slate-100'
                  : 'text-slate-400 cursor-not-allowed bg-slate-50'
              }`}
            >
              <span>{tool.name}</span>
              {tool.badge && (
                <span className="text-[10px] uppercase font-bold bg-slate-200 text-slate-600 px-1.5 py-0.2 rounded">
                  {tool.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
