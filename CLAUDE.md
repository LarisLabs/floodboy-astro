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

# CLAUDE.md - Project Guidelines and Workflows

## Quick Reference - Short Codes
- `ccc` - Create context issue, export conversation, and compact
- `nnn` - Smart planning: Auto-runs `ccc` if no recent context → Create task issue → Implement
- `lll` - List comprehensive project status
- `rrr` - Create detailed session retrospective with export

## 🔴 Critical Safety Rules

### Command Usage
- **NEVER use `-f` or `--force` flags with any commands**
- Always use safe, non-destructive command options
- If a command requires confirmation, handle it appropriately without forcing

### Git Operations
- Never use `git push --force` or `git push -f`
- Never use `git checkout -f`
- Never use `git clean -f`
- Always use safe git operations that preserve history

### File Operations
- Never use `rm -rf` - use `rm -i` for interactive confirmation
- Always confirm before deleting files
- Use safe file operations that can be reversed

### Package Manager Operations
- Never use `pnpm install --force` or `npm install --force`
- Never use `pnpm update` without specifying packages
- Always review lockfile changes before committing

### Container Operations
- Never use `docker system prune -a` without confirmation
- Never delete volumes without backing up data first
- Always check running containers before removal

### General Safety Guidelines
- Prioritize safety and reversibility in all operations
- Ask for confirmation when performing potentially destructive actions
- Explain the implications of commands before executing them
- Use verbose options to show what commands are doing

## Development Environment

### Tmux Configuration

#### 4-Pane Layout
```
┌─────────────────┬─────────────────┐
│ Pane 0: Dev     │ Pane 1: Build   │
│ pnpm dev        │ pnpm build/test │
├─────────────────┼─────────────────┤
│ Pane 2: Git     │ Pane 3: General │
│ watch git status│ general cmds    │
└─────────────────┴─────────────────┘
```

#### Pane Purposes
- **Pane 0 (0.0)**: Dev server - Always running `pnpm dev`
- **Pane 1 (0.1)**: Build/Test operations - For `pnpm build`, `pnpm test`, `forge test`
- **Pane 2 (0.2)**: Git monitoring - Shows file changes in real-time
- **Pane 3 (0.3)**: General purpose - Any other commands, deployments, logs

#### Setup Commands
```bash
# Ensure log directory exists
mkdir -p /home/floodboy/web3-iot-factory/logs/tmux

# Kill any existing sessions
tmux has-session -t dev 2>/dev/null && tmux kill-session -t dev

# Create 4-pane layout
tmux new-session -d -s dev -n main
tmux split-window -t dev:0 -h -p 50    # Split horizontally
tmux split-window -t dev:0.0 -v -p 50  # Split left pane vertically
tmux split-window -t dev:0.1 -v -p 50  # Split right pane vertically

# Attach to session
tmux attach-session -t dev
```

#### Manual Testing Checklist
Before pushing any changes:
- [ ] Stop dev server in pane 0.0: `Ctrl+C`
- [ ] Run build in pane 0.1: `pnpm build`
- [ ] Verify build succeeds with no TypeScript errors
- [ ] Restart dev server in pane 0.0: `pnpm dev`
- [ ] Test all pages:
  - [ ] Admin dashboard (/)
  - [ ] Stores page (/stores)
  - [ ] Individual store view (/store/[address])
  - [ ] Test store page (/test-store/[address])
- [ ] Check browser console for errors (should be zero)
- [ ] Test mobile responsiveness
- [ ] Verify all interactive features work

### GitHub Workflow

#### Creating Issues
When starting a new feature or fixing a bug:

```bash
# 1. Update main branch
git checkout main && git pull

# 2. Create detailed issue
gh issue create --title "feat: Descriptive title" --body "$(cat <<'EOF'
## Overview
Brief description of the feature/bug

## Current State
What exists now

## Proposed Solution
What should be implemented

## Technical Details
- Components affected
- Implementation approach

## Acceptance Criteria
- [ ] Specific testable criteria
- [ ] Performance requirements
- [ ] UI/UX requirements
EOF
)"
```

