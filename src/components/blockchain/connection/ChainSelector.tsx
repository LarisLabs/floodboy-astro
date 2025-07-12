import { SUPPORTED_CHAINS } from '../../../utils/blockchain-constants';
import { getInputClasses } from '../../../utils/theme-utils';
import type { ComponentProps } from '../../../types/blockchain';

interface ChainSelectorProps extends ComponentProps {
  chainId: number;
  onChainChange: (chainId: number) => void;
  disabled?: boolean;
}

export const ChainSelector = ({ 
  chainId, 
  onChainChange, 
  theme = 'dark', 
  disabled = false 
}: ChainSelectorProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <label className={`text-sm font-medium ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Blockchain Network
      </label>
      
      <select
        value={chainId}
        onChange={(e) => onChainChange(parseInt(e.target.value))}
        disabled={disabled}
        className={`${getInputClasses(theme)} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {SUPPORTED_CHAINS.map((chain) => (
          <option key={chain.id} value={chain.id}>
            {chain.name} ({chain.nativeCurrency.symbol})
          </option>
        ))}
      </select>
      
      <p className={`text-xs ${
        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
      }`}>
        Select the blockchain network to connect to
      </p>
    </div>
  );
};