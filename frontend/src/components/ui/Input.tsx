import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
}

export function Input({ label, error, prefix, suffix, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className="absolute left-3 text-gray-400 pointer-events-none select-none">
            {prefix}
          </span>
        )}
        <input
          className={[
            'w-full border border-card-border rounded-input bg-white px-3 py-2.5',
            'text-sm text-ink placeholder-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent',
            'transition-all duration-150',
            prefix ? 'pl-8' : '',
            suffix ? 'pr-8' : '',
            error ? 'border-danger' : '',
            className,
          ]
            .join(' ')
            .trim()}
          {...props}
        />
        {suffix && (
          <span className="absolute right-3 text-gray-400 pointer-events-none select-none">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
