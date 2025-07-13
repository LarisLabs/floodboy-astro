import { useState, useEffect } from 'react';
import { ThemeProvider, useTheme } from './blockchain/ui/ThemeProvider';
import { ViewModeTabs } from './blockchain/ui/ViewModeTabs';
import { BlockIndicator } from './blockchain/ui/BlockIndicator';
import { WalletConnection } from './blockchain/connection/WalletConnection';
import { ChainSelector } from './blockchain/connection/ChainSelector';
import { DirectStoreView } from './blockchain/connection/DirectStoreView';
import { PublicStoreView } from './blockchain/connection/PublicStoreView';
import { StoreInfo } from './blockchain/data/StoreInfo';
import { StoreMetadata } from './blockchain/data/StoreMetadata';
import { PublicUrlShare } from './blockchain/data/PublicUrlShare';
import { SensorDataViews } from './blockchain/data/SensorDataViews';
import { FloodboyVisualization } from './blockchain/visualization/FloodboyVisualization';
import { LoadingSkeleton } from './blockchain/ui/LoadingSkeleton';
import { ErrorDisplay } from './blockchain/ui/ErrorDisplay';
import { parseUrlParams } from '../utils/blockchain-helpers';
import { SUPPORTED_CHAINS } from '../utils/blockchain-constants';
import type { StoreData, BlockchainState, UIState } from '../types/blockchain';

