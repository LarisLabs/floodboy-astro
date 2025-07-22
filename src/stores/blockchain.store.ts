// src/stores/blockchain.store.ts
import { atom, map, computed } from 'nanostores';
import { createPublicClient, http, type PublicClient } from 'viem';
import { parseAbi, decodeEventLog } from 'viem';

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
};

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
};

// Contract ABIs
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
    "inputs": [],
    "name": "authorizedSignerCount",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Event definition
const RECORD_STORED_EVENT = {
  type: 'event',
  name: 'RecordStored',
  inputs: [
    { name: 'sensor', type: 'address', indexed: true },
    { name: 'timestamp', type: 'uint256', indexed: false },
    { name: 'values', type: 'int256[]', indexed: false }
  ]
};

// Store data type
export interface StoreData {
  address: string;
  name: string;
  owner: string;
  fields: Array<{ name: string; unit: string; dtype: string }>;
  sensorRecords: Array<{
    sensor: string;
    timestamp: number;
    values: number[];
    blockNumber?: bigint;
    transactionHash?: string;
  }>;
  lastFetchedBlock: bigint;
  isLoading: boolean;
  totalRecords: number;
  lastTimestamp: number;
}

// Blockchain state atoms
export const $currentBlock = atom<bigint | null>(null);
export const $chainId = atom<number>(8899); // Default JIBCHAIN
export const $publicClient = atom<PublicClient | null>(null);
export const $lastBlockUpdate = atom<Date>(new Date());

// Computed values
export const $timeSinceUpdate = computed($lastBlockUpdate, (lastUpdate) => {
  return Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
});

export const $blockStatus = computed($timeSinceUpdate, (seconds) => {
  if (seconds <= 3) return { status: 'live', color: 'text-green-400' };
  if (seconds <= 10) return { status: 'delayed', color: 'text-yellow-400' };
  return { status: 'stale', color: 'text-red-400' };
});

// Store data state
export const $storeData = map<{
  [address: string]: StoreData;
}>({});

// Utility functions
function parseScalingFactor(unit: string): number {
  const match = unit.match(/x\s*(\d+)/i);
  return match ? parseInt(match[1]) : 100;
}

export function formatScaledValue(value: number | bigint, unit: string): string {
  if (unit.toLowerCase().includes('count')) {
    return Math.round(Number(value)).toString();
  }
  
  const scaleFactor = parseScalingFactor(unit);
  const numValue = Number(value);
  const decimalValue = numValue / scaleFactor;
  const decimalPlaces = Math.log10(scaleFactor);
  return decimalValue.toFixed(Math.max(0, decimalPlaces));
}

// Process event logs
function processRecordLogs(logs: any[]): any[] {
  return logs
    .filter(log => log.args && log.args.sensor && log.args.timestamp && log.args.values)
    .map(log => ({
      sensor: log.args.sensor,
      timestamp: Number(log.args.timestamp),
      values: log.args.values.map((v: bigint) => Number(v)),
      blockNumber: log.blockNumber,
      transactionHash: log.transactionHash
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
}

// Actions
export function initializeClient(chainId: number) {
  const chain = chainId === 8899 ? jibchainL1 : sichang;
  const client = createPublicClient({
    chain,
    transport: http(),
  });
  
  $publicClient.set(client);
  $chainId.set(chainId);
  
  // Start block watching
  startBlockWatcher(client);
}

let unwatchBlocks: (() => void) | null = null;

export function startBlockWatcher(client: PublicClient) {
  // Clean up existing watcher
  if (unwatchBlocks) {
    unwatchBlocks();
  }
  
  // Watch for new blocks
  unwatchBlocks = client.watchBlocks({
    onBlock: (block) => {
      $currentBlock.set(block.number);
      $lastBlockUpdate.set(new Date());
      
      // Check for new store events
      checkStoreUpdates(block.number);
    },
    pollingInterval: 3_000, // 3 seconds
  });
}

async function checkStoreUpdates(blockNumber: bigint) {
  const stores = $storeData.get();
  const client = $publicClient.get();
  
  if (!client) return;
  
  // For each active store, check for new events
  for (const [address, data] of Object.entries(stores)) {
    if (data.lastFetchedBlock < blockNumber) {
      // Fetch only new events
      await fetchNewEvents(address, data.lastFetchedBlock + 1n, blockNumber);
    }
  }
}

export async function fetchNewEvents(
  storeAddress: string,
  fromBlock: bigint,
  toBlock: bigint
) {
  const client = $publicClient.get();
  if (!client) return;
  
  try {
    const events = await client.getLogs({
      address: storeAddress as `0x${string}`,
      event: RECORD_STORED_EVENT as any,
      fromBlock,
      toBlock,
    });
    
    if (events.length > 0) {
      const processedEvents = processRecordLogs(events);
      const currentData = $storeData.get()[storeAddress];
      
      // Update store data without clearing existing
      $storeData.setKey(storeAddress, {
        ...currentData,
        sensorRecords: [
          ...processedEvents,
          ...currentData.sensorRecords,
        ].slice(0, 100), // Keep last 100 records
        lastFetchedBlock: toBlock,
        totalRecords: currentData.totalRecords + events.length,
      });
    }
  } catch (error) {
    console.error('Failed to fetch events:', error);
  }
}

// Initial store data loading
export async function loadStoreData(storeAddress: string) {
  const client = $publicClient.get();
  if (!client) return;

  // Set loading state
  $storeData.setKey(storeAddress, {
    ...$storeData.get()[storeAddress],
    isLoading: true,
  });

  try {
    const currentBlockNumber = await client.getBlockNumber();
    
    // Parallel loading of basic store info
    const [owner, fields, authorizedSignerCount] = await Promise.all([
      client.readContract({
        address: storeAddress as `0x${string}`,
        abi: STORE_ABI,
        functionName: 'owner'
      }),
      client.readContract({
        address: storeAddress as `0x${string}`,
        abi: STORE_ABI,
        functionName: 'getAllFields'
      }),
      client.readContract({
        address: storeAddress as `0x${string}`,
        abi: STORE_ABI,
        functionName: 'authorizedSignerCount'
      }).catch(() => 0n)
    ]);

    // Load recent events
    const fromBlock = currentBlockNumber - BigInt(10000); // Last ~10k blocks
    const eventLogs = await client.getLogs({
      address: storeAddress as `0x${string}`,
      event: RECORD_STORED_EVENT as any,
      fromBlock: fromBlock,
      toBlock: 'latest'
    }).catch(() => []);

    const processedRecords = processRecordLogs(eventLogs);
    
    // Update store data
    $storeData.setKey(storeAddress, {
      address: storeAddress,
      name: "FloodBoy: IoT-Powered Blockchain Sensor Store",
      owner: owner as string,
      fields: fields as any[],
      sensorRecords: processedRecords.slice(0, 100),
      lastFetchedBlock: currentBlockNumber,
      isLoading: false,
      totalRecords: processedRecords.length,
      lastTimestamp: processedRecords[0]?.timestamp || 0,
    });

  } catch (error) {
    console.error('Error loading store data:', error);
    $storeData.setKey(storeAddress, {
      ...$storeData.get()[storeAddress],
      isLoading: false,
    });
  }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (unwatchBlocks) {
      unwatchBlocks();
    }
  });
}