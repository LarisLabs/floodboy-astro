# Blockchain Dashboard Page - Slow Loading and Data Fetching Issues

## Problem Description

The blockchain dashboard page at `/blockchain` is experiencing slow loading times and fails to properly fetch data from the JIBCHAIN L1 blockchain. The page successfully loads after showing data (water_depth: 0.15m, installation_height: 5.00m, battery_voltage: 3.42V) but the initial load is very slow.

## Current Behavior

1. Page takes a long time to load initially
2. Shows "Load Data" button but data fetching is slow
3. Once loaded, displays sensor data correctly:
   - water_depth: 0.15 m
   - installation_height: 5.00 m
   - battery_voltage: 3.42 V
   - Store Info shows location: "46 Soi Mu Ban Thep Prathan Phon Niwet Tambon Tha Sala, Amphoe Mueang Chiang Mai, Chang Wat Chiang Mai 50000 18.762233, 99.033544"
   - Last update: 12 hours ago
   - Total records: 3

## Expected Behavior

The page should load quickly and fetch blockchain data efficiently, similar to the original `blockchain.html` implementation.

## Technical Details

### Current Implementation Issues

1. **Event Filtering Performance**: The current implementation fetches all events from 'earliest' block which is inefficient:
```typescript
const authFilter = await publicClient.createEventFilter({
  address: directStoreAddress as `0x${string}`,
  event: EVENT_ABIS.SensorAuthorized,
  fromBlock: 'earliest'  // This is inefficient for production chains
});
```

2. **Missing Optimizations from Original**:
   - No caching mechanism
   - No pagination for events
   - No block range optimization
   - Missing concurrent event fetching

### Key Differences from blockchain.html

The original `blockchain.html` has several optimizations:

1. **Block Range Optimization**:
```javascript
// From blockchain.html
const fetchHistoricalData = async () => {
    const currentBlock = await publicClient.getBlockNumber();
    const blocksPerHour = 720; // Approximate for 5-second blocks
    const hoursBack = timeRanges[timeRange].seconds / 3600;
    const fromBlock = currentBlock - BigInt(Math.floor(blocksPerHour * hoursBack));
    
    const events = await publicClient.getLogs({
        address: storeAddress,
        event: eventAbi,
        fromBlock: fromBlock > 0n ? fromBlock : 0n,
        toBlock: currentBlock
    });
};
```

2. **Auto-loading on mount**:
```javascript
// Auto-load store from URL when public client is ready
useEffect(() => {
    if (publicClient && directStoreAddress && viewMode === 'direct') {
        setSelectedStore({ address: directStoreAddress, nickname: 'Direct View' });
        loadStoreData(directStoreAddress);
    }
}, [publicClient, directStoreAddress]);
```

3. **Better error handling with fallbacks**:
```javascript
if (factoryAddress && factoryAddress !== '0x0000000000000000000000000000000000000000') {
    promises.push(
        publicClient.readContract({
            address: factoryAddress,
            abi: DEPLOYER_ABI,
            functionName: 'storeToNickname',
            args: [directStoreAddress]
        }).catch(() => ''),
        // ... more with .catch() fallbacks
    );
}
```

## Proposed Solutions

### 1. Implement Block Range Optimization
Instead of fetching from 'earliest', calculate a reasonable block range:
```typescript
const currentBlock = await publicClient.getBlockNumber();
const blocksToFetch = 10000n; // Adjust based on chain block time
const fromBlock = currentBlock > blocksToFetch ? currentBlock - blocksToFetch : 0n;
```

### 2. Add Event Caching
Cache fetched events in memory or localStorage to avoid re-fetching:
```typescript
const cacheKey = `events_${chainId}_${storeAddress}`;
const cachedEvents = localStorage.getItem(cacheKey);
if (cachedEvents) {
    const parsed = JSON.parse(cachedEvents);
    if (Date.now() - parsed.timestamp < 300000) { // 5 min cache
        return parsed.events;
    }
}
```

### 3. Implement Progressive Loading
Load recent data first, then historical data in background:
```typescript
// First load last 1000 blocks for quick display
const recentEvents = await getRecentEvents(1000n);
setStoreData(processEvents(recentEvents));

// Then load historical in background
const historicalEvents = await getHistoricalEvents();
setStoreData(prev => mergeEvents(prev, historicalEvents));
```

### 4. Add Loading States
Show partial data while loading:
```typescript
const [loadingState, setLoadingState] = useState({
  metadata: false,
  events: false,
  sensors: false
});
```

### 5. Optimize Contract Calls
Batch contract calls and handle errors gracefully:
```typescript
const results = await Promise.allSettled([
  publicClient.readContract({ /* getAllFields */ }),
  publicClient.readContract({ /* owner */ }),
  // ... other calls
]);

const processedResults = results.map(result => 
  result.status === 'fulfilled' ? result.value : null
);
```

## Environment Details

- Chain: JIBCHAIN L1 (Chain ID: 8899)
- RPC URL: https://rpc-l1.jbc.xpool.pw
- Store Address: 0xc887E6FEdF2879ca0731F9b5d3D077F43f53D6e8
- Framework: Astro with React components
- Web3 Library: viem

## Files to Update

1. `/src/components/BlockchainDashboard.tsx` - Main dashboard component
2. `/src/components/FloodboyBlockchainVisualization.tsx` - Visualization component
3. Consider adding:
   - `/src/utils/blockchain-cache.ts` - Caching utilities
   - `/src/utils/blockchain-helpers.ts` - Helper functions

## Additional Context

The original `blockchain.html` file (1000+ lines) contains a fully working implementation with proper optimizations. Key features to port:

1. Block timer and real-time updates
2. Theme switching with proper state management
3. SensorDataViews component with chart functionality
4. Proper event decoding and data formatting
5. URL parameter handling for direct store access

## Reproduction Steps

1. Navigate to `/blockchain`
2. Observe slow initial load
3. Click "Load Data" button
4. Wait for data to load (takes 10-30 seconds)
5. Once loaded, data displays correctly

## Success Criteria

- Page loads within 2-3 seconds
- Data fetches incrementally (show recent data first)
- Loading states clearly indicate progress
- Error messages are helpful and specific
- Performance is consistent across different chains