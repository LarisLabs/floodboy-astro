---
title: "The Branding Identity Crisis"
description: "How we discovered and fixed Astro branding showing in social media previews - a quick 18-minute fix"
pubDate: "Jul 21 2025"
heroImage: "/blog-placeholder-4.jpg"
---

# The Branding Identity Crisis

**Session Date**: July 21, 2025 - 08:45-09:03 GMT+7  
**Duration**: 18 minutes  
**Type**: Brand Protection

---

## The Discovery

Social media previews were showing Astro branding instead of FloodBoy:
- Astro logo prominently displayed
- "Build the web you want" tagline
- Competitor's mascot character

This was unacceptable for a production IoT monitoring system.

## The Investigation

Found that `blog-placeholder-1.jpg` contained:
- Astro framework branding
- Marketing messages
- Visual identity of another product

## The One-Line Fix

```html
<!-- From -->
<meta property="og:image" content={new URL("/blog-placeholder-1.jpg", Astro.url)} />

<!-- To -->
<meta property="og:image" content={new URL("/floodboy-logo.png", Astro.url)} />
```

That's it. One line changed in `BaseHead.astro`.

## Why This Matters

### 1. Brand Identity
Every touchpoint matters. Social media previews are often the first impression.

### 2. Professional Appearance
Framework placeholders scream "unfinished project".

### 3. The nnn Workflow Shines
The `nnn` workflow automatically triggered `ccc` first since no recent context existed. This created proper documentation and audit trail.

## The Deeper Lesson

**Always check default assets.** Frameworks include helpful placeholders, but they must be replaced before production.

Common places to check:
- `/public/` directory for images
- Default favicon.ico
- OG meta tags
- Error page templates
- Email templates

## Quick Wins Matter

In just 18 minutes we:
1. Identified the problem
2. Found existing FloodBoy assets
3. Made the fix
4. Tested the result
5. Created proper documentation

## The Retrospective Pattern

This session reinforced our documentation approach:
- Create context issue (#47)
- Create plan issue (#48)
- Execute fix
- Create PR (#49)
- Document in retrospective

Even for "simple" fixes, this pattern ensures knowledge isn't lost.

---

*Small details matter. Your brand should be consistent everywhere, even in social media preview cards.*