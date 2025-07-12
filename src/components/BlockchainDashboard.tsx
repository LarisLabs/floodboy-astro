import React, { useState, useEffect, useRef } from 'react';
import type { PublicClient, WalletClient } from 'viem';
import { createPublicClient, createWalletClient, custom, http, parseAbi, formatEther, decodeEventLog } from 'viem';
import { mainnet, sepolia, anvil } from 'viem/chains';
import FloodboyBlockchainVisualization from './FloodboyBlockchainVisualization';
import P5Loader from './P5Loader';

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

const BlockchainDashboard: React.FC = () => {
  const [walletClient, setWalletClient] = useState<WalletClient | null>(null);
  const [publicClient, setPublicClient] = useState<PublicClient | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState(8899); // Default to JIBCHAIN L1
  const [storeData, setStoreData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [directStoreAddress, setDirectStoreAddress] = useState('0xc887E6FEdF2879ca0731F9b5d3D077F43f53D6e8');
  const [currentBlock, setCurrentBlock] = useState<bigint | null>(null);
  const [viewMode, setViewMode] = useState<'direct' | 'wallet' | 'public'>('direct');
  const [selectedChain, setSelectedChain] = useState(8899);

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

  // Fetch store data
  const fetchStoreData = async () => {
    if (!publicClient || !directStoreAddress) return;

    setLoading(true);
    setError(null);

    try {
      // Get current block
      const block = await publicClient.getBlockNumber();
      setCurrentBlock(block);

      // Get factory address for current chain
      const factoryAddress = CONTRACTS[chainId]?.DEPLOYER_ADDRESS;

      // Get basic store data
      const promises = [
        publicClient.readContract({
          address: directStoreAddress as `0x${string}`,
          abi: STORE_ABI,
          functionName: 'getAllFields'
        }),
        publicClient.readContract({
          address: directStoreAddress as `0x${string}`,
          abi: STORE_ABI,
          functionName: 'owner'
        })
      ];

      // Add nickname and metadata fetch if factory is available
      if (factoryAddress && factoryAddress !== '0x0000000000000000000000000000000000000000') {
        promises.push(
          publicClient.readContract({
            address: factoryAddress as `0x${string}`,
            abi: DEPLOYER_ABI,
            functionName: 'storeToNickname',
            args: [directStoreAddress as `0x${string}`]
          }).catch(() => ''),
          publicClient.readContract({
            address: factoryAddress as `0x${string}`,
            abi: DEPLOYER_ABI,
            functionName: 'getStoreMetadata',
            args: [directStoreAddress as `0x${string}`]
          }).catch(() => [])
        );
      }

      const results = await Promise.all(promises);
      const fields = results[0] as any[];
      const owner = results[1] as string;
      const nickname = (results[2] || '') as string;
      const metadataArray = (results[3] || []) as any[];
      
      const metadata = {
        deployedBlock: metadataArray[0] ? Number(metadataArray[0]) : 0,
        lastUpdatedBlock: metadataArray[1] ? Number(metadataArray[1]) : 0,
        description: metadataArray[2] || '',
        pointer: metadataArray[3] || ''
      };

      // Get authorized sensors from events
      const authFilter = await publicClient.createEventFilter({
        address: directStoreAddress as `0x${string}`,
        event: EVENT_ABIS.SensorAuthorized,
        fromBlock: 'earliest'
      });

      const revokeFilter = await publicClient.createEventFilter({
        address: directStoreAddress as `0x${string}`,
        event: EVENT_ABIS.SensorRevoked,
        fromBlock: 'earliest'
      });

      const [authEvents, revokeEvents] = await Promise.all([
        publicClient.getFilterLogs({ filter: authFilter }),
        publicClient.getFilterLogs({ filter: revokeFilter })
      ]);

      // Calculate currently authorized sensors
      const authorizedSet = new Set<string>();
      authEvents.forEach(event => {
        const decoded = decodeEventLog({
          abi: [EVENT_ABIS.SensorAuthorized],
          data: event.data,
          topics: event.topics
        });
        authorizedSet.add(decoded.args.sensor as string);
      });
      revokeEvents.forEach(event => {
        const decoded = decodeEventLog({
          abi: [EVENT_ABIS.SensorRevoked],
          data: event.data,
          topics: event.topics
        });
        authorizedSet.delete(decoded.args.sensor as string);
      });
      const authorizedSensors = Array.from(authorizedSet);

      // Get records from events
      const recordFilter = await publicClient.createEventFilter({
        address: directStoreAddress as `0x${string}`,
        event: EVENT_ABIS.RecordStored,
        fromBlock: 'earliest'
      });

      const recordEvents = await publicClient.getFilterLogs({ filter: recordFilter });

      // Process sensor records
      const sensorDataMap = new Map<string, any>();
      recordEvents.forEach(event => {
        try {
          const decoded = decodeEventLog({
            abi: [EVENT_ABIS.RecordStored],
            data: event.data,
            topics: event.topics
          });
          
          const sensor = decoded.args.sensor as string;
          if (!sensorDataMap.has(sensor)) {
            sensorDataMap.set(sensor, {
              sensor,
              records: [],
              totalRecords: 0
            });
          }
          const data = sensorDataMap.get(sensor);
          data.records.push({
            timestamp: decoded.args.timestamp.toString(),
            values: decoded.args.values.map((v: bigint) => v.toString())
          });
          data.totalRecords++;
        } catch (err) {
          console.error('Error decoding event:', err);
        }
      });

      // Get latest record for each sensor
      const sensorRecords = Array.from(sensorDataMap.values()).map(data => {
        const latestRecord = data.records.length > 0 
          ? data.records[data.records.length - 1]
          : { timestamp: '0', values: [] };
        
        return {
          sensor: data.sensor,
          totalRecords: data.totalRecords.toString(),
          latestRecord
        };
      });

      // If no records from events, try to get latest record directly
      if (sensorRecords.length === 0 && authorizedSensors.length > 0) {
        // Try with first authorized sensor
        try {
          const [timestamp, values] = await publicClient.readContract({
            address: directStoreAddress as `0x${string}`,
            abi: STORE_ABI,
            functionName: 'getLatestRecord',
            args: [authorizedSensors[0] as `0x${string}`]
          }) as [bigint, bigint[]];

          if (timestamp > 0n) {
            sensorRecords.push({
              sensor: authorizedSensors[0],
              totalRecords: '1',
              latestRecord: {
                timestamp: timestamp.toString(),
                values: values.map(v => v.toString())
              }
            });
          }
        } catch (err) {
          console.error('Error getting latest record:', err);
        }
      }

      setStoreData({
        address: directStoreAddress,
        nickname: nickname || 'Unnamed Store',
        description: metadata.description || '',
        pointer: metadata.pointer || '',
        deployedBlock: metadata.deployedBlock || 0,
        lastUpdatedBlock: metadata.lastUpdatedBlock || 0,
        owner,
        fields: fields.map((f: any) => ({
          name: f.name,
          unit: f.unit,
          dtype: f.dtype,
          dataType: f.dtype
        })),
        authorizedSensors,
        sensorRecords,
        totalRecords: sensorRecords.reduce((acc, r) => acc + parseInt(r.totalRecords), 0)
      });
    } catch (err: any) {
      setError(err.message || 'Failed to fetch store data');
      console.error('Error details:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-load store data when client is ready
  useEffect(() => {
    if (publicClient && directStoreAddress && viewMode === 'direct') {
      fetchStoreData();
    }
  }, [publicClient, directStoreAddress]);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Theme Switcher */}
      <div className="fixed top-4 right-4 z-50">
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
          <h1 className="text-4xl font-bold mb-2">IoT Factory - Smart Contract Dashboard</h1>
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
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg ${
                    loading 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white`}
                >
                  {loading ? 'Loading...' : 'Load Data'}
                </button>
              </div>
            </div>
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
              <h2 className="text-xl font-semibold mb-4">Latest Sensor Data</h2>
              {storeData.sensorRecords.length > 0 && storeData.sensorRecords[0]?.latestRecord.timestamp !== '0' ? (
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
                          Pointer: {storeData.pointer}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  No sensor data available
                </p>
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