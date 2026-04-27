import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatChange } from '../../utils/format';

type Variant = 'success' | 'danger' | 'neutral' | 'amber' | 'violet';

interface BadgeProps {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

interface ChangeBadgeProps {
  value: number;
  showIcon?: boolean;
}

const variantClasses: Record<Variant, string> = {
  success: 'bg-emerald-50 text-success',
  danger: 'bg-red-50 text-danger',
  neutral: 'bg-card text-gray-600',
  amber: 'bg-amber-100 text-amber-500',
  violet: 'bg-violet-100 text-violet-600',
};

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-tag text-xs font-medium',
        variantClasses[variant],
        className,
      ].join(' ')}
    >
      {children}
    </span>
  );
}

export function ChangeBadge({ value, showIcon = true }: ChangeBadgeProps) {
  const positive = value >= 0;
  return (
    <Badge variant={positive ? 'success' : 'danger'}>
      {showIcon &&
        (positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />)}
      {formatChange(value)}
    </Badge>
  );
}
