# FloodBoy Sensor Stores Deployment

## Production Deployment

**Date**: 2025-07-14 07:08 GMT+7  
**Network**: JIBCHAIN L1  
**Chain ID**: 8899  
**Factory Contract**: `0xc9CF38eCfB4EFa79CBfE1f4b3C1464379bcf2a0a`

### Network Details

- **Name**: JIBCHAIN L1
- **RPC URL**: https://rpc-l1.jbc.xpool.pw
- **Explorer**: https://exp.jibchain.net
- **Currency**: JBC

### Contract Addresses

#### Factory Contract
- **Address**: `0xc9CF38eCfB4EFa79CBfE1f4b3C1464379bcf2a0a`
- **Explorer**: https://exp.jibchain.net/address/0xc9CF38eCfB4EFa79CBfE1f4b3C1464379bcf2a0a

### Deployment Configuration

```javascript
// Network configuration used for deployment
const JIBCHAIN_L1 = {
  id: 8899,
  name: 'JIBCHAIN L1',
  nativeCurrency: {
    decimals: 18,
    name: 'JBC',
    symbol: 'JBC',
  },
  rpcUrls: {
    default: { http: ['https://rpc-l1.jbc.xpool.pw'] },
    public: { http: ['https://rpc-l1.jbc.xpool.pw'] },
  },
  blockExplorers: {
    default: { 
      name: 'JIBCHAIN Explorer', 
      url: 'https://exp.jibchain.net' 
    },
  },
}
```

### Smart Contract Features

The deployed factory contract enables:
- Creation of individual sensor store contracts
- Multi-signature authorization for sensor data submission
- Structured data storage with field mappings
- Event emission for data tracking
- Owner-based access control

### Verification Status

- Factory contract deployed and verified
- Deployment transaction confirmed on JIBCHAIN L1
- Contract accessible via blockchain explorer

### Related Documentation

- [Smart Contract Dashboard](/blockchain)
- [Network Configuration](src/config/networks.ts)
- [Contract ABIs](src/constants/abi/)