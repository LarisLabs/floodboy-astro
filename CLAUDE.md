# Project Overview
This is an Astro-based IoT flood monitoring system called Floodboy.

## MCP Puppeteer Usage
When debugging blockchain connections or web3 issues:
1. Use `mcp__puppeteer__puppeteer_navigate` to go to the page
2. Use `mcp__puppeteer__puppeteer_screenshot` to capture the current state
3. Use `mcp__puppeteer__puppeteer_evaluate` to check console errors with:
   ```javascript
   // Get console errors
   window.consoleErrors || 'No errors logged'
   ```
4. For blockchain debugging, check:
   - Network tab for RPC calls
   - Console for Web3/viem errors
   - MetaMask connection status

## Key Pages
- `/` - Dashboard (currently blank)
- `/sensors` - Sensor monitoring (placeholder)
- `/analytics` - Analytics (placeholder)
- `/blockchain` - Smart contract dashboard
- `/demo` - Interactive sensor UI explorer
- `/blog` - Blog section
- `/about` - About page

## Blockchain Configuration
The blockchain page connects to:
- JIBCHAIN L1 (Chain ID: 8899)
- SiChang (Chain ID: 700011)
- Anvil local (Chain ID: 31337)

Default sensor store: `0xc887E6FEdF2879ca0731F9b5d3D077F43f53D6e8`