// Blockchain configuration file
// This is the main configuration for all blockchain networks and contracts
// You can modify this file directly and commit it to version control

interface ChainConfig {
  DEPLOYER_ADDRESS: string;
  EXPLORER_URL: string;
  NAME: string;
}

export interface BlockchainConfig {
  [chainId: number]: ChainConfig;
}

// Main blockchain configuration
export const BLOCKCHAIN_CONFIG: BlockchainConfig = {
  31337: { // Anvil Local
    NAME: "Anvil",
    DEPLOYER_ADDRESS: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    EXPLORER_URL: "http://localhost:8545",
  },
  700011: { // SiChang
    NAME: "SiChang",
    DEPLOYER_ADDRESS: "0x0000000000000000000000000000000000000000", // To be deployed
    EXPLORER_URL: "https://sichang.thaichain.org",
  },
  8899: { // JIBCHAIN L1
    NAME: "JIBCHAIN L1",
    DEPLOYER_ADDRESS: "0x63bB41b79b5aAc6e98C7b35Dcb0fE941b85Ba5Bb", // CatLabFactory (signer-based)
    EXPLORER_URL: "https://exp.jibchain.net",
  },
};

// Helper function to get config for a specific chain
export function getChainConfig(chainId: number): ChainConfig | undefined {
  return BLOCKCHAIN_CONFIG[chainId];
}

// Get all supported chain IDs
export function getSupportedChainIds(): number[] {
  return Object.keys(BLOCKCHAIN_CONFIG).map(id => parseInt(id));
}