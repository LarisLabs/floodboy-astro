# Contract ABIs and Deployments

This directory contains the Application Binary Interfaces (ABIs) for the Cat Lab IoT Factory smart contracts.

## Files

- `CatLabFactory.abi.json` - ABI for the factory contract that deploys sensor stores
- `CatLabSensorStore.abi.json` - ABI for individual sensor store contracts
- `deployments.json` - Deployment addresses and information for each network

## Current Deployments

### JIBCHAIN (Chain ID: 8899)

#### CatLabFactory
- **Address**: `0x63bB41b79b5aAc6e98C7b35Dcb0fE941b85Ba5Bb`
- **Status**: Deployed (NOT verified)
- **Owner**: `0xfD5203Fa21E0F8a1e45cda0dc6740B874fFF5909`

#### CatLabSensorStore (Example)
- **Address**: `0x887306B1EE95d20A6bC6f4390083d0bA2118f450`
- **Status**: Deployed and Verified
- **Owner**: `0x073caFeAD67E5bbD7537466C506976928ED8fF00`
- **Explorer**: https://exp.jibchain.net/address/0x887306b1ee95d20a6bc6f4390083d0ba2118f450

## Usage

These ABIs can be used with web3 libraries like ethers.js or viem to interact with the deployed contracts.

### Example with ethers.js:
```javascript
import { ethers } from 'ethers';
import CatLabFactoryABI from './CatLabFactory.abi.json';
import deployments from './deployments.json';

const provider = new ethers.JsonRpcProvider(deployments.JIBCHAIN.rpcUrl);
const factoryAddress = deployments.JIBCHAIN.contracts.CatLabFactory.address;
const factory = new ethers.Contract(factoryAddress, CatLabFactoryABI, provider);
```

### Example with viem:
```typescript
import { createPublicClient, http } from 'viem';
import { defineChain } from 'viem/chains';
import CatLabFactoryABI from './CatLabFactory.abi.json';
import deployments from './deployments.json';

const jibchain = defineChain({
  id: 8899,
  name: 'JIBCHAIN',
  network: 'jibchain',
  nativeCurrency: { name: 'JBC', symbol: 'JBC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc-l1.jibchain.net'] }
  }
});

const publicClient = createPublicClient({
  chain: jibchain,
  transport: http()
});

// Read from factory
const result = await publicClient.readContract({
  address: deployments.JIBCHAIN.contracts.CatLabFactory.address,
  abi: CatLabFactoryABI,
  functionName: 'allStoresCount'
});
```