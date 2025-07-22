// src/config/aliases.config.ts
export interface StoreAlias {
  alias: string;
  address: string;
  chainId: number;
  displayName: string;
}

// Initialize empty array
export const STORE_ALIASES: StoreAlias[] = [];

// Define all stores with their addresses (100 sensors) - Updated from issue #81
const storeData = [
  // FloodBoy001-020 (New deployment addresses)
  { name: "FloodBoy001", address: "0xCd3Ec17ddFDa24f8F97131fa0FDf20e7cbd1A8Bb" },
  { name: "FloodBoy002", address: "0x81ECfbd31D86bc8f3A581bD2f7c0f54B7498AC94" },
  { name: "FloodBoy003", address: "0x935B21D73bE382ba9D5Af56007502ea1d5E3348B" },
  { name: "FloodBoy004", address: "0xD591c530F8c8A62576349a5a0cc9F08C30a50Fab" },
  { name: "FloodBoy005", address: "0xeD43fBdb4dF40d143584Ca11A78dFCa8984e0f91" },
  { name: "FloodBoy006", address: "0x08c38ef8b1BfeE2ee360D6344D2D2636cA562601" },
  { name: "FloodBoy007", address: "0x7d6731C08E7F68c8fc96e8c98dF4c2A172539A8F" },
  { name: "FloodBoy008", address: "0x999AfDb6302B7a86D6d6F03ED4F496D831729c88" },
  { name: "FloodBoy009", address: "0x5E42C7C91Be0d6a5A2C1F8369DFF0E7CEb681598" },
  { name: "FloodBoy010", address: "0x80C4B02bF15a1Af95e239C5432AB1cAf2a4729C8" },
  { name: "FloodBoy011", address: "0xC7ca88151eC5869377e7478b8AB55f4d79558e2f" },
  { name: "FloodBoy012", address: "0xC1ad1ac4e3A6bbe2e56e6A592996E9938676FA4D" },
  { name: "FloodBoy013", address: "0x093800c0aB6958E702b0b0764eb044Bd2Ad35F19" },
  { name: "FloodBoy014", address: "0x5Be2ff7282EAD4B9280CA55F057442BFa2fdF438" },
  { name: "FloodBoy015", address: "0x86A230780268E400F4f8B37eb9DCe565b8143A1D" },
  { name: "FloodBoy016", address: "0x0994Bc66b2863f8D58C8185b1ed6147895632812" },
  { name: "FloodBoy017", address: "0xE7a15b70Af3545813CFA5b693cC3bB6A4431d7D3" },
  { name: "FloodBoy018", address: "0x65f5aa00672ad8AC94B72B4177193Fc9017FE28C" },
  { name: "FloodBoy019", address: "0xFec1d835318b7Cfe60f9D91Ec7214Eed813d2501" },
  { name: "FloodBoy020", address: "0x1701A62B62813160dE104461573A9e6069405655" },
  
  // FloodBoy021-040
  { name: "FloodBoy021", address: "0xB94648508454AD282CE5b334270bFf2F77Fd387D" },
  { name: "FloodBoy022", address: "0xD4657C613Fe42afD78d4855BB0701B427cf72412" },
  { name: "FloodBoy023", address: "0xb3a900c913Aa17eE256e0706174808F27A92ad34" },
  { name: "FloodBoy024", address: "0x428bdfB2D1e8AA91d0D095DbfBf0B6a98E395354" },
  { name: "FloodBoy025", address: "0x8794901C3Fec5a99a870E3A996ecB419608613Dd" },
  { name: "FloodBoy026", address: "0x43a5EE3e94C27f49BAE1F584C136cb7AdC8Ba687" },
  { name: "FloodBoy027", address: "0x1fE3F33ee210C9a40B04fe868E5b041a8C6e40f6" },
  { name: "FloodBoy028", address: "0xD5CC415b5CB976A608bA1F5c3969e6eF0D500F25" },
  { name: "FloodBoy029", address: "0xaF556B547e64bF1ce73724947feA939894AeD2FE" },
  { name: "FloodBoy030", address: "0xCDb87B98aFAE5dA56bc115ffBA8619819dcc7a4f" },
  { name: "FloodBoy031", address: "0xD68486994D9c479bCF099cdC9b97B42EE13471E2" },
  { name: "FloodBoy032", address: "0xAc52034291F804eedBF59428044f1dB434498e53" },
  { name: "FloodBoy033", address: "0x3768f50b5B377316e08010dB9e36d5213f085779" },
  { name: "FloodBoy034", address: "0x70E6f1201F1DC6e95484755ABC9C5B9eec5941E0" },
  { name: "FloodBoy035", address: "0xdE7C6d2Ce38E60cBC0e051A0aC59FAddb69eB7fF" },
  { name: "FloodBoy036", address: "0x96FcBd163e6bDf77f1cA0D669046CB2eb76D9300" },
  { name: "FloodBoy037", address: "0x08e5a039113Fd5e60EE6B5312026693eBD590A54" },
  { name: "FloodBoy038", address: "0xfd0F3eaBC38390F8F518E92614F4AaA9532DBE6e" },
  { name: "FloodBoy039", address: "0xE0500bD9dA67D2e5771E0a50FdBb1CFD828974F8" },
  { name: "FloodBoy040", address: "0x68ccd0049Da498bf9e3314a3f70A327a205aa7b3" },
  
  // FloodBoy041-060
  { name: "FloodBoy041", address: "0x0B8924AED54F9f430876B7eC723d9B93Eba9e5E7" },
  { name: "FloodBoy042", address: "0xbfC81106A8073207dab8ce7CCC224428467C0AF1" },
  { name: "FloodBoy043", address: "0xa43C827FBC8F9B9fECb1098319Ded14C38579330" },
  { name: "FloodBoy044", address: "0x53E2B449990C265902F84F2e2B3B2bdB6D6F365d" },
  { name: "FloodBoy045", address: "0x4CDab319eD28b2316C087c28B33b8d518690A9b0" },
  { name: "FloodBoy046", address: "0xE54181Be41dbeB91BB080B9aAbAcb4C5D628348c" },
  { name: "FloodBoy047", address: "0x7c151FaCE40a5470b43669526C0e19edaaF2e1f6" },
  { name: "FloodBoy048", address: "0x195F93e890948275842DfC358A52332A822dE66c" },
  { name: "FloodBoy049", address: "0x0e31578e6b5832846ba2229CE00d3CC8Eba43AD3" },
  { name: "FloodBoy050", address: "0x171BF0F4Ccce0ce6Fa22D83A7691C51321167e9B" },
  { name: "FloodBoy051", address: "0x0fe63C319c6926dD9784B2D7C9eF7b191f328f8D" },
  { name: "FloodBoy052", address: "0xF6858631707fb6eF7D6ef969ba9938Fa2B21B536" },
  { name: "FloodBoy053", address: "0x7f8dbeD83B43042EE6c4722bf5d0C67D84A3b559" },
  { name: "FloodBoy054", address: "0x8d5cB82f45137026B2572C67c9481B2a7d8837d6" },
  { name: "FloodBoy055", address: "0x2260B9075eAcc4d0B52cd26a48087D4f99b5c132" },
  { name: "FloodBoy056", address: "0x8dD583399c58f757921c418409887405dC24ea30" },
  { name: "FloodBoy057", address: "0xA7bfB1Af0581Bf5fd118919f0a3516446eADCfdf" },
  { name: "FloodBoy058", address: "0xb7751A8E4eF6Fa8b6558A64FbC1C956f59F76679" },
  { name: "FloodBoy059", address: "0xAe321507692dF61FBc1aB737Ac9ff20D96b3dCa6" },
  { name: "FloodBoy060", address: "0x6A891076a01b8e3C6D91f047e8A9B9Bf88C06124" },
  
  // FloodBoy061-080
  { name: "FloodBoy061", address: "0x87a467e49B9876FB8Ba47D5d55a507c6c6f336FE" },
  { name: "FloodBoy062", address: "0x7423a359e538fBfC7C76B8EECD8B4f70B8217511" },
  { name: "FloodBoy063", address: "0xa0017B7cD50b09aa4787E91AfCd1196842896d98" },
  { name: "FloodBoy064", address: "0x8Bc99456085f83bdAf2321D14b791BBEC0e91bcE" },
  { name: "FloodBoy065", address: "0xc60d09De0F6b69cE383DDC471968b97Ecf7374E5" },
  { name: "FloodBoy066", address: "0x549ac71404E1950410a04A23F7f732b8B1295b69" },
  { name: "FloodBoy067", address: "0x317760C3B54d501Cc64621bd8cd3728cc055f089" },
  { name: "FloodBoy068", address: "0x73754A6993AD59Ae3a87c3E1B21262574120C705" },
  { name: "FloodBoy069", address: "0x9ab79C94592559970106C1be5a048D63c8e163B5" },
  { name: "FloodBoy070", address: "0xb20E14EEDD4e818930b6294FCA3FF9A2a34AaCFf" },
  { name: "FloodBoy071", address: "0xfCC812c2fB0DcB2f55aF38397CFC2324dE7Af8Ee" },
  { name: "FloodBoy072", address: "0x3A95e7c03F13079F6518CE98EC6555bFD7435cB6" },
  { name: "FloodBoy073", address: "0xaC33BbF009AC1e4f8df115a828082CAdBb56db05" },
  { name: "FloodBoy074", address: "0xEdb03Bf879e8Fc41DAC1E14B95e1E0AB656da611" },
  { name: "FloodBoy075", address: "0xe19b084Cc36eebAC5E3cA4362a900fE7807cEfE3" },
  { name: "FloodBoy076", address: "0x3D825e1f3c6098F6c40d55Cefa85B1E39d42172D" },
  { name: "FloodBoy077", address: "0xD6B61c4D447Eb6994E4D5a2a72b1a96EF144394d" },
  { name: "FloodBoy078", address: "0xB1732811130FbFf6e5Ba64FEF9487B8FE50F3375" },
  { name: "FloodBoy079", address: "0x4db03813a4A5B7E9b7C7aBd6304Ca2E6867129F7" },
  { name: "FloodBoy080", address: "0x2A9046822cE79867b55c794eee14033C0e820D40" },
  
  // FloodBoy081-100
  { name: "FloodBoy081", address: "0xed932Bb2a3156bA03A527b1E8e4C19a33d97370f" },
  { name: "FloodBoy082", address: "0x6EdeE0d737763e080636ff16f0Ba75655Bbc8fd7" },
  { name: "FloodBoy083", address: "0x89795C584A572B01d0d488BA8965FA481BD8431e" },
  { name: "FloodBoy084", address: "0x834D04e3F97001f3Ec3eAa5e80caDD66c8EA5fcc" },
  { name: "FloodBoy085", address: "0x4F2522724D6C38099a89dcb08F669961968237bA" },
  { name: "FloodBoy086", address: "0xDaB6185F8d8303Fa8F59565C5cb93fC0e0E2e748" },
  { name: "FloodBoy087", address: "0x86Bd748Ff1B015B15e6B13Fa96111f157A066AF0" },
  { name: "FloodBoy088", address: "0xA50Eb6A9bf042Bd5ef4E24dBA6f744aFbE4bced2" },
  { name: "FloodBoy089", address: "0xFA05c0DF1FfC46B5e7286EE01550c1A4A443bD5d" },
  { name: "FloodBoy090", address: "0xcCdED0B3262561d7f2702bF3720c874a1d099F7a" },
  { name: "FloodBoy091", address: "0xf585e3ad1B727a951572760863bf03D86E9f7b50" },
  { name: "FloodBoy092", address: "0x1dF94E5570aF14942FB6ecb856b1A951f8EBfc6B" },
  { name: "FloodBoy093", address: "0x4d81126B668436308765A19f9F09dba1D4595A4D" },
  { name: "FloodBoy094", address: "0x9Faa8f1c192A531153Aa5e5491aD34b81e53c13e" },
  { name: "FloodBoy095", address: "0x0eA6E0Eccb31880871fB01D5E27EF558abEbE6E8" },
  { name: "FloodBoy096", address: "0xfdf2a9aaB0ADD0eE3962f73dA3dE360c8e8beE69" },
  { name: "FloodBoy097", address: "0xB0F237696e8B77BdD695De0f917aff97743689aF" },
  { name: "FloodBoy098", address: "0xe9Ecd1EE9A673F2FC6B82E896B9a42cd413Fb859" },
  { name: "FloodBoy099", address: "0xC3Fe38C70E7B6e6e58B6E2AacB78003927C39c4c" },
  { name: "FloodBoy100", address: "0x569b4fEC8f0DF90eBAd3f1b15fE729Dc124dca9C" },
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