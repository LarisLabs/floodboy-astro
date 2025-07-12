import type { PublicClient } from 'viem';
import { decodeEventLog } from 'viem';

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const BLOCKS_PER_HOUR = 720; // Approximate for 5-second blocks

interface CachedData {
  data: any;
  timestamp: number;
  blockNumber: string;
}

// Memory cache for current session
const memoryCache = new Map<string, CachedData>();

// Get data from cache
export function getCachedData(key: string): any | null {
  // Check memory cache first
  const memoryCached = memoryCache.get(key);
  if (memoryCached && Date.now() - memoryCached.timestamp < CACHE_DURATION) {
    return memoryCached.data;
  }

  // Check localStorage
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed: CachedData = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < CACHE_DURATION) {
        // Update memory cache
        memoryCache.set(key, parsed);
        return parsed.data;
      }
    }
  } catch (err) {
    console.error('Cache read error:', err);
  }

  return null;
}

// Set data in cache
export function setCachedData(key: string, data: any, blockNumber?: bigint): void {
  const cached: CachedData = {
    data,
    timestamp: Date.now(),
    blockNumber: blockNumber?.toString() || '0'
  };

  // Update memory cache
  memoryCache.set(key, cached);

  // Update localStorage
  try {
    localStorage.setItem(key, JSON.stringify(cached));
  } catch (err) {
    console.error('Cache write error:', err);
  }
}

// Calculate optimal block range for event fetching
export function calculateBlockRange(
  currentBlock: bigint,
  hoursBack: number = 24
): { fromBlock: bigint; toBlock: bigint } {
  const blocksBack = BigInt(Math.floor(BLOCKS_PER_HOUR * hoursBack));
  const fromBlock = currentBlock > blocksBack ? currentBlock - blocksBack : 0n;
  
  return { fromBlock, toBlock: currentBlock };
}

// Batch fetch events with retries
export async function fetchEventsWithRetry(
  publicClient: PublicClient,
  address: `0x${string}`,
  eventAbi: any,
  fromBlock: bigint,
  toBlock: bigint,
  maxRetries: number = 3
): Promise<any[]> {
  let retries = 0;
  const batchSize = 1000n; // Fetch in smaller batches

  while (retries < maxRetries) {
    try {
      const events = [];
      let currentFrom = fromBlock;

      // Fetch in batches to avoid timeouts
      while (currentFrom <= toBlock) {
        const currentTo = currentFrom + batchSize > toBlock ? toBlock : currentFrom + batchSize;
        
        const filter = await publicClient.createEventFilter({
          address,
          event: eventAbi,
          fromBlock: currentFrom,
          toBlock: currentTo
        });

        const batchEvents = await publicClient.getFilterLogs({ filter });
        events.push(...batchEvents);

        currentFrom = currentTo + 1n;
      }

      return events;
    } catch (err) {
      retries++;
      console.error(`Event fetch attempt ${retries} failed:`, err);
      
      if (retries >= maxRetries) {
        throw err;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000 * retries));
    }
  }

  return [];
}

// Process events into sensor records
export function processEventLogs(
  events: any[],
  eventAbi: any
): Map<string, any> {
  const sensorDataMap = new Map<string, any>();

  events.forEach(event => {
    try {
      const decoded = decodeEventLog({
        abi: [eventAbi],
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
        values: decoded.args.values.map((v: bigint) => v.toString()),
        blockNumber: event.blockNumber.toString()
      });
      data.totalRecords++;
    } catch (err) {
      console.error('Error decoding event:', err);
    }
  });

  return sensorDataMap;
}

// Get recent events first for quick display
export async function getRecentEvents(
  publicClient: PublicClient,
  address: `0x${string}`,
  eventAbi: any,
  blocksBack: bigint = 1000n
): Promise<any[]> {
  const currentBlock = await publicClient.getBlockNumber();
  const fromBlock = currentBlock > blocksBack ? currentBlock - blocksBack : 0n;

  const cacheKey = `recent_events_${address}_${fromBlock}_${currentBlock}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  const events = await fetchEventsWithRetry(
    publicClient,
    address,
    eventAbi,
    fromBlock,
    currentBlock,
    2 // Less retries for recent events
  );

  setCachedData(cacheKey, events, currentBlock);
  return events;
}

// Load store metadata with caching
export async function loadStoreMetadata(
  publicClient: PublicClient,
  storeAddress: `0x${string}`,
  factoryAddress: `0x${string}` | null,
  deployerAbi: any[],
  storeAbi: any[]
): Promise<any> {
  const cacheKey = `store_metadata_${storeAddress}`;
  const cached = getCachedData(cacheKey);
  
  if (cached) {
    return cached;
  }

  const promises = [
    publicClient.readContract({
      address: storeAddress,
      abi: storeAbi,
      functionName: 'getAllFields'
    }),
    publicClient.readContract({
      address: storeAddress,
      abi: storeAbi,
      functionName: 'owner'
    })
  ];

  // Add factory calls if available
  if (factoryAddress && factoryAddress !== '0x0000000000000000000000000000000000000000') {
    promises.push(
      publicClient.readContract({
        address: factoryAddress,
        abi: deployerAbi,
        functionName: 'storeToNickname',
        args: [storeAddress]
      }).catch(() => ''),
      publicClient.readContract({
        address: factoryAddress,
        abi: deployerAbi,
        functionName: 'getStoreMetadata',
        args: [storeAddress]
      }).catch(() => [])
    );
  }

  const results = await Promise.allSettled(promises);
  const processedResults = results.map(result => 
    result.status === 'fulfilled' ? result.value : null
  );

  const metadata = {
    fields: processedResults[0] || [],
    owner: processedResults[1] || '',
    nickname: processedResults[2] || '',
    metadataArray: processedResults[3] || []
  };

  setCachedData(cacheKey, metadata);
  return metadata;
}

// Format block number for display
export function formatBlockNumber(blockNumber: bigint): string {
  return blockNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Calculate estimated time for block range
export function estimateTimeForBlocks(blocks: bigint, secondsPerBlock: number = 5): string {
  const totalSeconds = Number(blocks) * secondsPerBlock;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  
  if (hours > 0) {
    return `~${hours}h ${minutes}m`;
  }
  return `~${minutes}m`;
}