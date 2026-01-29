/**
 * Chain Configurations
 * Re-exports from central blockchain-constants.ts
 */

// Re-export chain configs from the central source
export {
  jibchainL1,
  sichang,
  anvil,
  SUPPORTED_CHAINS,
  JIBCHAIN_RPC_ENDPOINTS,
  getChainById as getChainConfigForId,
  getExplorerUrl,
  getRpcUrlsForChain,
} from '../../utils/blockchain-constants.ts';

// Alias for backwards compatibility
export const prioritizedJibchainRpcUrls = [
  'https://rpc-l1.inan.in.th',
  'https://rpc-l1.jibchain.net',
  'https://rpc2-l1.jbc.xpool.pw',
  'https://rpc-l1.jbc.xpool.pw'
];

/**
 * Get first available RPC URL for a chain
 */
export function getRpcUrlForChain(chainId, viemChains) {
  const { getRpcUrlsForChain } = require('../../utils/blockchain-constants.ts');
  const urls = getRpcUrlsForChain(chainId);
  return urls.length > 0 ? urls[0] : null;
}
