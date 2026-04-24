import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-card flex items-center justify-center text-violet-400 mb-4">
        {icon}
      </div>
      <h3 className="font-display font-bold text-ink text-lg mb-1">{title}</h3>
      {description && (
        <p className="text-gray-400 text-sm max-w-xs mb-6">{description}</p>
      )}
      {action}
    </div>
  );
}
