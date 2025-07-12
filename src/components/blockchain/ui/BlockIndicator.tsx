import { useEffect, useState } from 'react';
import type { BlockIndicatorProps } from '../../../types/blockchain';
import { formatBlockNumber } from '../../../utils/blockchain-helpers';

export const BlockIndicator = ({ 
  currentBlock, 
  chainId, 
  isConnected, 
  theme = 'dark' 
}: BlockIndicatorProps) => {
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<number>(0);

  useEffect(() => {
    if (currentBlock) {
      setLastUpdate(new Date());
      setTimeSinceUpdate(0);
    }
  }, [currentBlock]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSinceUpdate(Math.floor((new Date().getTime() - lastUpdate.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [lastUpdate]);

  if (!isConnected || chainId !== 8899) return null; // Only show for JIBCHAIN L1

  const getStatusColor = () => {
    if (timeSinceUpdate <= 3) return 'bg-green-500';
    if (timeSinceUpdate <= 10) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (timeSinceUpdate <= 3) return 'Live';
    if (timeSinceUpdate <= 10) return 'Delayed';
    return 'Stale';
  };

  return (
    <div className={`flex items-center space-x-2 text-sm ${
      theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
    }`}>
      <div className="flex items-center space-x-1">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
        <span className="font-mono">
          Block #{currentBlock ? formatBlockNumber(currentBlock) : '...'}
        </span>
      </div>
      
      <span className="text-xs opacity-75">
        {getStatusText()} ({timeSinceUpdate}s)
      </span>
    </div>
  );
};