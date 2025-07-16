// src/config/aliases.config.ts
export interface StoreAlias {
  alias: string;
  address: string;
  chainId: number;
  displayName: string;
}

// Initialize empty array
export const STORE_ALIASES: StoreAlias[] = [];

// Define all stores with their addresses
const storeData = [
  { name: "FloodBoy001", address: "0x150b9E4FAdBCEEba67307B79b2b1BD624f8162D4" },
  { name: "FloodBoy002", address: "0xA53312A1c9Ea13baf90ac54E71BDf352Bc6C026c" },
  { name: "FloodBoy003", address: "0x96033c7Fe1142eCa0Edc1193B762185D33BCa35b" },
  { name: "FloodBoy004", address: "0x5003e1204c3AC8331f9f50FA29ac46c53D9cF419" },
  { name: "FloodBoy005", address: "0xC683487761E94d517Bf6E17a0f3B55c784Bf0124" },
  { name: "FloodBoy006", address: "0x84b672D303a59b11CBa21D9C51BFe01aBf5bE454" },
  { name: "FloodBoy007", address: "0xf98250928E31546561D2467E28807fC4C3F436dE" },
  { name: "FloodBoy008", address: "0x1F3093f69D54dAb6444a17B3c4a238940AFbA2b9" },
  { name: "FloodBoy009", address: "0x8F91732a5d363BDa0cA514DC0D5f6841755B08f9" },
  { name: "FloodBoy010", address: "0x736D50bFBA8d0C8f4398b2C34fef245358b9adc3" },
  { name: "FloodBoy011", address: "0x5372C85Bb2609313ce446622CFeb923B2B5BC255" },
  { name: "FloodBoy012", address: "0x0B83eb02f56bB01A94E45E7a24bfA9bC95Aeb5bE" },
  { name: "FloodBoy013", address: "0xea5Cc86Bd188CA86a229007B5AC40692566F0c2e" },
  { name: "FloodBoy014", address: "0x65c988F1ec8C2E85c364154E9E8f3Bb4F55e08e3" },
  { name: "FloodBoy015", address: "0x900D0Ade14E41dCE65504117d1E4F3049A63B47c" },
  { name: "FloodBoy016", address: "0x739FE5d20a84164986B398260ec9B3002D8d7273" },
  { name: "FloodBoy017", address: "0xe46f4CA2fdD62Bc8C9Db27A3bbbcd120277c887D" },
  { name: "FloodBoy018", address: "0x814d23621a5bF52F592780982a2085853a4A0bc8" },
  { name: "FloodBoy019", address: "0x9D7D46220Be41d68f02EB2Cd7DC1B757496D90ef" },
  { name: "FloodBoy020", address: "0x910B63c56403f842F22A8F5343767Ea36978Abc7" },
];

// Build STORE_ALIASES using for...of loop
for (const store of storeData) {
  STORE_ALIASES.push({
    alias: store.name.toLowerCase(),
    address: store.address,
    chainId: 8899,
    displayName: store.name
  });
}

// Helper function to get address from alias
export function getAddressFromAlias(alias: string): string | undefined {
  const found = STORE_ALIASES.find(a => a.alias.toLowerCase() === alias.toLowerCase());
  return found?.address;
}

// Helper function to get alias from address
export function getAliasFromAddress(address: string): string | undefined {
  const found = STORE_ALIASES.find(a => 
    a.address.toLowerCase() === address.toLowerCase()
  );
  return found?.alias;
}

// Check if string is valid alias
export function isValidAlias(alias: string): boolean {
  return STORE_ALIASES.some(a => a.alias.toLowerCase() === alias.toLowerCase());
}

// Get all aliases for listing
export function getAllAliases(): StoreAlias[] {
  return STORE_ALIASES;
}