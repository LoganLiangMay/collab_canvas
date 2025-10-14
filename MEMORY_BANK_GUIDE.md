# Memory Bank System - Quick Start Guide

## What is the Memory Bank?

The Memory Bank is a comprehensive documentation system located in `.cursor/memory-bank/` that serves as the single source of truth for understanding this project. Since AI assistants have their memory reset between sessions, the Memory Bank ensures continuity and prevents knowledge loss.

## Quick Start (5 Minutes)

### First Time Reading
1. Open `.cursor/memory-bank/activeContext.md` - **Current state of project**
2. Skim `.cursor/memory-bank/progress.md` - **What works, what doesn't**
3. Reference others as needed

### Starting Any Work Session
```bash
# Read these files in this order:
1. .cursor/memory-bank/activeContext.md   # Where are we now?
2. .cursor/memory-bank/progress.md        # What's done?
3. .cursor/memory-bank/systemPatterns.md  # How do we build?
```

## Memory Bank Structure

```
.cursor/
├── memory-bank/           # Core documentation
│   ├── README.md          # How to use Memory Bank
│   ├── projectbrief.md    # Project identity and goals
│   ├── productContext.md  # User experience and vision
│   ├── systemPatterns.md  # Technical architecture ⭐
│   ├── techContext.md     # Tech stack and setup
│   ├── activeContext.md   # Current work (read this first!) ⭐
│   └── progress.md        # Status and completion ⭐
│
└── rules/                 # Code patterns and conventions
    ├── base.mdc           # Core development rules ⭐
    └── firebase.mdc       # Firebase-specific patterns ⭐
```

⭐ = Most frequently referenced files

## File Hierarchy (What to Read When)

### Understanding the Project (First Session)
```
projectbrief.md → productContext.md → systemPatterns.md
```

### Starting Work (Every Session)
```
activeContext.md → progress.md → (reference others as needed)
```

### Implementing Features (During Work)
```
systemPatterns.md → techContext.md → .cursor/rules/
```

### Making Decisions (When Stuck)
```
systemPatterns.md → activeContext.md → architecture.md (in root)
```

## Critical Information to Know

### 🔴 CRITICAL: Individual Documents Pattern
**Never use arrays in Firestore documents!**

```typescript
// ✅ CORRECT - Individual documents
doc(db, 'canvases', canvasId, 'shapes', shapeId)

// ❌ WRONG - Arrays cause conflicts
doc(db, 'canvases', canvasId) with { shapes: [...] }
```

Why: This is THE most important architectural decision. Arrays caused 40-60% transaction conflicts. Individual documents reduced this to <5%.

Detailed explanation: `.cursor/memory-bank/systemPatterns.md`

### Current Project Status
- **Phase:** MVP Complete ✅, Phase 2 Planning
- **Recent:** PR #10 - Architecture refactor (individual documents)
- **Next:** AI agent integration
- **Performance:** Meeting all targets (60 FPS, <100ms sync)

### Tech Stack
- React 19 + TypeScript + Konva.js + Firebase
- Firestore (persistent) + Realtime DB (ephemeral)
- Vite (build) + Vitest (testing)

## Using the Rules System

### Code Patterns (.cursor/rules/)
These files contain project-specific coding patterns and conventions:

- **base.mdc** - Core patterns for all code
- **firebase.mdc** - Firebase-specific patterns (VERY important)

These rules are automatically loaded by Cursor IDE when coding.

### When to Reference Rules
- Before implementing Firebase operations
- When creating new components
- When adding performance optimizations
- When handling errors

## Updating the Memory Bank

### When to Update

