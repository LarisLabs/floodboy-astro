---
title: "The 18-Minute Implementation: When Planning Pays Off"
description: "How thorough planning turned a feature implementation into an 18-minute speed run - the alias redirect system that almost coded itself"
pubDate: "Jul 16 2025"
heroImage: "/blog-placeholder-2.jpg"
---

# The 18-Minute Implementation: When Planning Pays Off

**Session: July 16, 2025 - 08:48 to 09:06 GMT+7 - 18 minutes**

---

*After 107 minutes of planning, the actual implementation took just 18 minutes. This is the story of how preparation makes execution effortless.*

## The Setup

Remember the 107-minute planning session? The one where we went from complex static generation to simple redirects? All that thinking crystallized into issue #40 with complete, ready-to-implement code.

This session would prove the value of that investment.

## The Speed Run Begins

### 08:48 - Check for Context
First instinct: look for context from `ccc`. Found it, but then realized... wait, issue #40 already has everything:
- Complete TypeScript interfaces
- Full implementation code
- Exact file structures

### 08:53 - Start Coding
Created the feature branch and dove in. The first file practically wrote itself:

```typescript
// aliases.config.ts - using the for...of pattern
const storeData: [string, string, string][] = [
  ["prachinburi-tambon-dong-phra-ram", "ระบบเฝ้าระวังระดับน้ำ ต.ดงพระราม", "0x43c42..."],
  // ... 19 more stores
];

for (const [identifier, name, address] of storeData) {
  floodboyStores.push({ identifier, name, address });
}
```

Clean. Elegant. Exactly as planned.

### 08:55 - The Redirect Route
The dynamic route came together in under a minute:

```astro
// /s/[identifier].astro
---
import { floodboyStores } from '@config/aliases.config';

const { identifier } = Astro.params;
const store = floodboyStores.find(s => s.identifier === identifier);

if (!store) {
  return new Response('Store not found', { status: 404 });
}

return Astro.redirect(`/blockchain/${store.address}`, 301);
---
```

No HTML needed - just pure redirect logic.

### 08:57 - The Only Hiccup

```typescript
import Layout from '../../layouts/Layout.astro'; // ❌ Doesn't exist
import BaseLayout from '../../layouts/BaseLayout.astro'; // ✅ Found it!
```

One minute to find the correct layout component. The only "debugging" needed in the entire session.

### 08:58 - Build Success

```bash
pnpm build
# ✓ 12 routes built in 11.73s
```

First try. No TypeScript errors. Everything green.

### 09:00 - Testing with Puppeteer

Fired up tmux, started the dev server, and used Puppeteer to verify:

```javascript
// Test alias redirect
navigate({ url: "http://localhost:3000/s/prachinburi-tambon-dong-phra-ram" });
// Result: Successfully redirected to /blockchain/0x43c42...

// Test direct access still works
navigate({ url: "http://localhost:3000/blockchain/0x43c42..." });
// Result: Page loads normally
```

All 20 stores tested. All working perfectly.

### 09:05 - PR Created

Clean commit, comprehensive PR description, linked to issue #40. Done.

## The Power of Preparation

This 18-minute implementation demonstrates several key principles:

### 1. Planning Is Not Procrastination
Those 107 minutes of planning weren't wasted. They were invested. The ROI? A flawless 18-minute implementation.

### 2. Code in Issues
Having complete code examples in issue #40 meant zero context switching. Copy, paste, verify, commit.

### 3. Simple Solutions Scale
20 stores, 3 files, ~120 lines of code. The redirect approach scaled perfectly without complexity.

### 4. Type Safety Pays Off
TypeScript interfaces defined during planning caught potential errors before they happened.

## The Human Element

The user's approach was masterful:
1. Let the planning session run long
2. Capture everything in the issue
3. Execute swiftly when ready

No rush during planning. No hesitation during execution.

## Lessons for Future Development

### Write Implementation Details in Issues
```typescript
// Don't just describe the feature
"Add alias system for SEO-friendly URLs"

// Include the actual code
"Implementation:
```typescript
export interface FloodBoyStore { ... }
```"
```

### Test Incrementally But Quickly
- Build after each major file
- Use automated tools (Puppeteer) for repetitive tests
- Verify edge cases (404s) work correctly

### Trust Your Planning
When you've thought through a problem thoroughly, trust the solution. Second-guessing during implementation slows you down.

## The Numbers

- **Planning**: 107 minutes
- **Implementation**: 18 minutes
- **Ratio**: 6:1 planning to coding
- **Bugs**: 0 (after the Layout import fix)
- **Refactoring needed**: None

## The Beautiful Irony

We spent more time planning how to avoid complexity than it took to implement the simple solution. And that's exactly how it should be.

The fastest code to write is code that's already been written in your mind (or in an issue).

## Moving Forward

With the alias system in place:
- SEO-friendly URLs: ✅
- Clean implementation: ✅
- Type safety: ✅
- Easy to extend: ✅

The next developer who needs to add store #21 will spend maybe 30 seconds. That's the power of good architecture.

---

*Sometimes the best programming happens before you touch the keyboard. This 18-minute sprint was really a 125-minute marathon - we just did most of the running in our heads first.*