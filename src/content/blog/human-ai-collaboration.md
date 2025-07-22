---
title: "Human-AI Collaboration: Real Sessions Building FloodBoy"
description: "Authentic development stories from real coding sessions - how we solved table spacing disasters, optimized blockchain queries, and evolved from complexity to simplicity"
pubDate: "Jan 22 2025"
heroImage: "/blog-placeholder-1.jpg"
---

# Human-AI Collaboration: Real Sessions Building FloodBoy

**Stories from the Trenches - Authentic Development Moments**

---

*This is not a polished marketing story. These are real development sessions with actual problems, failures, breakthroughs, and lessons learned while building FloodBoy's IoT flood monitoring system.*

## The "worst! why" Moment
**July 22, 2025 - 09:40 GMT+7 - 20 minute session**

Sometimes the most direct feedback creates the best breakthroughs. The human developer sent a screenshot with just two words: **"worst! why"**

The blockchain data table was completely unreadable - columns crammed together with zero spacing. What looked like a simple CSS issue revealed deeper problems:

```css
/* The Problem */
table { border-spacing: 0; } /* Broken */

/* The Solution */  
table { 
  border-collapse: collapse;
  padding: 1rem 1.5rem; /* Proper spacing */
}
```

But that was just the beginning. Fixing the table uncovered:
- `formatAddress` undefined errors breaking functionality
- CORS issues from external CDN references
- Column ordering that made no sense

**The Fix**: 20 minutes of systematic problem-solving:
1. Fix immediate CSS spacing disaster
2. Add transaction hash column (user request)
3. Reorder columns logically: Timestamp → Depth → Height → Voltage → Block → Tx Hash
4. Fix JavaScript errors preventing page load
5. Remove problematic CDN dependencies

**Lessons Learned**: 
- Direct user feedback with visuals ("worst! why" + screenshot) is incredibly valuable
- CSS border models (`border-collapse: separate` vs `collapse`) fundamentally affect padding behavior
- Always define utility functions within scope to avoid undefined errors

## The Overcomplicated Alias System Journey
**July 16, 2025 - 07:00-08:47 GMT+7 - 107 minute session**

**The Vision**: Create SEO-friendly URLs like `/blockchain/FloodBoy001` that redirect to actual contract addresses.

**First Attempt**: Massively overcomplicated static data generation system
- Generate pages at build time
- Embed sensor data directly in HTML
- Complex file manipulation and API calls

**The Pivot**: Human clarified the actual requirement:
> "I want static URLs (for SEO) but dynamic data loading (to avoid stale data)"

**The Simple Solution**:
```typescript
// aliases.config.ts - Clean and maintainable
const ALIASES = {
  'FloodBoy001': '0x1234...abcd',
  'FloodBoy002': '0x5678...efgh',
  // ...
};

// Simple redirect logic
for (const [alias, address] of Object.entries(ALIASES)) {
  if (params.address === alias) {
    return redirect(`/blockchain/${address}`);
  }
}
```

**Side Quest**: Discovered GitHub CLI was ancient (v2.4.0), upgraded to v2.75.1, learned about `gh project link` command, set up proper project tracking.

**Key Moment**: The evolution from a 200-line complex solution to a 20-line elegant one. Sometimes the best code is the code you don't write.

## The Great Table Spacing Disaster Recovery
**Real-time problem solving in action**

The human's reaction to broken table layout was immediate and visceral. No technical jargon, just pure user frustration. This led to one of our most efficient debugging sessions:

### Before (Broken):
```
TimestampWaterDepthInstallationHeightBattery
10:30AM1.2m3.0m12.5V
10:31AM1.1m3.0m12.4V
```

### After (Fixed):
```
| Timestamp | Water Depth | Installation Height | Battery Voltage |
|-----------|-------------|--------------------| ----------------|
| 10:30 AM  | 1.2m        | 3.0m               | 12.5V           |
| 10:31 AM  | 1.1m        | 3.0m               | 12.4V           |
```

**The Systematic Approach That Worked**:
1. Address UI disasters first (readability)
2. Then enhance functionality (new columns)
3. Finally handle data concerns (address mapping)
4. Always test, commit, document