#### Standard Development Flow
```bash
# 1. Create branch from issue
git checkout -b feat/issue-number-description

# 2. Make changes
# ... implement feature ...

# 3. Test thoroughly
# Use 'ttt' short code for full test suite

# 4. Commit with descriptive message
git add -A
git commit -m "feat: Brief description

- What: Specific changes made
- Why: Motivation for changes
- Impact: What this affects

Closes #issue-number"

# 5. Push and create PR
git push -u origin branch-name
gh pr create --title "Same as commit" --body "Fixes #issue_number"

# 6. DO NOT merge - provide PR link to user
```

### Build Workflow

Safe build process using tmux panes:
```bash
# 1. Stop dev server in pane 0.0
tmux send-keys -t dev:0.0 C-c

# 2. Run build in pane 0.1
tmux send-keys -t dev:0.1 "pnpm build" Enter

# 3. Check build output (wait for completion)
sleep 5 && cat /home/floodboy/web3-iot-factory/logs/tmux/dev-pane-1.log | tail -30

# 4. If successful, restart dev server in pane 0.0
tmux send-keys -t dev:0.0 "pnpm dev" Enter

# 5. Visual verification with MCP Puppeteer (IMPORTANT!)
# Wait for dev server to start
sleep 5
# Navigate and screenshot pages to verify changes
mcp__puppeteer__puppeteer_navigate --url "http://localhost:3000"
mcp__puppeteer__puppeteer_screenshot --name "homepage"
# Test other relevant pages based on changes
```

**IMPORTANT**: Always use this full workflow when building, especially:
- Stop dev server BEFORE building (step 1)
- Restart dev server AFTER building (step 4)
- Use MCP Puppeteer to visually verify changes (step 5)

## Core Short Codes

### `ccc` - Create Context & Compact
When you see `ccc`:

**Purpose**: Save the current session state and context to forward to another task. The context issue created by `ccc` can be used as input for `nnn`.

**Step 1: Gather Information**
```bash
# Get changed files
git status --porcelain

# Get recent commits
git log --oneline -5
```

**Step 2: Export Conversation**
```
/export context_YYYY-MM-DD_HH-MM_issue-XXX.md
```
- This creates a markdown file of the entire conversation
- The AI will show the exact filename to use (e.g., `context_2025-07-10_07-33_issue-174.md`)
- Save the downloaded file to: `retrospectives/exports/`
- The filename format helps with organization and searchability

**Step 3: Create GitHub Context Issue**
```bash
gh issue create --title "context: Brief description of current work/state" --body "$(cat <<'EOF'
## Session Context

**Date**: YYYY-MM-DD
**Duration**: ~X minutes
**Export**: retrospectives/exports/context_YYYY-MM-DD_HH-MM_issue-XXX.md

## Current Work Summary
[2-3 sentences about what was being worked on]

## Current State
### What's Working
- Feature X is implemented
- Component Y is functional

### What's In Progress
- Task A is 50% complete
- Research on B is ongoing

### What's Blocked
- Issue with Z needs resolution

## Technical Context
### Changed Files
```
[paste git status --porcelain output]
```

### Key Code Changes
- File X: Added Y functionality
- Module Z: Refactored for performance

### Architecture Decisions
- Decision 1: Rationale
- Decision 2: Rationale

## Important Discoveries
- Finding 1
- Learning 2
- Pattern 3

## Next Steps
- [ ] Complete task A
- [ ] Research solution for Z
- [ ] Implement feature B

## Related Issues
- #XXX - Previous context
- #XXX - Related feature
EOF
)"
```

**Step 4: Compact Conversation**
```
/compact
```

### `nnn` - Next Task Planning (Analysis & Planning Only)
When you see `nnn`:

