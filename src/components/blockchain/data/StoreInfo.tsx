import { useState } from 'react';
import { formatAddress, copyToClipboard } from '../../../utils/blockchain-helpers';
import { getCardClasses, getBadgeClasses } from '../../../utils/theme-utils';
import type { StoreInfoProps } from '../../../types/blockchain';

export const StoreInfo = ({ 
  storeData, 
  isOwner, 
  currentBlock,
  theme = 'dark' 
}: StoreInfoProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    const success = await copyToClipboard(storeData.address);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getExplorerUrl = () => {
    // This would need to be determined based on the current chain
    return `https://exp.jibchain.net/address/${storeData.address}`;
  };

  return (
    <div className={getCardClasses(theme)}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">
            {storeData.nickname || 'Unnamed Store'}
          </h2>
          
          <div className="flex items-center space-x-2 mb-3">
            <button
              onClick={handleCopyAddress}
              className="flex items-center space-x-2 text-sm font-mono hover:bg-gray-700 rounded px-2 py-1 transition-colors"
              title="Click to copy address"
            >
              <span>{formatAddress(storeData.address)}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copied ? "M5 13l4 4L19 7" : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"} />
              </svg>
            </button>
            
            {copied && (
              <span className="text-green-400 text-xs">Copied!</span>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {isOwner && (
              <span className={getBadgeClasses('purple')}>
                Owner
              </span>
            )}
            
            <span className={`${getBadgeClasses('green')} flex items-center`}>
              <div className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse" />
              Live
            </span>
            
            <span className={getBadgeClasses('blue')}>
              {storeData.totalRecords} records
            </span>
          </div>
        </div>
        
        <a
          href={getExplorerUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={`px-3 py-1 text-xs rounded-md transition-colors ${
            theme === 'dark'
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          View on Explorer ↗
        </a>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Total Fields
          </p>
          <p className="text-2xl font-bold">{storeData.fields.length}</p>
        </div>
        
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Owner
          </p>
          <p className="text-sm font-mono">{formatAddress(storeData.owner)}</p>
        </div>
        
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Authorized Sensors
          </p>
          <p className="text-2xl font-bold">{storeData.authorizedSensors.length}</p>
        </div>
        
        <div className={`p-4 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
        }`}>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Data Points
          </p>
          <p className="text-2xl font-bold">{storeData.totalRecords}</p>
        </div>
      </div>
      
      {/* Description */}
      {storeData.description && (
        <div className="mb-4">
          <h4 className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Description
          </h4>
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {storeData.description}
          </p>
        </div>
      )}
      
      {/* Pointer/Reference */}
      {storeData.pointer && (
        <div className="mb-4">
          <h4 className={`text-sm font-medium mb-2 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            External Reference
          </h4>
          <a 
            href={storeData.pointer}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 text-sm underline"
          >
            {storeData.pointer}
          </a>
        </div>
      )}
    </div>
  );
};