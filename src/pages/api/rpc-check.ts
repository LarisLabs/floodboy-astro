import type { APIRoute } from 'astro';
import { createPublicClient, http } from 'viem';
import { JIBCHAIN_RPC_ENDPOINTS, jibchainL1 } from '../../utils/blockchain-constants';

const RPC_TIMEOUT = 5000;

interface RpcResult {
  url: string;
  latency: number;
  blockNumber: number;
  online: boolean;
  error?: string;
}

async function checkEndpointWithViem(url: string): Promise<RpcResult> {
  const start = Date.now();

  try {
    const client = createPublicClient({
      chain: jibchainL1,
      transport: http(url, {
        timeout: RPC_TIMEOUT,
        retryCount: 0,
      }),
    });

    const blockNumber = await client.getBlockNumber();
    const latency = Date.now() - start;

    return {
      url,
      latency,
      blockNumber: Number(blockNumber),
      online: true,
    };
  } catch (error) {
    return {
      url,
      latency: Date.now() - start,
      blockNumber: 0,
      online: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const GET: APIRoute = async () => {
  const results = await Promise.all(
    JIBCHAIN_RPC_ENDPOINTS.map((url) => checkEndpointWithViem(url))
  );

  // Sort by latency (online first, then by speed)
  const sorted = [...results].sort((a, b) => {
    if (a.online && !b.online) return -1;
    if (!a.online && b.online) return 1;
    return a.latency - b.latency;
  });

  return new Response(JSON.stringify({
    results,
    ranked: sorted,
    fastest: sorted.find(r => r.online)?.url || null,
    timestamp: Date.now()
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=10',
    },
  });
};
