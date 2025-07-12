import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { PublicClient, WalletClient } from 'viem';
import { createPublicClient, createWalletClient, custom, http, parseAbi, formatEther, decodeEventLog } from 'viem';
import { mainnet, sepolia, anvil } from 'viem/chains';
import FloodboyBlockchainVisualization from './FloodboyBlockchainVisualization';
import P5Loader from './P5Loader';
import SensorDataChart from './SensorDataChart';
import {
  getCachedData,
  setCachedData,
  calculateBlockRange,
  fetchEventsWithRetry,
  processEventLogs,
  getRecentEvents,
  loadStoreMetadata,
  formatBlockNumber
} from '../utils/blockchain-helpers';

// Custom chain configurations
const jibchainL1 = {
  id: 8899,
  name: 'JIBCHAIN L1',
  network: 'jibchain',
  nativeCurrency: { name: 'JBC', symbol: 'JBC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-l1.jbc.xpool.pw'] },
    public: { http: ['https://rpc-l1.jbc.xpool.pw'] }
  },
  blockExplorers: {
    default: { name: 'JBC Explorer', url: 'https://exp.jibchain.net' }
  }
} as const;

const sichang = {
  id: 700011,
  name: 'SiChang',
  network: 'sichang',
  nativeCurrency: { name: 'TCH', symbol: 'TCH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://sichang-rpc.thaichain.org'] },
    public: { http: ['https://sichang-rpc.thaichain.org'] }
  },
  blockExplorers: {
    default: { name: 'SiChang Explorer', url: 'https://sichang.thaichain.org' }
  }
} as const;

// Contract configuration
const CONTRACTS = {
  31337: { // Anvil
    DEPLOYER_ADDRESS: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    EXPLORER_URL: "http://localhost:8545",
  },
  700011: { // SiChang
    DEPLOYER_ADDRESS: "0x0000000000000000000000000000000000000000", // To be deployed
    EXPLORER_URL: "https://sichang.thaichain.org",
  },
  8899: { // JIBCHAIN L1
    DEPLOYER_ADDRESS: "0x5cEe5489DdB5006e5c1c1f2029bc7451E4A25837",
    EXPLORER_URL: "https://exp.jibchain.net",
  },
};

