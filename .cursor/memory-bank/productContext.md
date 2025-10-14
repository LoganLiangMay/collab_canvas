# Product Context: CollabCanvas

## Why This Exists
Figma revolutionized design by making collaboration seamless. This project demonstrates how to build the core collaborative infrastructure that enables real-time multi-user editing without conflicts.

## Problem It Solves
Traditional design tools force users to:
- Work on separate files and merge manually
- Deal with "locked file" errors
- Lose work during conflicts
- Not see what teammates are doing

CollabCanvas solves this by:
- Real-time synchronization across all users
- Visible cursor presence (see where others are working)
- Optimistic updates (immediate feedback)
- Automatic conflict resolution
- Persistent state (work survives disconnections)

## How It Should Work

### User Experience Flow
1. **Authentication**: User logs in via email/password or Google OAuth
2. **Canvas Load**: Sees existing shapes immediately on a large workspace
3. **Navigation**: Pan by dragging background, zoom with mouse wheel
4. **Creation**: Click "Add Rectangle" to create a new shape
5. **Manipulation**: Drag shapes to move them around
6. **Deletion**: Select shape and press Delete/Backspace or click Delete button
7. **Collaboration**: See other users' cursors with names in real-time
8. **Presence**: Know who else is online via the user list

### Real-Time Collaboration Experience
**When User A creates a shape:**
- User A sees it appear immediately (optimistic update)
- User B sees it appear within 100ms (Firestore sync)
- Both users can drag it independently
- Last edit wins if there's a conflict

**When User A moves their cursor:**
- User B sees cursor move within 50ms (Realtime DB)
- Cursor shows User A's name and unique color
- Throttled to 60fps to reduce bandwidth

**When User A disconnects:**
- Their cursor disappears from other users' screens
- Their name disappears from the user list
- Their shapes remain on canvas
- Everything works when they reconnect

## Target Users

### MVP Phase
- Developers learning real-time collaboration patterns
- Students building multiplayer features
- Engineers demonstrating collaborative infrastructure

### Phase 2 (Future)
- Design teams collaborating on wireframes
- Remote teams brainstorming on shared canvases
- Teachers and students in interactive lessons
- Anyone using AI to generate designs via natural language

## User Experience Goals

### Performance
- **Instant Feedback**: All actions feel immediate
- **Smooth Animation**: 60 FPS maintained always
- **Fast Sync**: Updates appear on other screens in <100ms
- **No Lag**: Cursor movements feel native

### Reliability
- **Never Lose Work**: Canvas state persists through disconnections
- **Graceful Errors**: Friendly messages, never crash
- **Always Available**: Works for hours without issues
- **Recoverable**: Refresh works, reconnection works

### Clarity
- **Visual Feedback**: Selection states, hover effects clear
- **User Awareness**: Always know who else is present
- **Error Messages**: Clear, actionable guidance
- **Status Indicators**: Activity states visible

### Simplicity
- **No Onboarding Needed**: Intuitive interactions
- **Familiar Patterns**: Drag to pan, wheel to zoom
- **Minimal UI**: Canvas-focused, no clutter
- **Quick Actions**: Keyboard shortcuts work

## Core Interactions

### Canvas Navigation
- **Pan**: Click and drag empty space
- **Zoom**: Mouse wheel (0.5x to 2x)
- **Works while others edit**: No performance degradation

### Shape Operations
- **Create**: Toolbar button, appears at center
- **Select**: Click shape (blue border appears)
- **Deselect**: Click empty space
- **Move**: Drag selected shape
- **Delete**: Delete/Backspace key or toolbar button

### Collaboration Awareness
- **Cursors**: See everyone's pointer with name label
- **User List**: Sidebar shows all online users
- **Activity Status**: Active (green), Away (yellow), Offline (gray)
- **Shape Locking**: Visual indicator when someone is editing

## What Makes It Special

### Technical Excellence
- **Sub-100ms sync**: Faster than most collaboration tools
- **Zero conflict errors**: Individual documents per shape
- **Optimistic updates**: UI never waits for server
- **Intelligent throttling**: 60fps cursor updates, not every frame

### Architecture Quality
- **Clean separation**: Hooks for data, components for UI
- **Type safety**: Full TypeScript coverage
- **Error boundaries**: Graceful failure handling
- **Performance monitoring**: Built-in FPS counter
- **Debug tools**: Error logging and debug panel

### Developer Experience
- **Well documented**: Architecture diagrams, comprehensive docs
- **Tested**: Unit and integration tests
- **Modern stack**: React 19, TypeScript, Vite
- **Easy deployment**: Firebase hosting, one command deploy