**activeContext.md** - Update frequently
- At start of session (what you're working on)
- When switching tasks
- At end of session (what you completed)

**progress.md** - Update when features complete
- Feature completed
- Bug fixed
- Performance target achieved
- Tests passing

**Other files** - Update rarely
- Only when core architecture/vision changes
- When new patterns are established
- When tech stack changes

### How to Update
1. Make changes directly to the markdown files
2. Commit with clear messages
3. Keep activeContext.md current
4. Archive old "current work" items monthly

## Key Principles

### 1. Memory Bank Over Memory
Your memory resets between sessions. Memory Bank doesn't. Trust the docs.

### 2. Update as You Go
Don't wait until the end. Update activeContext.md continuously.

### 3. One Source of Truth
If Memory Bank conflicts with code, investigate. Update Memory Bank if needed.

### 4. Consistency Matters
Follow established patterns. Check systemPatterns.md before inventing new approaches.

### 5. Document Decisions
When you make an architectural decision, document it in systemPatterns.md.

## Common Questions

### Q: What if I'm confused about current state?
**A:** Read `activeContext.md` - it's the "you are here" file.

### Q: What if I want to add a feature?
**A:** Check `progress.md` → `systemPatterns.md` → `techContext.md`

### Q: What if I need to understand architecture?
**A:** Read `systemPatterns.md` + `architecture.md` (root)

### Q: What if I'm getting Firebase errors?
**A:** Read `.cursor/rules/firebase.mdc` - common mistakes are documented

### Q: How do I know what's already working?
**A:** Check `progress.md` - comprehensive status of all features

### Q: Memory Bank says X but code does Y?
**A:** Investigate code, then update Memory Bank to reflect reality

## Benefits of Memory Bank

### Without Memory Bank
- ❌ Repeat same mistakes
- ❌ Reinvent patterns
- ❌ Break working code
- ❌ Forget context
- ❌ Waste time exploring

### With Memory Bank
- ✅ Learn from past decisions
- ✅ Follow established patterns
- ✅ Understand trade-offs
- ✅ Start productive immediately
- ✅ Maintain consistency

## Integration with Development

### Before Coding
```bash
# 1. Read current state
cat .cursor/memory-bank/activeContext.md

# 2. Check what's done
cat .cursor/memory-bank/progress.md

# 3. Reference patterns as needed
cat .cursor/memory-bank/systemPatterns.md
```

### During Coding
- Keep `.cursor/rules/` in mind (Cursor IDE loads automatically)
- Reference `systemPatterns.md` when implementing features
- Reference `techContext.md` for setup/config questions

### After Coding
```bash
# Update current state
vim .cursor/memory-bank/activeContext.md

# If feature complete, update progress
vim .cursor/memory-bank/progress.md
```

## Memory Bank Health Checklist

Run this check monthly:

- [ ] activeContext.md updated in last week
- [ ] progress.md reflects current reality
- [ ] No outdated "Current Focus" items in activeContext
- [ ] No contradictions between files
- [ ] All core files present and readable
- [ ] Files are under 10KB each (readable)

## Resources

### In Memory Bank
- **Full guide:** `.cursor/memory-bank/README.md`
- **Current state:** `.cursor/memory-bank/activeContext.md` ⭐
- **Architecture:** `.cursor/memory-bank/systemPatterns.md` ⭐

### In Project Root
- **Original requirements:** `PRD.md`
- **Architecture diagrams:** `architecture.md`
- **Deployment:** `DEPLOYMENT_GUIDE.md`
- **Testing:** `TESTING_CHECKLIST.md`

### Online
- **Firebase Console:** https://console.firebase.google.com/project/collab-canvas-2a24a
- **Deployed App:** https://collab-canvas-2a24a.web.app/

## Success Metrics

### Memory Bank is Working If:
- ✅ Can start work within 5 minutes of reading
- ✅ Understand current project state immediately
- ✅ Find answers to questions quickly
- ✅ Follow established patterns naturally

### Memory Bank Needs Attention If:
- ⚠️ Confused about what to work on
- ⚠️ Can't find information about decisions
- ⚠️ Making changes that break existing patterns
- ⚠️ Spending >10 minutes orienting

---

## TL;DR - Absolute Minimum

**Every session, read:**
1. `.cursor/memory-bank/activeContext.md` - Where we are
2. `.cursor/memory-bank/progress.md` - What works

**When coding, remember:**
- Individual Firestore documents (NOT arrays)
- Optimistic updates pattern
- 60 FPS always
- Follow patterns in `.cursor/rules/`

**End of session:**
- Update `activeContext.md` with what you did

---

**The Memory Bank is your link to all previous work. Use it well.**

