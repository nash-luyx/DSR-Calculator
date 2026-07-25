import React, { useState, useEffect } from 'react';
import { formatCurrency, parseCurrencyInput } from '../utils/formatters';

interface CurrencyInputProps {
  id?: string;
  label?: string;
  value: number;
  onChange: (val: number) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  className?: string;
}

export const CurrencyInput: React.FC<CurrencyInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder = '0.00',
  prefix = 'RM',
  suffix,
  isInvalid = false,
  errorMessage,
  disabled = false,
  className = '',
}) => {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [hasValidationError, setHasValidationError] = useState<boolean>(false);

  // Sync internal display text when external raw value changes and not actively typing
  useEffect(() => {
    if (!isFocused) {
      if (value === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(
          value.toLocaleString('en-US', {
            minimumFractionDigits: value % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
          })
        );
      }
    }
  }, [value, isFocused]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;

    // Reject negative signs or disallowed characters
    if (rawVal.includes('-')) {
      setHasValidationError(true);
      return;
    } else {
      setHasValidationError(false);
    }

    // Extract digits and at most one dot
    const cleanDigits = rawVal.replace(/[^\d.]/g, '');
    const parts = cleanDigits.split('.');
    
    let formatted = cleanDigits;
    if (parts.length > 2) {
      formatted = parts[0] + '.' + parts.slice(1).join('');
    }

    // Limit decimal to 2 places
    if (parts[1] && parts[1].length > 2) {
      formatted = parts[0] + '.' + parts[1].slice(0, 2);
    }

    // Live format whole integer portion with commas
    if (formatted) {
      const wholePart = parts[0] ? parseInt(parts[0], 10).toLocaleString('en-US') : '0';
      const decPart = parts[1] !== undefined ? '.' + parts[1].slice(0, 2) : formatted.endsWith('.') ? '.' : '';
      setDisplayValue(wholePart + decPart);
    } else {
      setDisplayValue('');
    }

    const numericVal = parseCurrencyInput(formatted);
    onChange(numericVal);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    // Select all for super fast input replacement by telesales staff
    setTimeout(() => {
      e.target.select();
    }, 10);
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (value > 0) {
      setDisplayValue(
        value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      );
    } else {
      setDisplayValue('');
    }
  };

  const isError = isInvalid || hasValidationError;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={id} className="text-xs font-semibold text-slate-700 tracking-wide">
          {label}
        </label>
      )}
      <div
        className={`relative flex items-center rounded-lg border bg-white shadow-xs transition-colors overflow-hidden ${
          isError
            ? 'border-rose-500 ring-2 ring-rose-200'
            : isFocused
            ? 'border-blue-600 ring-2 ring-blue-100'
            : 'border-slate-300 hover:border-slate-400'
        } ${disabled ? 'bg-slate-50 cursor-not-allowed' : ''}`}
      >
        {prefix && (
          <span className="pl-3 pr-1 text-slate-500 font-semibold text-sm select-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="w-full py-2.5 px-2 text-slate-900 font-bold text-base bg-transparent focus:outline-none placeholder:text-slate-300 placeholder:font-normal"
        />
        {suffix && (
          <span className="pr-3 pl-1 text-slate-500 font-medium text-sm select-none">
            {suffix}
          </span>
        )}
      </div>
      {isError && (
        <p className="text-[11px] font-medium text-rose-600">
          {errorMessage || 'Numbers only, no negative values allowed.'}
        </p>
      )}
    </div>
  );
};