const BlockchainDashboardInner = () => {
  const { theme } = useTheme();
  
  // Blockchain state
  const [blockchainState, setBlockchainState] = useState<BlockchainState>({
    walletClient: null,
    publicClient: null,
    account: null,
    chainId: 8899, // Default to JIBCHAIN L1
    currentBlock: null,
  });

  // UI state
  const [uiState, setUIState] = useState<UIState>({
    loading: false,
    error: null,
    theme: 'dark',
    viewMode: 'direct', // Default to direct view
  });

  // Data state
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);

  // Initialize from URL parameters
  useEffect(() => {
    const urlParams = parseUrlParams();
    if (urlParams.chainId) {
      setBlockchainState(prev => ({ ...prev, chainId: urlParams.chainId! }));
    }
    if (urlParams.storeAddress) {
      // Auto-load store if provided in URL
      handleStoreLoad(urlParams.storeAddress);
    }
  }, []);

  const handleConnect = async () => {
    setUIState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // TODO: Implement actual wallet connection logic
      // This would use viem to connect to MetaMask
      console.log('Connecting wallet...');
      
      // Mock implementation for now
      setTimeout(() => {
        setBlockchainState(prev => ({
          ...prev,
          account: '0x1234567890123456789012345678901234567890',
          walletClient: {}, // Mock wallet client
          publicClient: {}, // Mock public client
        }));
        setUIState(prev => ({ ...prev, loading: false }));
      }, 1000);
      
    } catch (err) {
      setUIState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to connect wallet'
      }));
    }
  };

  const handleChainChange = async (chainId: number) => {
    setBlockchainState(prev => ({ ...prev, chainId }));
    // TODO: Implement actual chain switching logic
    console.log('Switching to chain:', chainId);
  };

  const handleStoreLoad = async (storeAddress: string) => {
    setUIState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // TODO: Implement actual store loading logic
      // This would fetch store data from blockchain
      console.log('Loading store:', storeAddress);
      
      // Mock store data for now
      const mockStoreData: StoreData = {
        address: storeAddress,
        nickname: 'Flood Sensor Station #1',
        description: 'IoT flood monitoring sensor deployed in downtown area',
        pointer: 'https://example.com/sensor-info',
        owner: '0x1234567890123456789012345678901234567890',
        fields: [
          { name: 'water_depth', unit: 'm x 1000', dtype: 'int256' },
          { name: 'air_height', unit: 'm x 1000', dtype: 'int256' },
          { name: 'temperature', unit: '°C x 100', dtype: 'int256' },
          { name: 'installation_height', unit: 'm x 1000', dtype: 'int256' },
        ],
        authorizedSensors: [
          '0x1234567890123456789012345678901234567890',
          '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        ],
        sensorRecords: [
          {
            sensor: '0x1234567890123456789012345678901234567890',
            timestamp: Date.now() / 1000 - 3600,
            values: [2150, 750, 290, 3000],
            block: '12345',
            txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890'
          }
        ],
        totalRecords: 150,
        deployedBlock: BigInt(12000),
        lastUpdatedBlock: BigInt(12345),
        isOwner: false,
      };
      
      setTimeout(() => {
        setStoreData(mockStoreData);
        setSelectedStore({ address: storeAddress, nickname: mockStoreData.nickname });
        setUIState(prev => ({ ...prev, loading: false }));
      }, 1000);
      
    } catch (err) {
      setUIState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load store data'
      }));
    }
  };

  const handleAddressLoad = async (address: string) => {
    // TODO: Implement logic to load all stores for a given address
    console.log('Loading stores for address:', address);
  };

  const isConnected = !!blockchainState.account;
  const supportedChain = SUPPORTED_CHAINS.find(chain => chain.id === blockchainState.chainId);

  return (
    <div className="min-h-screen p-4 max-w-7xl mx-auto">
      {/* Fixed header controls */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-4">
        <BlockIndicator
          currentBlock={blockchainState.currentBlock}
          chainId={blockchainState.chainId}
          isConnected={isConnected}
          theme={theme}
        />
        <div className="border-l border-gray-600 h-6"></div>
        {/* ThemeToggle is rendered by ThemeProvider */}
      </div>

      {/* Main header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-purple-400 mb-2">
          IoT Factory Dashboard
        </h1>
        <p className="text-gray-400 text-lg">
          Real-time sensor data monitoring with blockchain verification
        </p>
      </header>

      {/* View mode tabs */}
      <ViewModeTabs
        viewMode={uiState.viewMode}
        onViewModeChange={(mode) => setUIState(prev => ({ ...prev, viewMode: mode }))}
        theme={theme}
      />

      {/* Connection/View section */}
      <div className="mb-8">
        {uiState.viewMode === 'direct' && (
          <DirectStoreView
            chainId={blockchainState.chainId}
            onChainChange={handleChainChange}
            onStoreLoad={handleStoreLoad}
            theme={theme}
            loading={uiState.loading}
          />
        )}

        {uiState.viewMode === 'public' && (
          <PublicStoreView
            chainId={blockchainState.chainId}
            onChainChange={handleChainChange}
            onAddressLoad={handleAddressLoad}
            theme={theme}
            loading={uiState.loading}
          />
        )}

        {uiState.viewMode === 'wallet' && (
          <WalletConnection
            walletClient={blockchainState.walletClient}
            account={blockchainState.account}
            chainId={blockchainState.chainId}
            onConnect={handleConnect}
            onChainChange={handleChainChange}
            theme={theme}
            loading={uiState.loading}
            error={uiState.error}
          />
        )}
      </div>

      {/* Global error display */}
      {uiState.error && (
        <div className="mb-8">
          <ErrorDisplay
            error={uiState.error}
            onRetry={() => setUIState(prev => ({ ...prev, error: null }))}
          />
        </div>
      )}

      {/* Store data display */}
      {storeData && (
        <div className="space-y-8">
          {/* Store info and metadata */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <StoreInfo
                storeData={storeData}
                isOwner={storeData.isOwner || false}
                currentBlock={blockchainState.currentBlock}
                theme={theme}
              />
              
              <PublicUrlShare
                storeAddress={storeData.address}
                chainId={blockchainState.chainId}
                theme={theme}
              />
            </div>
            
            <StoreMetadata
              storeData={storeData}
              currentBlock={blockchainState.currentBlock}
              theme={theme}
            />
          </div>

          {/* Visualization */}
          <div className="flex justify-center">
            <FloodboyVisualization
              storeData={storeData}
              currentBlock={blockchainState.currentBlock}
              theme={theme}
            />
          </div>

          {/* Sensor data views */}
          <SensorDataViews
            storeAddress={storeData.address}
            fields={storeData.fields}
            publicClient={blockchainState.publicClient}
            theme={theme}
            currentBlock={blockchainState.currentBlock}
          />
        </div>
      )}

      {/* Loading state */}
      {uiState.loading && !storeData && (
        <div className="space-y-8">
          <LoadingSkeleton lines={5} />
          <LoadingSkeleton lines={3} />
        </div>
      )}
    </div>
  );
};

// Main component wrapped with ThemeProvider
export const BlockchainDashboard = () => {
  return (
    <ThemeProvider>
      <BlockchainDashboardInner />
    </ThemeProvider>
  );
};