**Purpose**: Create a comprehensive implementation plan based on gathered context. NO CODING - only research, analysis, and planning.

**IMPORTANT**: After `nnn` creates a plan, WAIT for explicit user instruction to implement. Do NOT start coding automatically.

**Step 1: Check for Recent Context**
```bash
# Check if there's a recent context issue (within last 24 hours)
gh issue list --label "context" --limit 5

# Decision logic:
# - If NO recent context issue exists → Perform `ccc` first to capture current state
# - If recent context issue EXISTS → Use that context and proceed to Step 2
```

**Smart Workflow**:
- If no recent `ccc` context: `nnn` automatically does `ccc` → then creates task issue
- If recent `ccc` exists: `nnn` uses existing context → creates task issue directly

**Step 2: Gather All Context**
```bash
# List recent issues to understand context
gh issue list --limit 20

# If specified: nnn #123 - analyze that specific issue/topic
# If just nnn - analyze the most recent context or current work
```

**Step 2: Deep Analysis**
- Read relevant context issues (especially from `ccc`)
- Analyze the codebase using multiple agents if needed
- Research existing patterns and implementations
- Identify all affected components
- Consider edge cases and potential issues

**Step 3: Create Comprehensive Plan Issue**
Create a detailed implementation plan with all necessary context:
```bash
gh issue create --title "plan: Clear description of what needs to be done" --body "$(cat <<'EOF'
## Implementation Plan

**Context From**: #[context-issue-numbers]
**Type**: [feature/fix/refactor/optimization]

## Problem Statement
[Clear description of what needs to be solved/implemented]

## Research Summary
### Current Implementation Analysis
- How it currently works
- What files/components are involved
- Existing patterns in the codebase

### Technical Constraints
- Performance considerations
- Security implications
- Compatibility requirements

### Similar Implementations
- Examples from codebase
- Best practices discovered

## Proposed Solution

### Architecture Overview
[High-level design and approach]

### Implementation Plan
1. **Phase 1: [Name]**
   - Step 1.1: [Specific action]
   - Step 1.2: [Specific action]
   - Files to modify: [list]

2. **Phase 2: [Name]**
   - Step 2.1: [Specific action]
   - Step 2.2: [Specific action]
   - New files needed: [list]

3. **Phase 3: Testing**
   - Unit tests needed
   - Integration tests
   - Manual testing checklist

### Code Structure
```typescript
// Example interfaces/types needed
interface ProposedStructure {
  // ...
}

// Example component structure
ComponentName/
├── index.tsx
├── hooks.ts
└── types.ts
```

### Technical Details
- **Dependencies**: New packages needed
- **API Changes**: Endpoints affected
- **State Management**: How data flows
- **Database**: Schema changes if any

## Risk Analysis
- **Risk 1**: [Description] → Mitigation: [Strategy]
- **Risk 2**: [Description] → Mitigation: [Strategy]

## Alternative Approaches Considered
1. **Approach A**: [Description] - Rejected because [reason]
2. **Approach B**: [Description] - Rejected because [reason]

## Success Criteria
- [ ] Feature implemented according to spec
- [ ] All tests passing
- [ ] No performance regression
- [ ] Documentation updated
- [ ] Code reviewed and approved

## Estimated Effort
- Research: Already completed
- Implementation: ~X hours
- Testing: ~X hours
- Total: ~X hours

## Questions/Blockers
- [ ] Question 1 that needs clarification
- [ ] Potential blocker to resolve

## Next Steps
1. Review and approve this plan
2. Create feature branch
3. Begin implementation following the plan

## References
- Related PR: #XXX
- Similar implementation: [file:line]
- Documentation: [link]
EOF
)"
```

**Step 4: Provide Summary**
After creating the issue, provide a brief summary of:
- What was analyzed
- Key findings
- Issue number created
- Ready for implementation

