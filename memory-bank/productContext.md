# Product Context

## Why This Project Exists

CollabCanvas is a real-time collaborative design tool inspired by Figma. It demonstrates the technical foundations of multiplayer collaboration: instant sync, conflict resolution, and presence awareness. The goal is to build a production-ready proof-of-concept that could evolve into a full design platform.

## Problems It Solves

### 1. Real-Time Collaboration Challenges
Traditional design tools force users to work in isolation, then merge changes manually. This creates:
- Version conflicts
- Lost work
- Communication overhead
- Slow iteration cycles

**CollabCanvas Solution**: True real-time sync (<100ms) where multiple users see changes instantly, with automatic conflict resolution via object locking.

### 2. Multiplayer Presence Awareness
When collaborating remotely, users need to know:
- Who else is working on the canvas
- Where they are looking (cursor tracking)
- What they are editing (lock indicators)
- Their availability status (Active/Away/Offline)

**CollabCanvas Solution**: Complete presence system with cursor tracking (<50ms), user status, and visual feedback.

### 3. Canvas Performance at Scale
Design tools must handle hundreds of objects while maintaining smooth interactions (60 FPS). Poor performance breaks the user flow.

**CollabCanvas Solution**: Optimized rendering with React.memo, separate Konva layers, and throttled updates. Maintains 60 FPS with 500+ objects.

### 4. AI-Assisted Design
Manual shape creation is tedious for common patterns (forms, layouts, grids). Users want to express intent and have AI execute.

**CollabCanvas Solution**: AI agent that understands natural language commands and creates/arranges shapes automatically.

## How It Should Work

### Core User Flows

#### 1. Getting Started (New User)
```
User visits site → Sees login/signup screen
→ Signs up with email or Google
→ Immediately enters canvas
→ Sees toolbar with shape tools
→ Clicks "Add Rectangle" → Drags to create
→ Shape appears, user can move/edit
→ Everything auto-saves (no save button needed)
```

#### 2. Collaborative Editing (Multiplayer)
```
User A is editing canvas
→ User B joins (sees User A's cursor and name)
→ User B creates new shape → User A sees it appear instantly
→ Both users drag shapes around → see each other's changes
→ User A starts editing shape → locks it (red border for User B)
→ User B tries to drag locked shape → cannot move it
→ User A finishes → shape unlocks → User B can now edit
```

#### 3. Shape Creation
```
**Method 1: Click-and-Drag**
User clicks tool button → Cursor becomes crosshair
→ User clicks canvas and drags → Preview shape appears
→ User releases → Shape created at that size

**Method 2: Drag-from-Tool** (alternative)
User clicks and holds tool button → Drags onto canvas
→ Shape appears at cursor → Drops with default size
```

#### 4. AI-Assisted Creation
```
User clicks AI input (or uses keyboard shortcut)
→ Types: "Create a login form"
→ AI creates: username field, password field, submit button
→ Arranges them vertically with proper spacing
→ All users see the AI-created elements instantly
```

#### 5. Navigation
```
**Pan**: Click empty canvas + drag to move viewport
**Zoom**: Scroll wheel to zoom in/out (centers on cursor)
**Select**: Click shape to select (blue border appears)
**Deselect**: Click empty canvas
**Delete**: Select shape + press Delete/Backspace
```

## User Experience Goals

### Speed & Responsiveness
- **Instant feedback**: UI updates immediately (optimistic updates)
- **No loading spinners** during normal operations
- **Smooth 60 FPS** during all interactions
- **Sub-100ms sync** for shape changes
- **Sub-50ms sync** for cursor movements

### Clarity & Confidence
- **Visual feedback** for all actions (toasts, highlights, lock indicators)
- **Clear ownership**: Lock indicators show who's editing what
- **Status awareness**: See who's online, active, away, or offline
- **No surprises**: Changes sync predictably, no sudden jumps

### Simplicity & Intuitiveness
- **No tutorials required**: UI is self-explanatory
- **Familiar patterns**: Pan/zoom like Google Maps, select/drag like any editor
- **Minimal UI chrome**: Canvas is the focus, tools stay out of the way
- **Keyboard shortcuts** for power users

### Collaboration Feel
- **Presence**: Always know who else is there
- **Cursors with names**: See exactly where collaborators are looking
- **Real-time updates**: Feel like you're in the same room
- **Conflict avoidance**: Locking prevents stepping on each other's toes

### Error Recovery
- **Graceful failures**: Network issues show clear messages
- **Auto-reconnect**: Recovers from disconnections automatically
- **No data loss**: Changes persist even if browser crashes
- **Undo mistakes**: (Future: undo/redo system)

## Target User Personas

### 1. The Collaborative Designer
- Works on design teams
- Needs to collaborate remotely
- Values real-time feedback
- Wants to avoid "design-by-email"
- **Primary use case**: Team brainstorming, wireframing

### 2. The Solo Creator
- Works independently
- Appreciates auto-save and persistence
- May collaborate occasionally
- Wants fast, responsive tools
- **Primary use case**: Quick mockups, diagrams

### 3. The Technical User
- Comfortable with keyboard shortcuts
- Appreciates performance
- Wants efficiency features
- May use AI commands heavily
- **Primary use case**: Flowcharts, technical diagrams

### 4. The AI Enthusiast
- Excited about AI-assisted workflows
- Experiments with AI commands
- Wants to express intent, not manually create
- **Primary use case**: Rapid prototyping with AI

## Success Metrics

### Technical Success
- ✅ Sub-100ms shape sync latency
- ✅ Sub-50ms cursor sync latency
- ✅ 60 FPS sustained with 500+ objects
- ✅ 5+ concurrent users without degradation
- ✅ Zero data loss on disconnections

