/**
 * Blockchain Page Client-Side Module
 * This module contains all the client-side logic for the blockchain detail page.
 * It's designed to be imported by Astro and bundled for the browser.
 */

// Re-export utilities
export * from './cache.js';
export * from './chains.js';
export * from './utils.js';

/**
 * Create a viem public client with RPC fallback
 * Tries multiple RPC endpoints until one works
 */
export async function getClientWithFallback(chainId, viem, chains, options = {}) {
  const { onRpcSelected, performHealthCheck = true } = options;

  const chainConfig = getChainConfigForId(chainId, chains);
  const rpcUrls = getRpcUrlsForChain(chainId, chains);

  if (!chainConfig || rpcUrls.length === 0) {
    throw new Error('No RPC endpoints configured for this chain.');
  }

  let lastError = null;

  for (const url of rpcUrls) {
    try {
      const client = viem.createPublicClient({
        chain: chainConfig,
        transport: viem.http(url)
      });

      let blockNumber = null;

      if (performHealthCheck) {
        blockNumber = await client.getBlockNumber();
      }

      if (typeof onRpcSelected === 'function') {
        onRpcSelected(url, blockNumber);
      }

      return { client, rpcUrl: url, blockNumber };
    } catch (err) {
      lastError = err;
      console.warn(`RPC endpoint failed for chain ${chainId}: ${url}`, err);
    }
  }

  throw lastError || new Error('Unable to connect to any RPC endpoints.');
}

// Import chain helpers
import { getChainConfigForId, getRpcUrlsForChain } from './chains.js';

/**
 * Fetch logs in manageable chunks to avoid RPC limitations
 */
export async function fetchLogsInChunks({ client, address, event, fromBlock, toBlock, initialBatchSize = 50000n, maxRetries = 3 }) {
  const logs = [];
  const startBlock = BigInt(fromBlock);
  let latestBlock;

  if (typeof toBlock === 'string') {
    if (toBlock.toLowerCase() === 'latest') {
      latestBlock = await client.getBlockNumber();
    } else {
      latestBlock = BigInt(toBlock);
    }
  } else {
    latestBlock = BigInt(toBlock);
  }

  let batchSize = initialBatchSize;
  let currentFrom = startBlock;

  while (currentFrom <= latestBlock) {
    let currentTo = currentFrom + batchSize;
    if (currentTo > latestBlock) {
      currentTo = latestBlock;
    }

    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        const chunkLogs = await client.getLogs({
          address,
          event,
          fromBlock: currentFrom,
          toBlock: currentTo
        });
        logs.push(...chunkLogs);
        break;
      } catch (chunkError) {
        attempt += 1;
        console.warn(`getLogs failed for range ${currentFrom.toString()} - ${currentTo.toString()} (attempt ${attempt}/${maxRetries}):`, chunkError);

        if (attempt >= maxRetries) {
          throw chunkError;
        }

        batchSize = batchSize / 2n;
        if (batchSize < 1000n) {
          batchSize = 1000n;
        }

        currentTo = currentFrom + batchSize;
        if (currentTo > latestBlock) {
          currentTo = latestBlock;
        }
      }
    }

    currentFrom = currentTo + 1n;
  }

  return logs;
}

/**
 * Aggregate data by time intervals for chart display
 */
export function aggregateDataByInterval(records, interval, fields) {
  if (!records || records.length === 0 || interval === 'none') return records;

  const roundToInterval = (timestamp) => {
    const date = new Date(timestamp * 1000);
    date.setSeconds(0);
    date.setMilliseconds(0);

    switch (interval) {
      case '15min':
        date.setMinutes(Math.floor(date.getMinutes() / 15) * 15);
        break;
      case '30min':
        date.setMinutes(Math.floor(date.getMinutes() / 30) * 30);
        break;
      case '1hr':
        date.setMinutes(0);
        break;
      case '3hr':
        date.setMinutes(0);
        date.setHours(Math.floor(date.getHours() / 3) * 3);
        break;
      case '6hr':
        date.setMinutes(0);
        date.setHours(Math.floor(date.getHours() / 6) * 6);
        break;
      default:
        return timestamp;
    }

    return Math.floor(date.getTime() / 1000);
  };

  // Group records by time windows
  const groups = {};
  records.forEach(record => {
    const windowStart = roundToInterval(record.timestamp);
    if (!groups[windowStart]) {
      groups[windowStart] = [];
    }
    groups[windowStart].push(record);
  });

  // Aggregate each group
  const aggregatedRecords = Object.entries(groups).map(([windowStart, windowRecords]) => {
    const timestamp = parseInt(windowStart);

    const aggregatedValues = fields.map((field, fieldIndex) => {
      const values = windowRecords
        .map(r => r.values[fieldIndex])
        .filter(v => v !== null && v !== undefined);

      if (values.length === 0) return null;

      // Apply field-specific aggregation
      if (field.name.endsWith('_min')) {
        return Math.min(...values);
      } else if (field.name.endsWith('_max')) {
        return Math.max(...values);
      } else if (field.name.endsWith('_count')) {
        return values.reduce((sum, val) => sum + val, 0);
      } else if (field.name === 'installation_height') {
        return values[0];
      } else {
        return values.reduce((acc, val) => acc + val, 0) / values.length;
      }
    });

    const representativeRecord = windowRecords[0];

    return {
      sensor: representativeRecord.sensor,
      timestamp: timestamp,
      values: aggregatedValues,
      blockNumber: windowRecords[windowRecords.length - 1].blockNumber,
      transactionHash: representativeRecord.transactionHash,
      aggregated: true,
      recordCount: windowRecords.length,
      originalTimestamps: windowRecords.map(r => r.timestamp)
    };
  });

  return aggregatedRecords.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Convert hex color to RGBA
 */
export function hexToRgba(hex, alpha = 1) {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized.length === 3
    ? sanitized.split('').map(char => char + char).join('')
    : sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Chart color palette
 */
export const CHART_COLORS = {
  waterDepth: '#0ea5e9',
  installationHeight: '#16a34a',
  batteryVoltage: '#a855f7',
  fallback: [
    '#0ea5e9', '#2563eb', '#7c3aed', '#16a34a',
    '#f97316', '#ef4444', '#14b8a6', '#f59e0b'
  ]
};

/**
 * Get color for a field
 */
export function getFieldColor(fieldName, index) {
  const colors = {
    'water_depth': CHART_COLORS.waterDepth,
    'installation_height': CHART_COLORS.installationHeight,
    'battery_voltage': CHART_COLORS.batteryVoltage,
  };
  return colors[fieldName] || CHART_COLORS.fallback[index % CHART_COLORS.fallback.length];
}
