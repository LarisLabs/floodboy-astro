// src/config/aliases.config.ts
export interface StoreAlias {
  alias: string;
  address: string;
  chainId: number;
  displayName: string;
}

// Initialize empty array
export const STORE_ALIASES: StoreAlias[] = [];

// Define all stores with their addresses (100 sensors)
const storeData = [
  // FloodBoy001-020 (Updated addresses from new deployment)
  { name: "FloodBoy001", address: "0x854437e10B92061B37C19c69860F4913Ef2d4d64" },
  { name: "FloodBoy002", address: "0xe81025c81769053C22BDF0BCa0Dc54917139e296" },
  { name: "FloodBoy003", address: "0xFa59ac694bDfEB34F2007F7f44805127c4Aa86c4" },
  { name: "FloodBoy004", address: "0x48F9944c31316C8407944DF6af33355eC00b4E49" },
  { name: "FloodBoy005", address: "0x3F3b8A3A636391c6c61a9CD4AE90D7B0fD1CcB23" },
  { name: "FloodBoy006", address: "0x637B0644938788970951502a052C86E2799F3572" },
  { name: "FloodBoy007", address: "0x7adA0bE66AC1Ff499aE132b0fC14E9B56E21c42a" },
  { name: "FloodBoy008", address: "0xef3518958EF3c23EeD8A73C50694cfABEb75B0d4" },
  { name: "FloodBoy009", address: "0x005Eb5Ce11d25A60bCBcCE79B5bA73D3FBd7A519" },
  { name: "FloodBoy010", address: "0x51badafFaBDA134fdC77e8505c4aCF1A1D4a443B" },
  { name: "FloodBoy011", address: "0xfd3B6Af1C59E3101411aBDb86EB48425898F197A" },
  { name: "FloodBoy012", address: "0xCA909948fafa0982CDFd33A8352E8152FaF42c8F" },
  { name: "FloodBoy013", address: "0xB4A2324FA614DFE3d649d77d8858fd697ef8B6bC" },
  { name: "FloodBoy014", address: "0x2B6D8B04d08f4191e38531027B71E8787C775442" },
  { name: "FloodBoy015", address: "0x7cD170fd7ed0F4F96C7Fd74e84a5F218c17B01d9" },
  { name: "FloodBoy016", address: "0x488D2a339278088085b55d6a2EB19EC0d559779b" },
  { name: "FloodBoy017", address: "0x8Bbf6972289f0c26cc562e4C7eE2d0F67c98D0F9" },
  { name: "FloodBoy018", address: "0x32A89D1D42F8B9E5CeA4BeC2f126F7D6E46031bF" },
  { name: "FloodBoy019", address: "0xEa3a04a513455aA3B3E7b1194D803aA7DAE57D87" },
  { name: "FloodBoy020", address: "0x380fe136bFD7e0D74F58feD64142A24377562501" },
  
  // FloodBoy021-040
  { name: "FloodBoy021", address: "0x75F3571141fadCa5d1b698DDBC55CfFf0Da8B16e" },
  { name: "FloodBoy022", address: "0xAA9AcBFbF64c786293C2e2e1be1ece53931B03ce" },
  { name: "FloodBoy023", address: "0x7942Ae00D71De68D4560f7CC108A8c03E185ff2e" },
  { name: "FloodBoy024", address: "0x7ff60E5E97B5d0626Ad49167b296674254dFD0dF" },
  { name: "FloodBoy025", address: "0x1Bec5E981e62bDEaFFaCab8F2810715C227D67c3" },
  { name: "FloodBoy026", address: "0x64510261F141E5eE2bFF53e054d91352000b0209" },
  { name: "FloodBoy027", address: "0x45f2137AB212aD319cFeb8882df3E91C77Fb8887" },
  { name: "FloodBoy028", address: "0x97d0fD11d5e8753B81E2C857497F91457089D053" },
  { name: "FloodBoy029", address: "0x3aD7a4eEC5165468829a4b11E55FEc89AfA6a982" },
  { name: "FloodBoy030", address: "0x0623986dBC3E81b063defC5f1B802D9D58640832" },
  { name: "FloodBoy031", address: "0x0ee356348E5Cc83cD0439680E216B5d9116a3DF6" },
  { name: "FloodBoy032", address: "0x680848968e2E58100753c158bbF662427521453C" },
  { name: "FloodBoy033", address: "0xCC7b7641402c4Be0D6057A1B97428C8042a40de1" },
  { name: "FloodBoy034", address: "0x027e0DA94a2262bfA0dE68121B865B787F34340c" },
  { name: "FloodBoy035", address: "0x22E80a7e7e3074e1E0B200F18FB95d5ae3FD4707" },
  { name: "FloodBoy036", address: "0x5d0cf662999d00EBe1A849B5861391Ce54959876" },
  { name: "FloodBoy037", address: "0xb0C979cBb8880B14F9B5a5CE23A0C2aaDB4f72A1" },
  { name: "FloodBoy038", address: "0x012b4fbC72b4748A9183cDdd6553C8D7C62e2aF9" },
  { name: "FloodBoy039", address: "0x627bCE9cb9951313a811D63d1b176304E6529176" },
  { name: "FloodBoy040", address: "0xB124842bEE42Bcb768112692FaC7217643462026" },
  
  // FloodBoy041-060
  { name: "FloodBoy041", address: "0x797ECb52688d16716638930B59A8A2C2da2450Ad" },
  { name: "FloodBoy042", address: "0x547e5a16fe69e7ceCd3Db8Bf295afB3314982176" },
  { name: "FloodBoy043", address: "0x27E421BfDDa376acf2E7Ca2fEd7303fa2AD83978" },
  { name: "FloodBoy044", address: "0xF01F418D752A2AdCF3E9722040DE83C08Ce6AD6C" },
  { name: "FloodBoy045", address: "0x8B8BC8340A357f46339035C3549511AAC27CA379" },
  { name: "FloodBoy046", address: "0x109E77e81af8BE0d0F4F3205e0789ae129eeCaf5" },
  { name: "FloodBoy047", address: "0xc5C08d6FE1fdfb182f55c11491ED20EC6B55716d" },
  { name: "FloodBoy048", address: "0x9829fc888C8360F790efD2DA3dEbe3eE9042c385" },
  { name: "FloodBoy049", address: "0x9511b7e21Eb5b1aCb75Dd6E9790DDc35F98Ec8AE" },
  { name: "FloodBoy050", address: "0x81ce7a386b2a4d02974761946f53739Bf9D4CE35" },
  { name: "FloodBoy051", address: "0x4356eB72C9454873aC8a1f6B07a81bf91DEc53f4" },
  { name: "FloodBoy052", address: "0xdfA8FDc409d6f8f8b4B05be834cACd056A5A0DDF" },
  { name: "FloodBoy053", address: "0x4A67CEfb6eEaBDc809e26D91D6919a53d26AF040" },
  { name: "FloodBoy054", address: "0xF3808F26D8B93a1D34B09cF0441433BC2e020615" },
  { name: "FloodBoy055", address: "0x1cd530b67a57b7B0C76fE7cC43279BF9E6853646" },
  { name: "FloodBoy056", address: "0x399c2258Cd6aa04BA1F86c1DaE4CC607C85972DA" },
  { name: "FloodBoy057", address: "0x3A000615aA13bA962D96312E70c8C64FecceC3CF" },
  { name: "FloodBoy058", address: "0x217f8D931E9Df305f7533d7C4B1371d48cdC669b" },
  { name: "FloodBoy059", address: "0xB429E276F2A96D277aCA1bd92c72F7071bd73e43" },
  { name: "FloodBoy060", address: "0x12b9d8cBCCD22C2DBB31D637976Ac63aC48AD689" },
  
  // FloodBoy061-080
  { name: "FloodBoy061", address: "0x70BA94634C845FD3b5d97c9def7289Ae276a15EA" },
  { name: "FloodBoy062", address: "0xbFd26eCF2EbAfD57B1D9857B61736ad12352EDC3" },
  { name: "FloodBoy063", address: "0x65BAd4262AfDA246C20b9F88D3B6A9672aC8b8d6" },
  { name: "FloodBoy064", address: "0xc5d12968bD3651C50e41BeC62f9eE95623f572f6" },
  { name: "FloodBoy065", address: "0xccf0F69b81A51954494e3d1ffac6ce11F8125360" },
  { name: "FloodBoy066", address: "0xAe06517D2dD4D3E081Fb1ADdF98a776ba04D562E" },
  { name: "FloodBoy067", address: "0x359719EdcC54A9FC40da6ce65BE5E61cb3EC80b6" },
  { name: "FloodBoy068", address: "0xB4C52017CD80A5d82Eb281965Af892854781B6a3" },
  { name: "FloodBoy069", address: "0x54043d40acd7d9b41e4ccf51765D508a38585050" },
  { name: "FloodBoy070", address: "0x04d28D303Aa8689a2854D71f0A3B3d9437a37c1b" },
  { name: "FloodBoy071", address: "0x8dF773d43C7f54A195Af8FffDb6D2fd6A9696872" },
  { name: "FloodBoy072", address: "0x6909eC104E2d04440B92f4fB9bCdF5f2eF64327C" },
  { name: "FloodBoy073", address: "0x696f370C68eEA9699F929e37eF4570a876fEdd81" },
  { name: "FloodBoy074", address: "0x65324E6fFf9da86e078f1511252ad37EAf63292A" },
  { name: "FloodBoy075", address: "0xb3508b24d626717cB494CfbC13ae4124F7DCF8e9" },
  { name: "FloodBoy076", address: "0x3F6797e3911C86b7cCbcc39176B852B30A3D4c27" },
  { name: "FloodBoy077", address: "0x8C212b2E5D4b9907733Be6Da24a9e24F6d4921F3" },
  { name: "FloodBoy078", address: "0x8a96bF6bef8808b7e49a450Ac5c83F68995091ef" },
  { name: "FloodBoy079", address: "0xFbDF9218791185b018Ac68F1B2449E1C6BB30091" },
  { name: "FloodBoy080", address: "0xd224c9AfD4c0432aCeb5aA394F0FBD660A7D1C37" },
  
  // FloodBoy081-100
  { name: "FloodBoy081", address: "0x707466CfEE59148c4005991FD217C8bA17875210" },
  { name: "FloodBoy082", address: "0x803fa4B3Ae4d83bF8B9a947a62E695697103C85A" },
  { name: "FloodBoy083", address: "0x13df477fAB730AC4cb80585E67EC063E15442509" },
  { name: "FloodBoy084", address: "0xc55f00DE73414CA58a2ca516F6d1DfE7c1BF424f" },
  { name: "FloodBoy085", address: "0x97Be5a26c233cEa7161c4D25D5ddD5FdD5C442c5" },
  { name: "FloodBoy086", address: "0x5e12e81aa116c31a9193a11069b92Ca80f2bf552" },
  { name: "FloodBoy087", address: "0x3441D07Cd5a661490F848E6b730683787B6624cE" },
  { name: "FloodBoy088", address: "0x64060D9b071DCBdb311c7868F27B1a06FDa7d82C" },
  { name: "FloodBoy089", address: "0xCEb62745a978b905b92B54B2dfc40aA8b7814069" },
  { name: "FloodBoy090", address: "0x8cD3D9E396CA5420609e1911d03f3f7816c1c918" },
  { name: "FloodBoy091", address: "0x00cd361f0B8bBd01B24FFab030412EE3AbBe9868" },
  { name: "FloodBoy092", address: "0x1Fb0588C979c531C3343Ab7b14E14a9B9D1BE6f4" },
  { name: "FloodBoy093", address: "0x8Bf94189a3919caf5Ca8Ed6BE9B41C35Fb5C714F" },
  { name: "FloodBoy094", address: "0xe5498eC46101CF2e5E721173450543257fc871D4" },
  { name: "FloodBoy095", address: "0x9F1294B04f977A7EF56407F5EBe39D9399515ccC" },
  { name: "FloodBoy096", address: "0xDAC6c920c2b8dd038b8387E35a759B80f5fC8493" },
  { name: "FloodBoy097", address: "0x549D289d3E2D5ff40271aE1F1C158314f883CB1a" },
  { name: "FloodBoy098", address: "0xa1FdAEe088Dfe2dD2378db0606704bA34F8f0504" },
  { name: "FloodBoy099", address: "0xF9F51113621363cbe5dBF9231728f01E97e8454D" },
  { name: "FloodBoy100", address: "0x1a3a871898fbeF9375213b4D4BF79251749cE81E" },
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