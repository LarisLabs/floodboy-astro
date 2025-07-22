---
title: "When Sensors Lie: Handling Invalid Blockchain Data"
description: "Real factory data integration revealed a critical truth - blockchain stores everything, valid or not. Here's how we handled 4.76m water levels from 2.5m sensors"
pubDate: "Jul 13 2025"
heroImage: "/blog-placeholder-3.jpg"
---

# When Sensors Lie: Handling Invalid Blockchain Data

**Session: July 13, 2025 - 18:05 to 19:05 GMT+7 - 60 minutes**

---

*What happens when immutable blockchain data contains impossible values? This session taught us about defensive programming, data validation boundaries, and the philosophy of truth in decentralized systems.*

## The Victory That Led to Discovery

We started this session on a high note - successfully integrating real factory data from JIBCHAIN. After removing all mock data, three real IoT flood monitoring stores appeared on our dashboard:

- Store 1: Normal water levels, everything functioning
- Store 2: Reasonable data, no issues
- Store 3: Water level 4.76 meters... from a 2.5-meter sensor

Wait, what?

## The Impossible Reading

Here's the problem: Our flood sensors have a physical installation height of 2.5 meters. They literally cannot measure water above this point. Yet there it was, stored forever on the blockchain: **4.76 meters**.

The blockchain doesn't lie - it stores exactly what it receives. But sensors? Sensors can malfunction, miscalibrate, or simply report garbage data.

## The Philosophical Debate

This led to an interesting architectural discussion:

### Option 1: Smart Contract Validation
```solidity
function storeData(int256 waterLevel) public {
    require(waterLevel <= 250, "Invalid water level"); // 2.5m in cm
    // Store data...
}
```

**Pros**: Data integrity at the source
**Cons**: Requires redeployment, gas costs for validation

### Option 2: UI-Level Defense
```javascript
const displayLevel = Math.min(waterLevel, installationHeight);
const isOverflow = waterLevel > installationHeight;
```

**Pros**: Flexible, no blockchain changes needed
**Cons**: Each client must implement protection

## Our Solution: Transparency with Safety

We chose Option 2 with a twist - show the truth, but handle it gracefully:

```javascript
// Defensive rendering
const renderHeight = Math.min(waterLevel, installationHeight);

// But show actual value with warning
if (waterLevel > installationHeight) {
    showWarning(`⚠️ Sensor overflow: ${waterLevel}m exceeds ${installationHeight}m range`);
}
```

This approach:
1. Prevents UI breakage (water animation stays within bounds)
2. Maintains data transparency (actual blockchain value visible)
3. Educates users (clear indication of sensor limits)

## The Implementation Journey

The fix itself was straightforward, but the details mattered:

### First Attempt: Text Overflow
```javascript
// Problem: Text got cropped at canvas edge
ctx.fillText(`${waterLevel}m`, x, installationHeight - renderHeight - 5);
```

### Final Solution: Centered Warning
```javascript
// Solution: Center text, add background for readability
if (isOverflow) {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.8)';
    ctx.fillRect(x - 30, 10, 60, 25);
    ctx.fillStyle = 'white';
    ctx.fillText(`${waterLevel}m ⚠️`, x, 25);
}
```

## Lessons for Blockchain IoT Systems

### 1. Blockchain is a Database, Not a Validator
The blockchain stores what you give it - no more, no less. Validation is your responsibility.

### 2. Defensive UI is Non-Negotiable
When dealing with unvalidated blockchain data:
- Always check bounds
- Never trust data ranges
- Provide visual feedback for anomalies

### 3. Transparency Builds Trust
Rather than hiding bad data, we:
- Show the actual value
- Explain why it's problematic
- Provide visual indicators

### 4. Simple Contracts, Smart Clients
Keeping the smart contract simple (just storage) means:
- Lower gas costs
- Easier upgrades
- Flexible validation rules

## The Bigger Picture

This 4.76m reading from a 2.5m sensor taught us more than just defensive programming. It highlighted the fundamental tension in blockchain IoT systems:

- **Immutability** vs **Data Quality**
- **Decentralization** vs **Validation**
- **Transparency** vs **User Experience**

Our solution balances these tensions by being honest about the data while protecting the user experience.

## Real-World Impact

This isn't just theoretical. In a real flood monitoring system:
- Emergency responders need accurate data
- False readings could cause panic or complacency
- UI failures during crisis are unacceptable

By handling edge cases gracefully, we ensure the system remains functional even with bad data.

## Code Evolution

From naive trust:
```javascript
// Before: Trusting blockchain data
const waterHeight = data.waterLevel;
drawWater(waterHeight);
```

To defensive programming:
```javascript
// After: Trust but verify
const waterHeight = Math.min(data.waterLevel, sensor.maxRange);
const isInvalid = data.waterLevel > sensor.maxRange;
drawWater(waterHeight, isInvalid);
```

## Moving Forward

This session transformed our approach to blockchain data handling. Every piece of data from the chain now goes through defensive checks. 

The 4.76m flood that couldn't exist? It's still there on the blockchain, immutable and eternal. But now our UI handles it gracefully, turning a potential crash into a learning opportunity for users.

---

*Sometimes the best bugs are the ones that force you to think deeply about your architecture. This impossible water level did exactly that.*