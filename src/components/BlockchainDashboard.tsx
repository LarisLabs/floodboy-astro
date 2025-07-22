import { useState, useEffect, useRef } from 'react';
import { createPublicClient, http } from 'viem';
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

// Helper to get RPC URL for a chain
const getRpcUrl = (chainId: number): string => {
  const chain = SUPPORTED_CHAINS.find(c => c.id === chainId);
  return chain?.rpcUrls.default.http[0] || 'http://localhost:8545';
};

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
  
  // Separate refresh state to prevent blinking
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Data state
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [storeData, setStoreData] = useState<StoreData | null>(null);
  
  // Block watcher ref
  const unwatchBlocksRef = useRef<(() => void) | null>(null);

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

  // Initialize public client and block watcher
  useEffect(() => {
    const chainId = blockchainState.chainId;
    const rpcUrl = getRpcUrl(chainId);
    
    // Create public client
    const publicClient = createPublicClient({
      chain: SUPPORTED_CHAINS.find(c => c.id === chainId),
      transport: http(rpcUrl),
    });
    
    setBlockchainState(prev => ({ ...prev, publicClient }));
    
    // Start watching blocks
    if (unwatchBlocksRef.current) {
      unwatchBlocksRef.current();
    }
    
    const unwatch = publicClient.watchBlocks({
      onBlock: async (block) => {
        // Update current block
        setBlockchainState(prev => ({ ...prev, currentBlock: block.number }));
        
        // If we have store data, refresh it
        if (storeData && selectedStore) {
          handleStoreLoad(selectedStore.address, true);
        }
      },
      pollingInterval: 3_000, // 3 seconds
    });
    
    unwatchBlocksRef.current = unwatch;
    
    // Cleanup on unmount or chain change
    return () => {
      if (unwatchBlocksRef.current) {
        unwatchBlocksRef.current();
        unwatchBlocksRef.current = null;
      }
    };
  }, [blockchainState.chainId, storeData, selectedStore]);

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

  const handleStoreLoad = async (storeAddress: string, isRefresh = false) => {
    // Only show loading skeleton on initial load, not refresh
    if (!isRefresh) {
      setUIState(prev => ({ ...prev, loading: true, error: null }));
    } else {
      setIsRefreshing(true);
    }
    
    try {
      // TODO: Implement actual store loading logic
      // This would fetch store data from blockchain
      console.log('Loading store:', storeAddress, isRefresh ? '(refresh)' : '(initial)');
      
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
        
        if (!isRefresh) {
          setUIState(prev => ({ ...prev, loading: false }));
        } else {
          setIsRefreshing(false);
        }
      }, 1000);
      
    } catch (err) {
      setUIState(prev => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to load store data'
      }));
      setIsRefreshing(false);
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

      {/* Store data display - Never hide when refreshing */}
      {storeData ? (
        <div className="space-y-8 relative">
          {/* Refresh indicator - small spinner in corner */}
          {isRefreshing && (
            <div className="absolute top-2 right-2 z-10">
              <div className="flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-600 border-t-purple-400"></div>
                <span className="text-sm text-gray-400">Updating...</span>
              </div>
            </div>
          )}
          
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
      ) : (
        /* Loading skeleton - Only show on initial load */
        uiState.loading && (
          <div className="space-y-8">
            <LoadingSkeleton lines={5} />
            <LoadingSkeleton lines={3} />
          </div>
        )
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