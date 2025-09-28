import { createPublicClient, fallback, http, type Chain, type PublicClient, type Transport } from 'viem';
import { SUPPORTED_CHAINS } from './blockchain-constants';

const RPC_HEALTH_TIMEOUT = 4_000;
const RPC_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface RpcHealthResult {
  url: string;
  latency: number;
}

interface RpcCacheEntry {
  urls: string[];
  timestamp: number;
}

export interface ResilientClientResult {
  client: PublicClient;
  rpcUrls: string[];
  primaryRpcUrl: string;
}

const rpcOrderCache = new Map<number, RpcCacheEntry>();

function getChain(chainId: number): Chain | undefined {
  return SUPPORTED_CHAINS.find((chain) => chain.id === chainId);
}

async function measureRpcLatency(url: string): Promise<RpcHealthResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RPC_HEALTH_TIMEOUT);

  try {
    const start = Date.now();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Math.floor(Math.random() * 1_000_000),
        method: 'eth_blockNumber',
        params: [],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`RPC ${url} responded with status ${response.status}`);
    }

    const data = await response.json();
    if (typeof data.result === 'string') {
      return { url, latency: Date.now() - start };
    }

    throw new Error(`RPC ${url} returned unexpected payload`);
  } catch (error) {
    console.warn('[rpc] RPC latency check failed', url, error);
    return { url, latency: Number.POSITIVE_INFINITY };
  } finally {
    clearTimeout(timeout);
  }
}

async function rankRpcUrls(chainId: number, urls: readonly string[]): Promise<string[]> {
  if (urls.length <= 1) {
    return [...urls];
  }

  const cached = rpcOrderCache.get(chainId);
  if (cached && Date.now() - cached.timestamp < RPC_CACHE_TTL && cached.urls.every((url) => urls.includes(url))) {
    return cached.urls;
  }

  const results = await Promise.all(urls.map((url) => measureRpcLatency(url)));
  const healthy = results.filter((result) => Number.isFinite(result.latency));
  const unhealthy = results.filter((result) => !Number.isFinite(result.latency));

  const ordered = [
    ...healthy.sort((a, b) => a.latency - b.latency),
    ...unhealthy,
  ].map((result) => result.url);

  rpcOrderCache.set(chainId, { urls: ordered, timestamp: Date.now() });

  return ordered;
}

function buildTransport(urls: string[]): Transport | null {
  if (!urls.length) {
    return null;
  }

  const transports = urls.map((url) =>
    http(url, {
      retryCount: 2,
      timeout: RPC_HEALTH_TIMEOUT,
    })
  );

  if (transports.length === 1) {
    return transports[0];
  }

  return fallback(transports);
}

export async function createResilientPublicClient(chainId: number): Promise<ResilientClientResult | null> {
  const chain = getChain(chainId);
  if (!chain) {
    console.error(`[rpc] Unsupported chainId ${chainId}`);
    return null;
  }

  const baseUrls = chain.rpcUrls?.default?.http ?? [];
  if (!baseUrls.length) {
    console.error(`[rpc] No RPC URLs configured for chainId ${chainId}`);
    return null;
  }

  const rankedUrls = chainId === 8899 ? await rankRpcUrls(chainId, baseUrls) : [...baseUrls];
  const transport = buildTransport(rankedUrls);

  if (!transport) {
    console.error('[rpc] Failed to build RPC transport');
    return null;
  }

  const client = createPublicClient({
    chain,
    transport,
  });

  const primaryRpcUrl = rankedUrls[0];
  rpcOrderCache.set(chainId, { urls: rankedUrls, timestamp: Date.now() });

  return {
    client,
    rpcUrls: rankedUrls,
    primaryRpcUrl,
  };
}
