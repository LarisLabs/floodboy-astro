import { useEffect, useState } from 'react';
import { CONTRACTS, SUPPORTED_CHAINS, anvil, jibchainL1, sichang } from '../../../utils/blockchain-constants';
import { formatAddress } from '../../../utils/blockchain-helpers';
import { getCardClasses, getButtonClasses } from '../../../utils/theme-utils';
import { ErrorDisplay } from '../ui/ErrorDisplay';
import { LoadingSkeleton } from '../ui/LoadingSkeleton';
import type { ConnectionProps } from '../../../types/blockchain';

declare global {
  interface Window {
    ethereum?: any;
    viem?: any;
  }
}

export const WalletConnection = ({ 
  walletClient,
  account,
  chainId,
  onConnect,
  onChainChange,
  theme = 'dark',
  loading = false,
  error
}: ConnectionProps) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another Web3 wallet");
      }
      
      await onConnect();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to connect wallet';
      setConnectionError(errorMsg);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleChainSwitch = async (targetChainId: number) => {
    try {
      const chainIdHex = `0x${targetChainId.toString(16)}`;
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
      
      await onChainChange(targetChainId);
    } catch (err) {
      console.error('Failed to switch chain:', err);
    }
  };

  const getSupportedChain = (chainId: number) => {
    return SUPPORTED_CHAINS.find(chain => chain.id === chainId);
  };

  const currentChain = getSupportedChain(chainId);
  const isSupported = !!currentChain && !!CONTRACTS[chainId as keyof typeof CONTRACTS];

  if (loading) {
    return (
      <div className={getCardClasses(theme)}>
        <h3 className="text-lg font-semibold mb-4">Wallet Connection</h3>
        <LoadingSkeleton lines={3} />
      </div>
    );
  }

  return (
    <div className={getCardClasses(theme)}>
      <h3 className="text-lg font-semibold mb-4">Wallet Connection</h3>
      
      {(error || connectionError) && (
        <ErrorDisplay 
          error={error || connectionError!} 
          onRetry={handleConnect}
          className="mb-4"
        />
      )}
      
      {!account ? (
        <div className="space-y-4">
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Connect your wallet to view your sensor stores and interact with smart contracts.
          </p>
          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={getButtonClasses(theme, 'primary')}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } mb-1`}>
              Connected Account
            </p>
            <p className="font-mono text-sm">
              {formatAddress(account)}
            </p>
          </div>
          
          <div>
            <p className={`text-sm ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } mb-1`}>
              Current Network
            </p>
            <div className="flex items-center justify-between">
              <span className={`text-sm ${isSupported ? 'text-green-400' : 'text-red-400'}`}>
                {currentChain?.name || `Unknown (${chainId})`}
              </span>
              
              {!isSupported && (
                <div className="flex space-x-2">
                  {SUPPORTED_CHAINS.map((chain) => (
                    <button
                      key={chain.id}
                      onClick={() => handleChainSwitch(chain.id)}
                      className={getButtonClasses(theme, 'secondary')}
                      title={`Switch to ${chain.name}`}
                    >
                      {chain.nativeCurrency.symbol}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {!isSupported && (
            <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
              <p className="text-yellow-400 text-sm">
                Unsupported network. Please switch to one of the supported chains above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};