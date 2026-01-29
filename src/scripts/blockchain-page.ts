/**
 * Blockchain Detail Page - Client Entry Point
 * This script is loaded by the blockchain/[address].astro page
 */

// Import utilities
import {
  getCachedEvents,
  setCachedEvents,
  getBlockFromDaysAgo,
  jibchainL1,
  sichang,
  getExplorerUrl,
  getRpcUrlsForChain,
  formatScaledValue,
  formatAddress,
  processRecordLogs,
  filterWaterLevelData,
  RECORD_STORED_EVENT,
  MULTICALL3_ABI,
  MULTICALL3_ADDRESS,
} from '../lib/blockchain/index.js';

import { createFloodboyVisualization } from '../components/blockchain/FloodboyVisualization.js';

// Make utilities available globally for the inline React components
declare global {
  interface Window {
    blockchainUtils: {
      getCachedEvents: typeof getCachedEvents;
      setCachedEvents: typeof setCachedEvents;
      getBlockFromDaysAgo: typeof getBlockFromDaysAgo;
      jibchainL1: typeof jibchainL1;
      sichang: typeof sichang;
      getExplorerUrl: typeof getExplorerUrl;
      getRpcUrlsForChain: typeof getRpcUrlsForChain;
      formatScaledValue: typeof formatScaledValue;
      formatAddress: typeof formatAddress;
      processRecordLogs: typeof processRecordLogs;
      filterWaterLevelData: typeof filterWaterLevelData;
      RECORD_STORED_EVENT: typeof RECORD_STORED_EVENT;
      MULTICALL3_ABI: typeof MULTICALL3_ABI;
      MULTICALL3_ADDRESS: typeof MULTICALL3_ADDRESS;
      createFloodboyVisualization: typeof createFloodboyVisualization;
    };
  }
}

// Export to window for use in inline scripts
window.blockchainUtils = {
  getCachedEvents,
  setCachedEvents,
  getBlockFromDaysAgo,
  jibchainL1,
  sichang,
  getExplorerUrl,
  getRpcUrlsForChain,
  formatScaledValue,
  formatAddress,
  processRecordLogs,
  filterWaterLevelData,
  RECORD_STORED_EVENT,
  MULTICALL3_ABI,
  MULTICALL3_ADDRESS,
  createFloodboyVisualization,
};

console.log('[FloodBoy] Blockchain utilities loaded');
