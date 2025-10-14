# CollabCanvas Memory Bank

**Last Updated:** October 14, 2025  
**Status:** ✅ Initialized and Complete

## Purpose
This Memory Bank contains comprehensive documentation that persists across all development sessions. After every memory reset, this is the ONLY source of truth for understanding the project.

## File Structure

### Required Core Files (Read These First)
1. **projectbrief.md** - Foundation document
   - What the project is and why it exists
   - Core mission and goals
   - Success criteria and constraints
   - Read this FIRST to understand the project

2. **productContext.md** - User experience and product vision
   - Why this exists (problem being solved)
   - How it should work (user flows)
   - Target users and UX goals
   - Read this to understand what users experience

3. **systemPatterns.md** - Technical architecture and patterns
   - Key architectural decisions (CRITICAL: individual documents pattern)
   - Design patterns in use
   - Component relationships and data flow
   - Read this to understand how the system works

4. **techContext.md** - Technology stack and setup
   - All technologies and versions
   - Project structure and file organization
   - Development setup and commands
   - Technical constraints and quotas
   - Read this to understand the technical foundation

5. **activeContext.md** - Current work and recent changes
   - What we're working on RIGHT NOW
   - Recent PRs and changes
   - Active decisions and open questions
   - Next steps and current focus
   - **Read this FIRST in every session** to know where we are

6. **progress.md** - What works and what doesn't
   - Completed features (what works)
   - Remaining features (what's left to build)
   - Known issues and technical debt
   - Performance metrics and status
   - Read this to understand project maturity

## How to Use

### Starting a New Session
1. **Read activeContext.md first** - Know where we are
2. **Read progress.md** - Know what works and what doesn't
3. **Skim projectbrief.md** - Refresh on core goals
4. **Reference others as needed** - Deep dive when implementing

### Before Making Changes
1. Check **systemPatterns.md** - Follow established patterns
2. Check **techContext.md** - Use correct tech stack
3. Update **activeContext.md** - Document what you're doing
4. Update **progress.md** when done - Track completion

### When Stuck
1. Search Memory Bank for similar patterns
2. Check **.cursor/rules/** for code patterns
3. Review architecture diagrams in main project docs
4. Look at existing implementations in codebase

## Key Insights (Start Here If Time Constrained)

### Critical Architecture Decision
**Individual Firestore documents per shape, NOT arrays!**
- This is THE most important architectural decision
- Old approach (arrays) caused 40-60% conflict rate
- New approach (individual docs) reduced to <5% conflicts
- Detailed in `systemPatterns.md`

### Current Phase
- **MVP Complete** ✅ - All 8 hard gates passed
- **Phase 2 Starting** - AI agent integration next
- **Recent Change** - PR #10 refactored to individual documents

### Tech Stack
- React 19 + TypeScript + Konva.js + Firebase
- Firestore for shapes (persistent)
- Realtime DB for cursors/presence (ephemeral)
- Vite for build, Vitest for testing

### Performance Targets (Never Regress)
- 60 FPS always
- <100ms shape sync
- <50ms cursor sync
- 5+ concurrent users

## Related Documentation

### In Memory Bank
- All `.md` files in this directory
- Read in order: activeContext → progress → others as needed

### In Project Root
- `PRD.md` - Original product requirements
- `architecture.md` - System architecture diagrams
- `PR*.md` - Detailed PR summaries
- `DEPLOYMENT_GUIDE.md` - Deployment steps
- `TESTING_CHECKLIST.md` - Testing scenarios

### In .cursor/rules/
- `base.mdc` - Core development patterns
- `firebase.mdc` - Firebase-specific rules

## Update Frequency

### Update on Every Session
- **activeContext.md** - Current focus, recent changes, next steps

### Update When Features Complete
- **progress.md** - Add completed features, update status
- **systemPatterns.md** - Document new patterns if discovered

### Update Rarely
- **projectbrief.md** - Only if core mission changes
- **productContext.md** - Only if user experience vision changes
- **techContext.md** - Only if tech stack changes

## Memory Bank Health

### Indicators of Good Health
- ✅ activeContext.md updated in last session
- ✅ progress.md reflects current state accurately
- ✅ All core files present and readable
- ✅ No outdated information contradicting reality

### Indicators of Problems
- ⚠️ activeContext.md not updated in weeks
- ⚠️ progress.md shows features as "incomplete" that are done
- ⚠️ Files contradict each other
- ⚠️ Missing core files

## Quick Reference

### File Sizes (Approximate)
- projectbrief.md: 2KB - Quick read
- productContext.md: 4KB - Medium read
- systemPatterns.md: 8KB - Long read, skim first
- techContext.md: 7KB - Reference as needed
- activeContext.md: 5KB - **Read this first every time**
- progress.md: 8KB - Reference for status

### Total Memory Bank Size
~35KB of documentation - Comprehensive but scannable

## Maintenance

### When to Update
- **Start of session:** Read activeContext.md
- **During work:** Update activeContext.md with current focus
- **End of session:** Update activeContext.md and progress.md
- **After major change:** Update relevant systemPatterns.md

### When to Prune
- Remove outdated "Current Focus" from activeContext.md monthly
- Archive completed TODOs from progress.md quarterly
- Keep at least 3 months of activeContext history

## Success Metrics

### Memory Bank is Successful If:
- ✅ Can start productive work within 5 minutes of reading
- ✅ Never confused about project purpose or current state
- ✅ Can find any pattern or decision quickly
- ✅ No contradictions between files

### Memory Bank Needs Work If:
- ⚠️ Spend >10 minutes figuring out current state
- ⚠️ Make architectural decisions that contradict patterns
- ⚠️ Can't find information about key decisions
- ⚠️ Files are outdated or conflicting

---

**Remember:** This Memory Bank is your link to all previous work. Keep it updated, accurate, and complete. Your future self (after memory reset) depends entirely on the quality of this documentation.

