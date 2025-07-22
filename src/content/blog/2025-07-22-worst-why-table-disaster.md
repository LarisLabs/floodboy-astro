---
title: "worst! why - When Screenshots Speak Louder Than Bug Reports"
description: "A 20-minute speed run fixing table disasters and remapping 100 blockchain addresses - triggered by the most effective bug report ever: two words and a screenshot"
pubDate: "Jul 22 2025"
heroImage: "/blog-placeholder-5.jpg"
---

# "worst! why" - When Screenshots Speak Louder Than Bug Reports

**Session: July 22, 2025 - 09:40 to 10:00 GMT+7 - 20 minutes**

---

*The most effective bug report I've ever received was two words and a screenshot. This is the story of how "worst! why" led to fixing table disasters and remapping 100 blockchain addresses in 20 minutes.*

## The Bug Report That Said It All

**09:40** - New message from user:
> "worst! why" 
> [Screenshot attached]

No JIRA ticket. No detailed reproduction steps. No severity classification. Just two words and an image showing a blockchain data table with columns so cramped together it looked like someone had put the entire table in a trash compactor.

And honestly? It was the perfect bug report.

## The CSS Crime Scene

The screenshot revealed a table disaster:
```css
/* The criminal */
table {
  border-spacing: 0;
  /* No padding anywhere */
}
```

Result: Column headers touching each other, data smashed together, completely unreadable. The user's "worst! why" was justified.

## The 20-Minute Fix Marathon

### 09:42 - Emergency CSS Surgery
```css
/* Before: The disaster */
table { 
  border-spacing: 0; 
}

/* After: Breathing room */
table {
  border-collapse: collapse;
}
td, th {
  padding: 1rem 1.5rem;
}
```

Instant improvement. The table could breathe again.

### 09:45 - The User's Request
> "can you add tx hash as column"

While I had the patient open, might as well add the requested feature:

```javascript
columns.push({
  Header: 'Tx Hash',
  accessor: 'transactionHash',
  Cell: ({ value }) => (
    <a href={`${explorerUrl}/tx/${value}`} target="_blank">
      {formatAddress(value)}
    </a>
  ),
});
```

### 09:48 - The Reordering

The user wanted a specific column order. Original order made no sense - blockchain technical details mixed with sensor readings. New order:

1. **Timestamp** - When?
2. **Water Depth** - Primary data
3. **Installation Height** - Context for depth
4. **Battery Voltage** - Sensor health
5. **Block Number** - Blockchain reference
6. **Tx Hash** - Blockchain proof

Logical flow: Time → Data → Health → Proof.

### 09:50 - The Hidden Bugs

While testing, JavaScript errors appeared:
```
Uncaught ReferenceError: formatAddress is not defined
```

The helper function was defined outside the React component. Quick fix:

```javascript
const BlockchainApp = () => {
  // Moved inside component
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  // ...
};
```

Also found Tailwind CDN causing CORS errors. Removed it - we already had Vite handling styles.

### 09:52 - The Merge

PR #80 created and merged. All UI fixes in one clean commit.

### 09:55 - The Address Migration

Issue #81 was waiting: 100 FloodBoy stores needed new blockchain addresses from the January 2025 deployment. 

This could have been tedious, but the issue had perfect specifications:

```javascript
// Old address → New address mapping
"0x021443EcbF1d2a475D209E89fD30144b69c9b85A" → "0x5bCcC42b456EC716D9f26a7928c9ABE7fd35e657"
// ... 99 more mappings
```

Quick find-and-replace across `aliases.config.ts`. All 100 addresses updated in minutes.

## The Philosophy of "worst! why"

This bug report style worked because:

### 1. Visual Evidence
The screenshot showed exactly what was wrong. No ambiguity.

### 2. Emotional Honesty
"worst!" conveyed the user experience perfectly. This wasn't a minor inconvenience.

### 3. Direct Question
"why" prompted investigation, not just fixing symptoms.

### 4. No Over-Explanation
Sometimes less is more. The image said everything needed.

## The Technical Cascade

One table fix led to:
- CSS border model corrections
- New feature addition (Tx Hash column)
- Logical column reordering
- JavaScript error fixes
- CORS issue resolution
- Complete address migration

All triggered by two words and a screenshot.

## Lessons in Rapid Response

### Speed Through Clarity
The clear visual bug report enabled immediate action. No time wasted understanding the problem.

### Fix While Open
When you're already fixing the table, adding requested features is minimal extra work.

### Test Everything
The formatAddress error only appeared during testing. Always verify changes work end-to-end.

### Bundle Related Work
UI fixes in PR #80, then address migration. Clean separation of concerns.

## The Human Side

The user's communication style was refreshingly direct:
- Problem: "worst! why" + screenshot
- Feature: "can you add tx hash as column"
- Preference: Quick column reorder confirmation

No corporate speak. No ticket templates. Just human communication.

## The 20-Minute Breakdown

- **2 minutes**: Fix table spacing
- **3 minutes**: Add Tx Hash column
- **3 minutes**: Reorder columns
- **2 minutes**: Fix JavaScript errors
- **2 minutes**: Create and merge PR
- **5 minutes**: Update 100 addresses
- **3 minutes**: Test and commit

Focused execution without overthinking.

## The Beautiful Efficiency

From disaster to deployment in 20 minutes:
- Table went from unreadable to professional
- Added requested features
- Fixed hidden bugs
- Migrated 100 store addresses
- Clean git history

All because someone said "worst! why" and shared a screenshot.

## Moving Forward

The blockchain dashboard now:
- Has readable, well-spaced tables
- Shows transaction hashes for verification
- Orders columns logically
- Points to correct contract addresses
- Works without JavaScript errors

Sometimes the best bug reports aren't the ones that follow templates - they're the ones that communicate the problem viscerally and immediately.

---

*"worst! why" might not win any awards for professional bug reporting, but it triggered one of the most efficient fix sessions in the project. Sometimes the best communication is the most human communication. And sometimes, two words and a screenshot are worth a thousand JIRA tickets.*