**Example Flow:**
```
User: ccc
AI: Creates issue #156 (Context: Multicall research completed)

User: nnn
AI: 1. Reads issue #156 and analyzes codebase
    2. Creates issue #157 "plan: Implement multicall for enhanced store data"
    3. Provides summary: "Created comprehensive plan in issue #157. Ready for implementation."
```

**Key Differences**:
- `ccc`: Saves current state/context for future reference
- `nnn`: Creates actionable implementation plan from context (NO CODING)

### `lll` - List Project Status
When you see `lll`, execute in parallel:
```bash
gh issue list --limit 20
gh issue list --state closed --limit 10
gh pr list --state all --limit 10
gh issue list --label "context"
gh issue list --label "feat"
git status
```

Then provide a visual summary:
```
📊 Project Status Summary
========================
🔧 Open Issues: X total
  - 🏷️ feat: X
  - 🐛 bug: X
  - 📝 context: X

🔄 Recent PRs:
  - ✅ Merged: X
  - 📭 Open: X
  - ❌ Closed: X

🎯 Current Focus: [from latest issues]
```

### `rrr` - Retrospective
When you see `rrr`:

**Step 1: Export Full Conversation**
```
/export session_YYYY-MM-DD_HH-MM.md
```
- This creates a markdown file of the entire conversation
- The AI will show the exact filename to use (e.g., `session_2025-07-10_07-33.md`)
- Save the downloaded file to: `retrospectives/exports/`

**Step 2: Gather Session Data**
```bash
# Get modified files
git diff --name-only main...HEAD

# Get commit history
git log --oneline main...HEAD

# Get current time for end time (GMT+7)
# UTC time
date -u +"%H:%M UTC"
# Local time (GMT+7)
TZ='Asia/Bangkok' date +"%H:%M GMT+7"
# Session date
date +"%Y-%m-%d"
```

**Step 3: Create Retrospective Document**
```bash
# Get session date and times
SESSION_DATE=$(date +"%Y-%m-%d")
END_TIME_UTC=$(date -u +"%H:%M")
END_TIME_LOCAL=$(TZ='Asia/Bangkok' date +"%H:%M")

# Create directory structure
mkdir -p retrospectives/$(date +%Y/%m)

# Create retrospective file with auto-filled date/time
cat > retrospectives/$(date +%Y/%m)/${SESSION_DATE}_${END_TIME_UTC//:/-}_retrospective.md << EOF
# Session Retrospective

**Session Date**: ${SESSION_DATE}
**Start Time**: [FILL_START_TIME] GMT+7 ([FILL_START_TIME] UTC)
**End Time**: ${END_TIME_LOCAL} GMT+7 (${END_TIME_UTC} UTC)
**Duration**: ~X minutes
**Primary Focus**: Brief description
**Session Type**: [Feature Development | Bug Fix | Research | Refactoring]
**Current Issue**: #XXX
**Last PR**: #XXX
**Export**: retrospectives/exports/session_${SESSION_DATE}_${END_TIME_UTC//:/-}.md

## Session Summary
[2-3 sentence overview of what was accomplished]

## Timeline
- HH:MM - Started session, reviewed issue #XXX
- HH:MM - [Event]
- HH:MM - [Event]
- HH:MM - Completed implementation

## Technical Details

### Files Modified
```
[paste git diff --name-only output]
```

### Key Code Changes
- Component X: Added Y functionality
- Module Z: Refactored for better performance

### Architecture Decisions
- Decision 1: Rationale
- Decision 2: Rationale

## AI Diary
[Detailed narrative of the development process, challenges faced, solutions explored]

## What Went Well
- Success 1
- Success 2
- Success 3

## What Could Improve
- Area 1
- Area 2

## Blockers & Resolutions
- **Blocker**: Description
  **Resolution**: How it was solved

## Honest Feedback
[Frank assessment of the session, tools, process]

## Lessons Learned
- **Pattern**: [Description] - [Why it matters]
- **Mistake**: [What happened] - [How to avoid]
- **Discovery**: [What was learned] - [How to apply]

## Next Steps
- [ ] Immediate task 1
- [ ] Follow-up task 2
- [ ] Future consideration

## Related Resources
- Issue: #XXX
- PR: #XXX
- Export: [session_YYYY-MM-DD_HH-MM.md](../exports/session_YYYY-MM-DD_HH-MM.md)
EOF
```

