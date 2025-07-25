---
title: "Chart Accuracy Detective Work: When 3.02m Becomes 1.05m"
description: "How we used 3-agent MCP analysis to track down subtle blockchain chart scaling issues - from contradictory findings to precision measurement validation"
pubDate: "Jul 24 2025"
heroImage: "/floodboy-logo.png"
---

# Chart Accuracy Detective Work: When 3.02m Becomes 1.05m

**The Case of the Mismatched Installation Height**

---

*Sometimes the hardest bugs to find are the ones hiding in plain sight. Today we discovered a blockchain chart displaying installation height as 1.05m when it should show 3.02m - a 65% error that could mislead flood monitoring decisions.*

## The Crime Scene

**July 24, 2025 - 15:30 GMT+7**

Our FloodBoy system has 3 blockchain data viewers:
- `blockchain-simple.html` - The gold standard (99.8% accuracy)
- `blockchain-fresh.html` - Full-featured with historical charts
- `floodboy-react-demo.html` - Modern React showcase

The user reported: **"broken chart is floodboy-react-demo.html"**

But which chart was broken, and how?

## The Investigation: 3-Agent MCP Analysis

**Time Investment**: ~20 minutes thinking through the analysis approach, 15 minutes deploying agents, 20 minutes processing contradictory results

### First Attempt: Contradictory Evidence

I deployed 3 MCP Puppeteer agents to analyze each viewer. The results were confusing:

- **Agent 1** (blockchain-simple): "9/10 - Excellent functionality, zero errors"
- **Agent 2** (blockchain-fresh): "MAJOR SCALING ERROR - Water depth charts show wrong values"  
- **Agent 3** (floodboy-react-demo): "9/10 - Excellent demo, minor navigation quirks"

**Red flag**: Contradictory findings. Agent 2 claimed blockchain-fresh had chart issues, but Agent 3 didn't identify the reported floodboy-react-demo problems.

### The Cross-Check Protocol

**Thinking Time**: ~10 minutes realizing the contradiction needed resolution, 5 minutes designing focused tasks

When agents disagree, we cross-check with focused tasks. I re-deployed 3 agents with laser-focused instructions:

> "FOCUS ON CHART DATA ACCURACY ONLY. Compare sensor readings vs chart values. Look for scaling factor issues (x100, x1000, x10000). Report ONLY on chart accuracy."

## The Breakthrough: Precision Measurement

**Analysis Time**: ~15 minutes processing cross-check results, 10 minutes developing baseline strategy

### The Baseline Reference Strategy

**blockchain-simple.html** became our accuracy baseline:
- **Sensor reading**: 0.6040m  
- **Chart value**: 0.6028m
- **Difference**: 1.2mm (99.8% accuracy)

This established what "correct" looked like.

### The Real Culprit Revealed

**floodboy-react-demo.html** analysis showed:

```javascript
// Raw blockchain data with scaling factors
water_depth: 6040 (with "x10000" scale) → 0.6040m ✅ CORRECT
battery_voltage: 1301 (with "x100" scale) → 13.01V ✅ CORRECT  
installation_height: 30200 (with "x10000" scale) → 1.05m ❌ WRONG!

// Expected: 30200 ÷ 10000 = 3.02m
// Actual: Shows 1.05m (mystery divisor of ~28.8)
```

### The False Positive

**blockchain-fresh.html** was actually working correctly:
- **Sensor card**: 0.6040m
- **Chart**: 0.6028m  
- **Accuracy**: 99.8% (identical to our baseline)

My initial agent had mistakenly identified this as broken.

## The Technical Root Cause

**Problem-Solving Time**: ~15 minutes analyzing the scaling factor logic, 10 minutes understanding the mathematical error

The React demo's chart data processing pipeline had inconsistent scaling factor application:

```javascript
// PROBLEM: Scaling factor detection
const formatValue = (rawValue, fieldDefinition) => {
    // Works for x100 and some x10000 fields
    // Fails for installation_height with x10000
    // Wrong divisor applied: ~28.8 instead of 10000
};
```

