import { useState } from 'react';
import { ChainSelector } from './ChainSelector';
import { EXAMPLE_STORES } from '../../../utils/blockchain-constants';
import { isValidAddress } from '../../../utils/blockchain-helpers';
import { getCardClasses, getInputClasses, getButtonClasses } from '../../../utils/theme-utils';
import type { ComponentProps } from '../../../types/blockchain';

interface DirectStoreViewProps extends ComponentProps {
  chainId: number;
  onChainChange: (chainId: number) => void;
  onStoreLoad: (storeAddress: string) => void;
}

export const DirectStoreView = ({ 
  chainId,
  onChainChange,
  onStoreLoad,
  theme = 'dark',
  loading = false
}: DirectStoreViewProps) => {
  const [storeAddress, setStoreAddress] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddressChange = (value: string) => {
    setStoreAddress(value);
    setValidationError(null);
  };

  const handleLoadStore = () => {
    if (!storeAddress.trim()) {
      setValidationError('Please enter a store address');
      return;
    }

    if (!isValidAddress(storeAddress)) {
      setValidationError('Invalid Ethereum address format');
      return;
    }

    onStoreLoad(storeAddress);
  };

  const handleExampleClick = (address: string) => {
    setStoreAddress(address);
    setValidationError(null);
  };

  const exampleStores = EXAMPLE_STORES[chainId as keyof typeof EXAMPLE_STORES] || [];

  return (
    <div className={getCardClasses(theme)}>
      <h3 className="text-lg font-semibold mb-4">Direct Store Access</h3>
      
      <div className="space-y-4">
        <ChainSelector
          chainId={chainId}
          onChainChange={onChainChange}
          theme={theme}
          disabled={loading}
        />
        
        <div className="space-y-2">
          <label className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Store Contract Address
          </label>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={storeAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="0x..."
              className={`flex-1 ${getInputClasses(theme)} ${
                validationError ? 'border-red-500' : ''
              }`}
              disabled={loading}
            />
            
            <button
              onClick={handleLoadStore}
              disabled={loading || !storeAddress.trim()}
              className={getButtonClasses(theme, 'primary')}
            >
              {loading ? 'Loading...' : 'View Store'}
            </button>
          </div>
          
          {validationError && (
            <p className="text-red-400 text-sm">{validationError}</p>
          )}
        </div>
        
        {exampleStores.length > 0 && (
          <div className="space-y-2">
            <p className={`text-sm font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Example Stores
            </p>
            
            <div className="space-y-1">
              {exampleStores.map((address, index) => (
                <button
                  key={address}
                  onClick={() => handleExampleClick(address)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                    theme === 'dark'
                      ? 'text-purple-400 hover:bg-gray-700'
                      : 'text-purple-600 hover:bg-gray-100'
                  }`}
                >
                  Example {index + 1}: {address}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div className={`p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
        }`}>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            💡 You can access any store directly by entering its contract address. 
            No wallet connection required for viewing public data.
          </p>
        </div>
      </div>
    </div>
  );
};