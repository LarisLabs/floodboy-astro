// Blockchain network configurations and contract constants
import { BLOCKCHAIN_CONFIG } from '../config/blockchain.config';

export const JIBCHAIN_RPC_ENDPOINTS = [
  'https://rpc-l1.inan.in.th',      // fastest (Thai server)
  'https://rpc-l1.jibchain.net',    // official fallback
  'https://rpc2-l1.jbc.xpool.pw',   // often offline
  'https://rpc-l1.jbc.xpool.pw',    // often offline
] as const;

// Universal Multicall3 address (same on all chains)
export const MULTICALL3_ADDRESS = "0xcA11bde05977b3631167028862bE2a173976CA11" as const;

// Use configuration with environment variable support
export const CONTRACTS = BLOCKCHAIN_CONFIG;

// Contract ABIs
export const DEPLOYER_ABI = [
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
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "creator", "type": "address"},
      {"indexed": false, "internalType": "address", "name": "store", "type": "address"},
      {"indexed": false, "internalType": "string", "name": "nickname", "type": "string"}
    ],
    "name": "SensorStoreDeployed",
    "type": "event"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "start", "type": "uint256"},
      {"internalType": "uint256", "name": "count", "type": "uint256"}
    ],
    "name": "getStoresReverse",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "store", "type": "address"}],
    "name": "getStoreInfo",
    "outputs": [
      {"internalType": "string", "name": "nickname", "type": "string"},
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "uint256", "name": "authorizedSensorCount", "type": "uint256"},
      {"internalType": "bool", "name": "isEventOnly", "type": "bool"},
      {"internalType": "uint128", "name": "deployedBlock", "type": "uint128"},
      {"internalType": "string", "name": "description", "type": "string"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllStoresCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const STORE_ABI = [
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
  },
  {
    "inputs": [],
    "name": "authorizedSensorCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "sensor", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"},
      {"indexed": false, "internalType": "int256[]", "name": "values", "type": "int256[]"}
    ],
    "name": "RecordStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "sensor", "type": "address"}
    ],
    "name": "SensorAuthorized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "sensor", "type": "address"}
    ],
    "name": "SensorRevoked",
    "type": "event"
  }
] as const;

// Chain configurations
export const jibchainL1 = {
  id: 8899,
  name: 'JIBCHAIN L1',
  network: 'jibchain',
  nativeCurrency: { name: 'JBC', symbol: 'JBC', decimals: 18 },
  rpcUrls: {
    default: { http: [...JIBCHAIN_RPC_ENDPOINTS] },
    public: { http: [...JIBCHAIN_RPC_ENDPOINTS] }
  },
  blockExplorers: {
    default: { name: 'JBC Explorer', url: 'https://exp.jibchain.net' }
  }
} as const;

export const sichang = {
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

export const anvil = {
  id: 31337,
  name: 'Anvil',
  network: 'foundry',
  nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] }
  }
} as const;

// Supported chains list
export const SUPPORTED_CHAINS = [jibchainL1, sichang, anvil] as const;

// Example store addresses for different chains
export const EXAMPLE_STORES = {
  8899: [ // JIBCHAIN L1
    "0xc887E6FEdF2879ca0731F9b5d3D077F43f53D6e8",
    "0x1234567890123456789012345678901234567890",
  ],
  31337: [ // Anvil
    "0xc887E6FEdF2879ca0731F9b5d3D077F43f53D6e8",
  ],
  700011: [ // SiChang
    // Add example stores when deployed
  ]
} as const;