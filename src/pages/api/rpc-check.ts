import type { APIRoute } from 'astro';
import { JIBCHAIN_RPC_ENDPOINTS } from '../../utils/blockchain-constants';

const RPC_TIMEOUT = 5000;

interface RpcResult {
  url: string;
  latency: number;
  blockNumber: number;
  online: boolean;
  error?: string;
}

async function checkEndpoint(url: string): Promise<RpcResult> {
  const start = Date.now();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RPC_TIMEOUT);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: Date.now(),
        method: 'eth_blockNumber',
        params: [],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    const latency = Date.now() - start;
    const blockNumber = parseInt(data.result, 16);

    return {
      url,
      latency,
      blockNumber,
      online: true,
    };
  } catch (error) {
    clearTimeout(timeout);
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
    JIBCHAIN_RPC_ENDPOINTS.map((url) => checkEndpoint(url))
  );

  return new Response(JSON.stringify({ results, timestamp: Date.now() }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=10',
    },
  });
};
