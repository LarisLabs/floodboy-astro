import type { ErrorDisplayProps } from '../../../types/blockchain';

export const ErrorDisplay = ({ error, onRetry, className = '' }: ErrorDisplayProps) => {
  return (
    <div className={`bg-red-900/20 border border-red-700 rounded-lg p-4 ${className}`}>
      <p className="text-red-400 mb-2">{error}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-3 py-1 bg-red-700 rounded text-sm hover:bg-red-600 transition-colors text-white"
        >
          Retry
        </button>
      )}
    </div>
  );
};