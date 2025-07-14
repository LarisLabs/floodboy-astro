# FloodBoy Sensor Stores Deployment

## Production Deployment

**Date**: 2025-07-14 07:08 GMT+7  
**Network**: JIBCHAIN L1  
**Chain ID**: 8899  
**Factory Contract**: `0x904f1CCDb682f0E7b82387190C0EbF9015152BE7`

### Network Details

- **Name**: JIBCHAIN L1
- **RPC URL**: https://rpc-l1.jbc.xpool.pw
- **Explorer**: https://exp.jibchain.net
- **Currency**: JBC

### Contract Addresses

#### Factory Contract
- **Address**: `0x904f1CCDb682f0E7b82387190C0EbF9015152BE7`
- **Explorer**: https://exp.jibchain.net/address/0x904f1CCDb682f0E7b82387190C0EbF9015152BE7

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

### Configuration

The blockchain configuration is managed through a dedicated config file:
- **Location**: `src/config/blockchain.config.ts`
- **Type**: TypeScript configuration file (committed to version control)
- **Update Method**: Directly edit the file and commit changes

To update factory addresses or add new networks:
1. Edit `src/config/blockchain.config.ts`
2. Update the relevant chain configuration
3. Commit and push the changes

### Related Documentation

- [Smart Contract Dashboard](/blockchain)
- [Blockchain Configuration](src/config/blockchain.config.ts)
- [Contract ABIs](src/constants/abi/)