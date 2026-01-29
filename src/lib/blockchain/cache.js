/**
 * IndexedDB Cache for Blockchain Events
 * Provides persistent caching of blockchain events to speed up page loads
 */

const DB_NAME = 'floodboy-blockchain-cache';
const DB_VERSION = 1;
const STORE_NAME = 'events';

export function openCacheDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'cacheKey' });
        store.createIndex('storeAddress', 'storeAddress', { unique: false });
      }
    };
  });
}

export async function getCachedEvents(storeAddress, chainId) {
  try {
    const db = await openCacheDB();
    const cacheKey = `${chainId}-${storeAddress.toLowerCase()}`;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(cacheKey);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    return null;
  }
}

export async function setCachedEvents(storeAddress, chainId, events, lastBlock) {
  try {
    const db = await openCacheDB();
    const cacheKey = `${chainId}-${storeAddress.toLowerCase()}`;
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const request = store.put({
        cacheKey,
        storeAddress: storeAddress.toLowerCase(),
        chainId,
        events,
        lastBlock: lastBlock.toString(),
        cachedAt: Date.now()
      });
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    // Silently fail cache writes
  }
}

// Note: getBlockFromDaysAgo is now exported from utils.js (via blockchain-constants.ts)