// Contract ABIs
const DEPLOYER_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserStores",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "", "type": "address"}],
    "name": "storeToNickname",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "store", "type": "address"}],
    "name": "getStoreMetadata",
    "outputs": [
      {"internalType": "uint128", "name": "deployedBlock", "type": "uint128"},
      {"internalType": "uint128", "name": "lastUpdatedBlock", "type": "uint128"},
      {"internalType": "string", "name": "description", "type": "string"},
      {"internalType": "string", "name": "pointer", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

const STORE_ABI = [
  {
    "inputs": [],
    "name": "getAllFields",
    "outputs": [{"components": [{"internalType": "string", "name": "name", "type": "string"}, {"internalType": "string", "name": "unit", "type": "string"}, {"internalType": "string", "name": "dtype", "type": "string"}], "internalType": "struct SecureSensorStore.Field[]", "name": "", "type": "tuple[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "sensor", "type": "address"}],
    "name": "getLatestRecord",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}, {"internalType": "int256[]", "name": "", "type": "int256[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "sensor", "type": "address"}],
    "name": "isSensorAuthorized",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Event ABIs
const EVENT_ABIS = {
  RecordStored: parseAbi(['event RecordStored(address indexed sensor, uint256 timestamp, int256[] values)'])[0],
  SensorAuthorized: parseAbi(['event SensorAuthorized(address indexed sensor)'])[0],
  SensorRevoked: parseAbi(['event SensorRevoked(address indexed sensor)'])[0]
};

// Helper functions
const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

const formatValue = (value: string | bigint, unit: string) => {
  const num = BigInt(value);
  if (unit.includes('x 1000')) {
    return (Number(num) / 1000).toFixed(2);
  }
  if (unit.includes('x 100')) {
    return (Number(num) / 100).toFixed(2);
  }
  if (unit.includes('x 10')) {
    return (Number(num) / 10).toFixed(1);
  }
  if (unit.includes('°C') || unit.includes('pH')) {
    return (Number(num) / 100).toFixed(2);
  }
  if (unit.includes('%')) {
    return (Number(num) / 10).toFixed(1);
  }
  return num.toString();
};

const getTimeAgo = (timestamp: string | number) => {
  const date = new Date(parseInt(timestamp.toString()) * 1000);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
};

// Loading states interface
interface LoadingStates {
  metadata: boolean;
  recentEvents: boolean;
  historicalEvents: boolean;
  sensors: boolean;
}

const BlockchainDashboard: React.FC = () => {
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState(8899); // Default to JIBCHAIN L1
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState<LoadingStates>({
    metadata: false,
    recentEvents: false,
    historicalEvents: false,
    sensors: false
  });
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [directStoreAddress, setDirectStoreAddress] = useState('0xc887E6FEdF2879ca0731F9b5d3D077F43f53D6e8');
  const [currentBlock, setCurrentBlock] = useState<bigint | null>(null);
  const [viewMode, setViewMode] = useState<'direct' | 'wallet' | 'public'>('direct');
  const [selectedChain, setSelectedChain] = useState(8899);
  const [blockNumber, setBlockNumber] = useState<bigint | null>(null);
  const [blockTimer, setBlockTimer] = useState(0);
  const blockTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [chartViewMode, setChartViewMode] = useState<'data' | 'chart'>('data');
  const [selectedField, setSelectedField] = useState(0);
  const [historicalData, setHistoricalData] = useState<any[]>([]);

  // Apply theme to body
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // Initialize public client
  useEffect(() => {
    const chain = selectedChain === 8899 ? jibchainL1 : selectedChain === 700011 ? sichang : anvil;
    const client = createPublicClient({
      chain,
      transport: http()
    });
    setPublicClient(client);
    setChainId(selectedChain);
  }, [selectedChain]);

  // Fetch current block number periodically
  useEffect(() => {
    if (!publicClient) return;

    const fetchBlockNumber = async () => {
      try {
        const block = await publicClient.getBlockNumber();
        setCurrentBlock(block);
        
        // Update block number display for JBC chain
        if (chainId === 8899) {
          setBlockNumber(block);
          setBlockTimer(0);
        }
      } catch (err) {
        console.error('Error fetching block number:', err);
      }
    };

    // Fetch immediately
    fetchBlockNumber();

    // Poll every 5 seconds
    const intervalId = setInterval(fetchBlockNumber, 5000);

    return () => clearInterval(intervalId);
  }, [publicClient, chainId]);

  // Block timer for JBC chain
  useEffect(() => {
    if (blockNumber !== null && chainId === 8899) {
      // Clear existing timer
      if (blockTimerRef.current) {
        clearInterval(blockTimerRef.current);
      }

      // Start new timer
      blockTimerRef.current = setInterval(() => {
        setBlockTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (blockTimerRef.current) {
        clearInterval(blockTimerRef.current);
      }
    };
  }, [blockNumber, chainId]);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('MetaMask not detected');
      return;
    }

    try {
      const client = createWalletClient({
        chain: chainId === 8899 ? jibchainL1 : chainId === 700011 ? sichang : anvil,
        transport: custom(window.ethereum)
      });
      
      const [address] = await client.requestAddresses();
      setWalletClient(client);
      setAccount(address);
      setError(null);
    } catch (err) {
      setError('Failed to connect wallet');
    }
  };

  // Progressive store data fetching
  const fetchStoreData = useCallback(async () => {
    if (!publicClient || !directStoreAddress) return;

    setError(null);

    try {
      // Step 1: Load metadata (fast)
      setLoading(prev => ({ ...prev, metadata: true }));
      const factoryAddress = CONTRACTS[chainId]?.DEPLOYER_ADDRESS;
      
      const metadata = await loadStoreMetadata(
        publicClient,
        directStoreAddress as `0x${string}`,
        factoryAddress as `0x${string}` | null,
        DEPLOYER_ABI,
        STORE_ABI
      );

      const metadataObj = metadata.metadataArray && Array.isArray(metadata.metadataArray) ? {
        deployedBlock: metadata.metadataArray[0] ? Number(metadata.metadataArray[0]) : 0,
        lastUpdatedBlock: metadata.metadataArray[1] ? Number(metadata.metadataArray[1]) : 0,
        description: metadata.metadataArray[2] || '',
        pointer: metadata.metadataArray[3] || ''
      } : {
        deployedBlock: 0,
        lastUpdatedBlock: 0,
        description: '',
        pointer: ''
      };

      // Set initial store data with metadata
      setStoreData({
        address: directStoreAddress,
        nickname: metadata.nickname || 'Unnamed Store',
        description: metadataObj.description,
        pointer: metadataObj.pointer,
        deployedBlock: metadataObj.deployedBlock,
        lastUpdatedBlock: metadataObj.lastUpdatedBlock,
        owner: metadata.owner,
        fields: metadata.fields.map((f: any) => ({
          name: f.name,
          unit: f.unit,
          dtype: f.dtype,
          dataType: f.dtype
        })),
        authorizedSensors: [],
        sensorRecords: [],
        totalRecords: 0
      });

      setLoading(prev => ({ ...prev, metadata: false }));

      // Step 2: Load recent events for quick display
      setLoading(prev => ({ ...prev, recentEvents: true }));
      
      const recentEvents = await getRecentEvents(
        publicClient,
        directStoreAddress as `0x${string}`,
        EVENT_ABIS.RecordStored,
        1000n // Last 1000 blocks
      );

      const recentSensorData = processEventLogs(recentEvents, EVENT_ABIS.RecordStored);
      
      // Collect all records for historical data
      const allRecords: any[] = [];
      recentSensorData.forEach(data => {
        data.records.forEach((record: any) => {
          allRecords.push({
            timestamp: parseInt(record.timestamp) * 1000,
            sensor: data.sensor,
            values: record.values.map((v: string) => parseInt(v)),
            block: record.blockNumber || '0'
          });
        });
      });
      setHistoricalData(allRecords);
      
      // Get latest record for each sensor
      const sensorRecords = Array.from(recentSensorData.values()).map(data => {
        const latestRecord = data.records.length > 0 
          ? data.records[data.records.length - 1]
          : { timestamp: '0', values: [] };
        
        return {
          sensor: data.sensor,
          totalRecords: data.totalRecords.toString(),
          latestRecord
        };
      });

      // Update with recent data
      setStoreData((prev: any) => ({
        ...prev,
        sensorRecords,
        totalRecords: sensorRecords.reduce((acc, r) => acc + parseInt(r.totalRecords), 0)
      }));

      setLoading(prev => ({ ...prev, recentEvents: false }));

      // Step 3: Load sensor authorization events
      setLoading(prev => ({ ...prev, sensors: true }));
      
      const currentBlockBigInt = await publicClient.getBlockNumber();
      const { fromBlock } = calculateBlockRange(currentBlockBigInt, 24 * 7); // Last week

      // Fetch auth events
      const [authEvents, revokeEvents] = await Promise.all([
        fetchEventsWithRetry(
          publicClient,
          directStoreAddress as `0x${string}`,
          EVENT_ABIS.SensorAuthorized,
          fromBlock,
          currentBlockBigInt
        ),
        fetchEventsWithRetry(
          publicClient,
          directStoreAddress as `0x${string}`,
          EVENT_ABIS.SensorRevoked,
          fromBlock,
          currentBlockBigInt
        )
      ]);

      // Process authorized sensors
      const authorizedSet = new Set<string>();
      authEvents.forEach(event => {
        try {
          const decoded = decodeEventLog({
            abi: [EVENT_ABIS.SensorAuthorized],
            data: event.data,
            topics: event.topics
          });
          authorizedSet.add(decoded.args.sensor as string);
        } catch (err) {
          console.error('Error decoding auth event:', err);
        }
      });
      
      revokeEvents.forEach(event => {
        try {
          const decoded = decodeEventLog({
            abi: [EVENT_ABIS.SensorRevoked],
            data: event.data,
            topics: event.topics
          });
          authorizedSet.delete(decoded.args.sensor as string);
        } catch (err) {
          console.error('Error decoding revoke event:', err);
        }
      });

      const authorizedSensors = Array.from(authorizedSet);

      // Update with sensor data
      setStoreData((prev: any) => ({
        ...prev,
        authorizedSensors
      }));

      setLoading(prev => ({ ...prev, sensors: false }));

      // Step 4: If no recent data, try direct contract read
      if (sensorRecords.length === 0 && authorizedSensors.length > 0) {
        try {
          const [timestamp, values] = await publicClient.readContract({
            address: directStoreAddress as `0x${string}`,
            abi: STORE_ABI,
            functionName: 'getLatestRecord',
            args: [authorizedSensors[0] as `0x${string}`]
          }) as [bigint, bigint[]];

          if (timestamp > 0n) {
            setStoreData((prev: any) => ({
              ...prev,
              sensorRecords: [{
                sensor: authorizedSensors[0],
                totalRecords: '1',
                latestRecord: {
                  timestamp: timestamp.toString(),
                  values: values.map(v => v.toString())
                }
              }],
              totalRecords: 1
            }));
          }
        } catch (err) {
          console.error('Error getting latest record:', err);
        }
      }

      // Step 5: Load historical events in background (optional)
      // This is commented out to improve initial load time
      // You can uncomment if you need historical data
      /*
      setLoading(prev => ({ ...prev, historicalEvents: true }));
      const historicalEvents = await fetchEventsWithRetry(
        publicClient,
        directStoreAddress as `0x${string}`,
        EVENT_ABIS.RecordStored,
        metadataObj.deployedBlock ? BigInt(metadataObj.deployedBlock) : 0n,
        fromBlock - 1n
      );
      // Process and merge historical data...
      setLoading(prev => ({ ...prev, historicalEvents: false }));
      */

    } catch (err: any) {
      setError(err.message || 'Failed to fetch store data');
      console.error('Error details:', err);
    }
  }, [publicClient, directStoreAddress, chainId]);

  // Auto-load store data when client is ready
  useEffect(() => {
    if (publicClient && directStoreAddress && viewMode === 'direct') {
      fetchStoreData();
    }
  }, [publicClient, directStoreAddress, viewMode, fetchStoreData]);

  // Check if any loading state is active
  const isLoading = Object.values(loading).some(v => v);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Theme Switcher and Block Display */}
      <div className="fixed top-4 right-4 z-50 flex items-center space-x-2">
        {/* Block Display for JBC Chain */}
        {chainId === 8899 && blockNumber && (
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full backdrop-blur-md ${
            theme === 'dark' 
              ? 'bg-gray-900/80 border border-gray-700/30' 
              : 'bg-white/80 border border-gray-200/30 shadow-xl'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              blockTimer >= 10 ? 'bg-yellow-500' : 'bg-green-500'
            } animate-pulse`}></div>
            <span className={`text-xs font-medium ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>Block</span>
            <span className={`text-sm font-mono font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              {formatBlockNumber(blockNumber)}
            </span>
            <span className={`text-xs ml-1 font-bold ${
              blockTimer >= 10 
                ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600')
                : (theme === 'dark' ? 'text-green-400' : 'text-green-600')
            }`}>
              ({blockTimer}s)
            </span>
          </div>
        )}

        {/* Theme Switcher */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className={`p-2 rounded-lg ${
            theme === 'dark' 
              ? 'bg-gray-800 hover:bg-gray-700 text-yellow-400' 
              : 'bg-white hover:bg-gray-100 text-gray-700 shadow-md'
          }`}
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 text-transparent bg-clip-text">
            IoT Factory - Smart Contract Dashboard
          </h1>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Monitor IoT sensor data stored on blockchain
          </p>
        </div>

        {/* Mode Selection Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setViewMode('direct')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'direct' 
                ? 'bg-purple-600 text-white' 
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Direct Store View
          </button>
          <button
            onClick={() => setViewMode('wallet')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'wallet' 
                ? 'bg-purple-600 text-white' 
                : theme === 'dark'
                  ? 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Connect Wallet
          </button>
        </div>

        {/* Connection Section */}
        {viewMode === 'wallet' ? (
          <div className={`rounded-lg p-6 mb-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Blockchain Connection</h2>
              {!account ? (
                <button
                  onClick={connectWallet}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Connect Wallet
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {formatAddress(account)}
                  </span>
                  <span className="text-sm text-green-500">● Connected</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className={`rounded-lg p-6 mb-8 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
          }`}>
            <h2 className="text-xl font-semibold mb-4">Direct Store View</h2>
            
            {/* Chain Selection */}
            <div className="mb-4">
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              }`}>
                Select Chain
              </label>
              <select
                value={selectedChain}
                onChange={(e) => setSelectedChain(parseInt(e.target.value))}
                className={`px-3 py-2 rounded ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-white border-gray-300'
                } border`}
              >
                <option value={8899}>JIBCHAIN L1</option>
                <option value={700011}>SiChang</option>
                <option value={31337}>Anvil (Local)</option>
              </select>
            </div>

            {/* Store Address Input */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-700'
              }`}>
                Store Contract Address
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={directStoreAddress}
                  onChange={(e) => setDirectStoreAddress(e.target.value)}
                  placeholder="0x..."
                  className={`flex-1 px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-white border-gray-300'
                  }`}
                />
                <button
                  onClick={fetchStoreData}
                  disabled={isLoading}
                  className={`px-6 py-2 rounded-lg ${
                    isLoading 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white`}
                >
                  {isLoading ? 'Loading...' : 'Load Data'}
                </button>
              </div>
            </div>

            {/* Loading indicators */}
            {isLoading && (
              <div className="mt-4 space-y-2">
                {loading.metadata && (
                  <div className="flex items-center text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    Loading store metadata...
                  </div>
                )}
                {loading.recentEvents && (
                  <div className="flex items-center text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    Loading recent sensor data...
                  </div>
                )}
                {loading.sensors && (
                  <div className="flex items-center text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    Loading authorized sensors...
                  </div>
                )}
                {loading.historicalEvents && (
                  <div className="flex items-center text-sm">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
                    Loading historical data...
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500">
            {error}
          </div>
        )}

        {/* Visualization and Data */}
        {storeData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Floodboy Visualization */}
            <div className={`rounded-lg p-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
            }`}>
              <h2 className="text-xl font-semibold mb-4">Sensor Visualization</h2>
              <P5Loader>
                <FloodboyBlockchainVisualization 
                  storeData={storeData} 
                  currentBlock={currentBlock}
                />
              </P5Loader>
            </div>

            {/* Sensor Data */}
            <div className={`rounded-lg p-6 ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md'
            }`}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Sensor Data</h2>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600">
                  <button
                    onClick={() => setChartViewMode('data')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      chartViewMode === 'data'
                        ? 'bg-purple-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Latest Data
                  </button>
                  <button
                    onClick={() => setChartViewMode('chart')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      chartViewMode === 'chart'
                        ? 'bg-purple-600 text-white'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Chart View
                  </button>
                </div>
              </div>

              {chartViewMode === 'data' ? (
                // Latest data view
                storeData.sensorRecords.length > 0 && storeData.sensorRecords[0]?.latestRecord.timestamp !== '0' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Last update: {getTimeAgo(storeData.sensorRecords[0].latestRecord.timestamp)}
                      </p>
                      <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Total records: {storeData.totalRecords}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      {storeData.fields.map((field: any, index: number) => {
                        const value = storeData.sensorRecords[0].latestRecord.values[index];
                        return (
                          <div key={index} className={`flex justify-between p-2 rounded ${
                            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'
                          }`}>
                            <span className="font-medium">{field.name}:</span>
                            <span className="font-mono">
                              {formatValue(value || '0', field.unit)} {field.unit.split(' ')[0]}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Store Metadata */}
                    {(storeData.description || storeData.pointer) && (
                      <div className={`mt-4 pt-4 border-t ${
                        theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <h3 className="font-semibold mb-2">Store Info</h3>
                        {storeData.description && (
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {storeData.description}
                          </p>
                        )}
                        {storeData.pointer && (
                          <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            {storeData.pointer}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                      No sensor data available
                    </p>
                    {loading.recentEvents && (
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                      </div>
                    )}
                  </div>
                )
              ) : (
                // Chart view
                <SensorDataChart
                  storeAddress={directStoreAddress}
                  fields={storeData.fields}
                  theme={theme}
                  historicalData={historicalData}
                  selectedField={selectedField}
                  onFieldChange={setSelectedField}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

export default BlockchainDashboard;