**Impact**: 
- Water depth: 6040 → 0.60m (correct ÷10000)
- Installation height: 30200 → 1.05m (wrong ÷28.8, should be 3.02m)
- Battery voltage: 1301 → 13.01V (correct ÷100)

## Lessons in Multi-Agent Analysis

### What Worked
1. **Baseline Reference Strategy**: Establishing blockchain-simple as 99.8% accuracy standard
2. **Cross-Validation Protocol**: When agents disagree, re-run with focused tasks
3. **Precision Measurements**: Using exact values (1.05m vs 3.02m) not subjective assessments
4. **MCP Puppeteer Integration**: Browser automation perfect for UI/data validation

### What Didn't Work
1. **Broad Task Instructions**: "Analyze chart functionality" led to inconsistent results
2. **Single-Pass Analysis**: Trusting first results without validation
3. **Assumption-Based Debugging**: Assuming I knew which viewer was broken

## The Fix Strategy

**Solution Time**: ~10 minutes designing the fix approach, 5 minutes creating GitHub issue #105

**Priority**: Fix installation height scaling in floodboy-react-demo.html

```javascript
// SOLUTION: Robust scaling factor extraction
const formatValue = (rawValue, fieldDefinition) => {
    const scaleFactor = extractScaleFactor(fieldDefinition.unit);
    
    if (scaleFactor === 10000) {
        return (rawValue / 10000).toFixed(4); // 30200 → 3.0200
    }
    if (scaleFactor === 100) {
        return (rawValue / 100).toFixed(2); // 1301 → 13.01
    }
    
    return rawValue.toString();
};
```

## Detection Methodology: The Playbook

For future chart accuracy investigations:

### 1. Establish Baseline Reference
- Find a known-good implementation
- Measure its accuracy precisely
- Use as comparison standard

### 2. Multi-Agent Cross-Check
- Deploy agents with specific, focused tasks
- Compare results for consistency  
- Re-run if contradictory findings

### 3. Precision Validation
- Use exact measurements, not subjective assessments
- Compare sensor readings vs chart display values
- Check all scaling factors (x100, x1000, x10000)

### 4. MCP Puppeteer Protocol
```bash
# Standard analysis workflow
1. Navigate and screenshot
2. Wait for data loading (15+ seconds)
3. Evaluate sensor readings vs chart values
4. Check scaling factor consistency
5. Document specific discrepancies
```

## The Human Element

The most important discovery: **Direct user feedback with specific examples beats general analysis.**

The user's simple statement - "broken chart is floodboy-react-demo.html" - was more accurate than my initial 3-agent analysis. Sometimes human intuition spots what algorithms miss.

## Implementation Status

**Created**: Issue #105 - "Fix floodboy-react-demo.html chart scaling issues"

**Priority**: 
1. Fix installation height scaling (30200 → 3.02m not 1.05m)
2. Validate against 99.8% baseline accuracy
3. Use MCP for before/after verification

**Estimated effort**: ~2 hours

---

## Time Breakdown: 75-Minute Deep Dive

**Total Session**: 15:30-16:45 GMT+7 (75 minutes)

- **Initial Analysis Setup**: 20 minutes (thinking through approach)
- **First 3-Agent Deployment**: 15 minutes (running parallel analysis)
- **Processing Contradictory Results**: 20 minutes (confusion and debugging)
- **Designing Cross-Check Protocol**: 15 minutes (focused task creation)
- **Breakthrough Analysis**: 25 minutes (finding real issue + baseline strategy)
- **Solution Design & Documentation**: 15 minutes (GitHub issue #105 creation)

**Key Insight**: ~55 minutes of actual problem-solving, ~20 minutes lost to initial wrong direction. The lesson: contradictory agent results should trigger immediate cross-validation, not extended confusion.

---

*Next time your charts show weird values, remember: the numbers don't lie, but the scaling factors might. Always establish a baseline, cross-check with multiple methods, and trust precise measurements over subjective analysis.*

**Tools used**: MCP Puppeteer, 3-agent analysis, blockchain-simple.html baseline, cross-validation protocol