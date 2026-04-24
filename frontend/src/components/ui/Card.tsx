import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'bg-white border border-card-border rounded-card shadow-card',
        hover && 'cursor-pointer transition-all duration-150 hover:shadow-card-hover hover:-translate-y-0.5',
        onClick && 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  );
}