**Step 4: Update CLAUDE.md**
- Copy any new lessons learned to the Lessons Learned section
- Add any new patterns or anti-patterns discovered
- Update user preferences if any were observed

**Step 5: Link to GitHub**
```bash
# Add retrospective to git
git add retrospectives/
git commit -m "docs: Add session retrospective $(date +%Y-%m-%d)"

# Comment on relevant issue/PR with actual path
RETRO_PATH="retrospectives/$(date +%Y/%m)/$(date +%Y-%m-%d_%H-%M)_retrospective.md"
gh issue comment XXX --body "Session retrospective created: ${RETRO_PATH}"
```

**Time Zone Note**: 
- **PRIMARY TIME ZONE: GMT+7 (Bangkok time)** - Always show GMT+7 time first
- UTC time included for reference only (shown in parentheses)
- File names may use UTC for technical consistency
- In all displays and retrospectives, prioritize GMT+7 for user clarity

## Network Configuration

### Supported Networks
1. **Anvil (Local)** - Chain ID: 31337
   - RPC: `http://localhost:8545`
   - Development and testing

2. **JIBCHAIN L1** - Chain ID: 8899
   - RPC: `https://rpc-l1.jbc.xpool.pw`
   - Explorer: `https://exp.jibchain.net`

3. **SiChang** - Chain ID: 700011
   - RPC: `https://sichang-rpc.thaichain.org/`
   - Explorer: `https://sichang.thaichain.org`

### Contract Interaction

#### Common Commands
```bash
# Check contract state
cast call <address> "owner()(address)" --rpc-url <url>
cast call <address> "getAllFields()((string,string,string)[])" --rpc-url <url>

# Authorize sensor
cast send <address> "authorizeSensor(address)" <sensor> \
  --private-key $PRIVATE_KEY --rpc-url <url>

# Store data
cast send <address> "store(int256[])" "[100,200,300]" \
  --private-key $PRIVATE_KEY --rpc-url <url>
```

## Git Commit Format
```
[type]: [brief description]

- What: [specific changes]
- Why: [motivation]
- Impact: [affected areas]

Closes #[issue-number]
```

## Troubleshooting

### Common Issues

#### Build Failures
```bash
# TypeScript errors
pnpm build 2>&1 | grep -A 5 "error TS"

# Missing dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Cache issues
pnpm store prune
```

#### Tmux Issues
```bash
# Session exists error
tmux kill-session -t dev

# Panes not responding
tmux respawn-pane -t dev:0.X

# Logger not working
ps aux | grep tmux-logger
# Restart if needed
```

#### Port Conflicts
```bash
# Find process on port
lsof -i :3000
# or
netstat -tulpn | grep 3000

# Kill process
kill -9 <PID>
```

#### Git Issues
```bash
# Merge conflicts
git status
# Resolve manually, then
git add <files>
git commit

# Detached HEAD
git checkout main
```

### Debug Commands

#### Check Logs
```bash
# All tmux panes
ls -la /logs/tmux/dev-pane-*.log

# Recent errors
grep -n "error\|Error" /logs/tmux/*.log | tail -20

# Specific pane
tail -f /logs/tmux/dev-pane-0.log
```

#### Contract Debugging
```bash
# Get revert reason
cast call <address> "failingFunction()" --rpc-url <url> -vvv

# Trace transaction
cast run <txhash> --rpc-url <url>
```