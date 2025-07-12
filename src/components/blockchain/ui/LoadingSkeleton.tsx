import type { LoadingSkeletonProps } from '../../../types/blockchain';

export const LoadingSkeleton = ({ lines = 3, className = '' }: LoadingSkeletonProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="loading-skeleton h-4 bg-gray-700 rounded w-3/4 animate-pulse"
        />
      ))}
    </div>
  );
};