### User Experience Success
- No confusion about multiplayer state
- Users understand object locking immediately
- No accidental conflicts or lost work
- Feels fast and responsive
- Users trust the system (no manual saves)

### Functional Success
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Multiple shape types (Rectangle, Circle, Text, Line)
- ✅ Real-time collaboration works flawlessly
- ✅ AI agent handles 6+ command types
- ✅ Authentication is secure and seamless

## Current State vs Vision

### What We Have (MVP Complete)
- ✅ Real-time collaboration with object locking
- ✅ Rectangle, Circle, Text shapes
- ✅ Multiplayer cursors with names/colors
- ✅ Presence system (Active/Away/Offline)
- ✅ Basic AI agent (optional, via OpenAI)
- ✅ Email/password + Google OAuth
- ✅ Deployed and stable

### What's Next (Phase 2)
- 🔜 Line shape (immediate priority)
- 🔜 Arrow shape (extension of line)
- 🔜 Undo/Redo system
- 🔜 Color picker and shape styling
- 🔜 Multi-select and group operations
- 🔜 Resize and rotate handles
- 🔜 Multiple canvas support

### Future Vision (Phase 3+)
- Export/import (PNG, SVG)
- Component system (reusable elements)
- Layers panel with z-index control
- Alignment and distribution tools
- Version history
- Mobile support
- Enhanced AI capabilities

## Design Principles

### 1. Real-Time First
Every feature must work in real-time across all users. If it can't sync instantly, reconsider the feature.

### 2. Optimistic by Default
Update the UI immediately, sync in the background. Never make users wait for the server.

### 3. Conflicts Are Inevitable
Accept that conflicts happen. Handle them gracefully with clear feedback, not by preventing collaboration.

### 4. Performance Is a Feature
60 FPS is not optional. Users feel lag even if they don't consciously notice it.

### 5. Simplicity Over Power
Better to have 5 features that work perfectly than 20 features that are confusing.

### 6. Trust the User
No confirmation dialogs for reversible actions. Add undo/redo instead.

### 7. Make the Invisible Visible
Show cursors, show locks, show presence. Multiplayer state should be obvious.

## Anti-Patterns to Avoid

### ❌ Ignoring Conflicts
Don't silently overwrite changes. Show clear visual feedback when conflicts occur.

### ❌ Fake Real-Time
Don't poll every N seconds. Use proper real-time listeners (WebSockets, Firebase).

### ❌ Blocking Operations
Never freeze the UI waiting for the server. Use optimistic updates + background sync.

### ❌ Invisible State
Don't hide who's editing what. Make multiplayer presence obvious.

### ❌ Over-Engineering
Don't build CRDT or OT if simple last-write-wins + locking works for your use case.

### ❌ Neglecting Performance
Don't add features that tank FPS. Profile and optimize constantly.

## User Feedback Integration

### What Users Love
- "It just works" - auto-save, persistence, reconnection
- "I can see where everyone is" - cursor tracking
- "No more merge conflicts" - object locking
- "So fast!" - <100ms sync feels instant

### What Users Request
- Undo/redo (top request)
- More shape types (lines, arrows, polygons)
- Color customization
- Resize/rotate handles
- Copy/paste between canvases
- Templates and components

### What Users Find Confusing
- Why can't I move a locked shape? (Need better lock indicators)
- How do I know if I'm connected? (Need connection status indicator)
- Where did my cursor go? (Own cursor not shown - intentional)

## Technical Constraints Impact on UX

### Firebase Free Tier
- **Constraint**: Limited concurrent connections (100)
- **Impact**: Must optimize cursor updates (throttle to 60fps)
- **UX**: Users don't notice, performance is good

### Firestore vs Realtime DB
- **Decision**: Use Firestore for shapes (persistent), Realtime DB for cursors (ephemeral)
- **Impact**: Optimal latency for each use case
- **UX**: Fast enough to feel instant

### Browser Canvas Limitations
- **Constraint**: Re-rendering 1000+ objects is slow
- **Impact**: Must optimize with React.memo, layer separation
- **UX**: Smooth up to 500+ objects

### TypeScript Shape Interface
- **Decision**: Use x, y, width, height for all shapes
- **Impact**: Less flexible for lines (need two points)
- **Workaround**: Map (x,y) to start, (x+width, y+height) to end
- **UX**: Users don't care about internal representation

## Competitive Analysis

### vs Figma
- **Figma Strengths**: Mature, feature-rich, vector editing, components
- **CollabCanvas Focus**: Simpler, lighter, AI-assisted, open architecture

### vs Google Jamboard (RIP)
- **Jamboard**: Simple, real-time, but limited
- **CollabCanvas**: More structured, developer-focused

### vs Miro/Mural
- **Miro/Mural**: Whiteboarding, sticky notes, facilitation
- **CollabCanvas**: Design tool focus, precise shapes, developer tools

### vs Excalidraw
- **Excalidraw**: Hand-drawn style, simple, fast
- **CollabCanvas**: Precise shapes, AI agent, more structured

## Project Philosophy

**Build the multiplayer infrastructure right, then add features.**

This is why we spent significant effort on:
- Object locking (prevents conflicts)
- Optimistic updates (feels instant)
- Cursor throttling (performance at scale)
- Presence system (know who's there)

These foundations enable all future features to "just work" in multiplayer.

## Summary

CollabCanvas is a proof-of-concept for real-time collaborative design tools with AI assistance. The MVP is complete and demonstrates that solid multiplayer infrastructure enables natural collaboration. Phase 2 will add more shape types and editing features, building on the proven foundation.

**Core Value Proposition**: Design together in real-time, with AI assistance, without conflicts or lost work.

