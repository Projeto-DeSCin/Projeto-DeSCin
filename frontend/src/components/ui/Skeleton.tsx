interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={['animate-pulse bg-card rounded-input', className].join(' ')}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-card-border rounded-card shadow-card p-6">
      <Skeleton className="h-4 w-1/3 mb-4" />
      <Skeleton className="h-8 w-2/3 mb-2" />
      <Skeleton className="h-4 w-1/2" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 py-4 px-6">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-6 w-16 rounded-tag" />
    </div>
  );
}
