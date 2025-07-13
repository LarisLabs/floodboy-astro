import { useState } from 'react';
import { ChainSelector } from './ChainSelector';
import { EXAMPLE_STORES } from '../../../utils/blockchain-constants';
import { isValidAddress } from '../../../utils/blockchain-helpers';
import { getCardClasses, getInputClasses, getButtonClasses } from '../../../utils/theme-utils';
import type { ComponentProps } from '../../../types/blockchain';

interface PublicStoreViewProps extends ComponentProps {
  chainId: number;
  onChainChange: (chainId: number) => void;
  onAddressLoad: (address: string) => void;
}

export const PublicStoreView = ({ 
  chainId,
  onChainChange,
  onAddressLoad,
  theme = 'dark',
  loading = false
}: PublicStoreViewProps) => {
  const [address, setAddress] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleAddressChange = (value: string) => {
    setAddress(value);
    setValidationError(null);
  };

  const handleLoadAddress = () => {
    if (!address.trim()) {
      setValidationError('Please enter an address');
      return;
    }

    if (!isValidAddress(address)) {
      setValidationError('Invalid Ethereum address format');
      return;
    }

    onAddressLoad(address);
  };

  const handleExampleClick = (exampleAddress: string) => {
    setAddress(exampleAddress);
    setValidationError(null);
  };

  const exampleAddresses = [
    '0x742d35Cc6634C0532925a3b8c8Fd5D94', // Example address 1
    '0x742d35Cc6634C0532925a3b8c8Fd5D95', // Example address 2
  ];

  return (
    <div className={getCardClasses(theme)}>
      <h3 className="text-lg font-semibold mb-4">Public Address Explorer</h3>
      
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
            User Address
          </label>
          
          <div className="flex space-x-2">
            <input
              type="text"
              value={address}
              onChange={(e) => handleAddressChange(e.target.value)}
              placeholder="0x..."
              className={`flex-1 ${getInputClasses(theme)} ${
                validationError ? 'border-red-500' : ''
              }`}
              disabled={loading}
            />
            
            <button
              onClick={handleLoadAddress}
              disabled={loading || !address.trim()}
              className={getButtonClasses(theme, 'primary')}
            >
              {loading ? 'Loading...' : 'View Stores'}
            </button>
          </div>
          
          {validationError && (
            <p className="text-red-400 text-sm">{validationError}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <p className={`text-sm font-medium ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Example Addresses
          </p>
          
          <div className="space-y-1">
            {exampleAddresses.map((exampleAddress, index) => (
              <button
                key={exampleAddress}
                onClick={() => handleExampleClick(exampleAddress)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm font-mono transition-colors ${
                  theme === 'dark'
                    ? 'text-purple-400 hover:bg-gray-700'
                    : 'text-purple-600 hover:bg-gray-100'
                }`}
              >
                User {index + 1}: {exampleAddress}
              </button>
            ))}
          </div>
        </div>
        
        <div className={`p-3 rounded-lg ${
          theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
        }`}>
          <p className={`text-xs ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            🔍 Browse sensor stores deployed by any address. 
            All store data is publicly viewable on the blockchain.
          </p>
        </div>
      </div>
    </div>
  );
};