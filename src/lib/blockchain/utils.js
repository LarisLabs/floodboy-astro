/**
 * Blockchain Data Processing Utilities
 * Re-exports from central blockchain-constants.ts + additional utilities
 */

// Re-export utilities from central source
export {
  formatAddress,
  formatScaledValue,
  parseScalingFactor,
  getBlockFromDaysAgo,
  MULTICALL3_ADDRESS,
  FACTORY_ADDRESS,
  UNIVERSAL_SIGNER,
  FLOODBOY020_ADDRESS,
  STORE_ABI,
  DEPLOYER_ABI,
} from '../../utils/blockchain-constants.ts';

/**
 * RecordStored event definition for viem
 */
export const RECORD_STORED_EVENT = {
  type: 'event',
  name: 'RecordStored',
  inputs: [
    { name: 'sensor', type: 'address', indexed: true },
    { name: 'timestamp', type: 'uint256', indexed: false },
    { name: 'values', type: 'int256[]', indexed: false }
  ]
};

/**
 * Multicall3 ABI for batch calls
 */
export const MULTICALL3_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'target', type: 'address' },
          { name: 'allowFailure', type: 'bool' },
          { name: 'callData', type: 'bytes' }
        ],
        name: 'calls',
        type: 'tuple[]'
      }
    ],
    name: 'aggregate3',
    outputs: [
      {
        components: [
          { name: 'success', type: 'bool' },
          { name: 'returnData', type: 'bytes' }
        ],
        name: 'returnData',
        type: 'tuple[]'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  }
];

/**
 * Process raw event logs into structured records
 * Handles both fresh logs and serialized cache data
 * @param {Array} logs - Raw event logs
 * @returns {Array} Processed records sorted by timestamp desc
 */
export function processRecordLogs(logs) {
  return logs
    .filter(log => log.args && log.args.sensor && log.args.timestamp && log.args.values)
    .map(log => ({
      sensor: log.args.sensor,
      timestamp: Number(log.args.timestamp),
      values: log.args.values.map(v => Number(v)),
      blockNumber: typeof log.blockNumber === 'string' ? BigInt(log.blockNumber) : log.blockNumber,
      transactionHash: log.transactionHash
    }))
    .sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Smart water level filtering with time-gap awareness
 * Filters out sensor failures, impossible values, and outliers
 * @param {Array} records - Processed records
 * @param {Array} fields - Field definitions
 * @param {string} storeAddress - Contract address
 * @returns {Array} Filtered records
 */
export function filterWaterLevelData(records, fields, storeAddress) {
  const shouldFilter = true; // Apply to all sensors

  if (!shouldFilter) {
    return records;
  }

  const waterDepthIdx = fields.findIndex(f => f.name === 'water_depth');
  if (waterDepthIdx < 0) return records;

  return records.filter((record, index, arr) => {
    const waterDepth = record.values[waterDepthIdx];

    // 1. Filter zero values (sensor failures)
    if (waterDepth === 0) {
      return false;
    }

    // 2. Filter impossible values (negative or > 20m)
    if (waterDepth < 0 || waterDepth > 200000) {
      return false;
    }

    // 3. Detect isolated spikes
    if (index > 0 && index < arr.length - 1) {
      const prev = arr[index - 1];
      const next = arr[index + 1];
      const prevDepth = prev.values[waterDepthIdx];
      const nextDepth = next.values[waterDepthIdx];

      const returnToBaseline = Math.abs(prevDepth - nextDepth);
      const avgSurrounding = (prevDepth + nextDepth) / 2;
      const currentDeviation = Math.abs(waterDepth - avgSurrounding);

      if (returnToBaseline < 500 && currentDeviation > 1000) {
        return false;
      } else if (returnToBaseline < 1000 && currentDeviation > 2500) {
        return false;
      }
    }

    // 4. Smart rate-of-change detection with time gap awareness
    if (index > 0) {
      const prev = arr[index - 1];
      const timeDiff = Math.abs(record.timestamp - prev.timestamp) / 60;
      const waterChange = Math.abs(waterDepth - prev.values[waterDepthIdx]);

      const NORMAL_INTERVAL = 15;
      const MAX_CHANGE_PER_INTERVAL = 5000;

      if (timeDiff <= NORMAL_INTERVAL) {
        if (waterChange > MAX_CHANGE_PER_INTERVAL) {
          return false;
        }
      } else {
        const maxAcceptableChange = (timeDiff / NORMAL_INTERVAL) * MAX_CHANGE_PER_INTERVAL;
        if (waterChange > maxAcceptableChange) {
          return false;
        }
      }
    }

    return true;
  });
}
