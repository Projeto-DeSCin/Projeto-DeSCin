interface TickerLabelProps {
  ticker: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'text-xs px-1.5 py-0.5',
  md: 'text-sm px-2 py-1',
  lg: 'text-base px-3 py-1.5',
};

export function TickerLabel({ ticker, size = 'md', className = '' }: TickerLabelProps) {
  return (
    <span
      className={[
        'font-mono font-medium text-violet-600 bg-violet-50 rounded-tag border border-violet-100',
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {ticker}
    </span>
  );
}