## The Branding Identity Crisis
**July 21, 2025 - 08:45-09:03 GMT+7 - 18 minute session**

**The Problem**: Social media previews showed Astro branding instead of FloodBoy
**The Discovery**: `blog-placeholder-1.jpg` contained competitor logos and "Build the web you want" text
**The Solution**: One line change in `BaseHead.astro`

```html
<!-- From -->
<meta property="og:image" content={new URL("/blog-placeholder-1.jpg", Astro.url)} />

<!-- To -->
<meta property="og:image" content={new URL("/floodboy-logo.png", Astro.url)} />
```

**Why This Matters**: The `nnn` workflow automatically triggered `ccc` first since no recent context existed. This documented the issue properly and created a clean audit trail.

**Lesson**: Always check default assets - frameworks often include branded placeholders that need replacement.

## Real Technical Challenges We Solved

### Blockchain Performance Optimization
- **Challenge**: Loading 100 IoT stores took 30+ seconds
- **Solution**: Implemented multicall patterns reducing load time to 3 seconds
- **Impact**: Made the app actually usable in production

### Three-Tier Sensor Classification
- **Challenge**: Binary "active/inactive" wasn't enough
- **Solution**: Created Active/Offline/Being Installed status with 1-hour threshold
- **Result**: Much better operational visibility

### UI Enhancement Evolution
- **Challenge**: "The checkboxes are hard to use"
- **Solution**: Button-style toggles with green theming and visual feedback
- **Process**: Transform frustrating UX into intuitive interactions

## The Development Rhythm That Works

### Retrospective-Driven Development
Every session ends with honest reflection:
- What went well? (celebrate wins)
- What could improve? (learn from friction)  
- What was blocked? (prevent future issues)
- What was learned? (capture insights)

### The nnn Workflow Pattern
1. `nnn` - Smart planning that auto-runs `ccc` if no recent context
2. Create detailed implementation plan with technical specs
3. Execute in small, testable chunks
4. Document everything for continuity

### User-Responsive Iteration
- Direct feedback drives immediate fixes
- Screenshots reveal UX problems better than descriptions
- Quick wins build momentum for larger features

## Authentic Lessons from the Code

### CSS Border Models Matter
`border-collapse: separate` vs `collapse` completely changes how padding works. This seems obvious in retrospect, but caused real user pain.

### Helper Functions Need Scope
`formatAddress` undefined broke everything. Always define utility functions where they're used, or ensure proper imports.

### Simple Solutions Win
The alias system went from 200+ lines of complexity to 20 lines of elegance when requirements were clarified.

### User Feedback Drives Quality
"worst! why" led to better table design than any technical specification would have.

## The Technology Stack (What Actually Works)

### Frontend Power Tools
- **Astro + React**: Static generation with dynamic islands
- **TypeScript**: Catches errors before they reach users
- **Tailwind CSS**: Rapid styling that actually scales

### Blockchain Integration
- **Viem**: Modern Web3 with excellent TypeScript support
- **Multicall3**: Essential for performance at scale
- **JIBCHAIN L1**: Production blockchain with real IoT data

### Development Workflow
- **GitHub Projects**: Linked to repository for proper tracking
- **Retrospective Documentation**: Capture lessons while they're fresh
- **Visual Testing**: Screenshots reveal UX issues instantly

## What This Collaboration Model Achieves

### Speed Without Sacrificing Quality
- 18-minute sessions can solve major branding issues
- 20-minute focused work fixes critical UX problems
- 107-minute planning prevents weeks of wrong implementation

### Learning That Compounds
- Each session builds on previous insights
- Documentation creates continuity across time gaps
- Honest retrospectives prevent repeating mistakes

### User-Centered Results
- Direct feedback creates immediate improvements
- Technical solutions serve real user needs
- Simple approaches often outperform complex ones

---

**This is how real software gets built - through authentic collaboration, honest feedback, systematic problem-solving, and learning from every single session.**

*These stories come from actual development retrospectives dated July 2025. No marketing polish, just real development moments that created FloodBoy's IoT monitoring platform.*

**Built through authentic Human-AI partnership • Powered by JIBCHAIN L1 • Documented for posterity**