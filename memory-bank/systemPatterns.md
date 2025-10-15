# System Patterns

## Architecture Overview
CollabCanvas uses a client-side React application with Firebase backend services. The architecture prioritizes real-time collaboration and performance.

## Core Patterns

### 1. Shape Synchronization Pattern
**Pattern**: Optimistic Updates + Firestore Sync
- User action updates local state immediately (optimistic)
- Background sync to Firestore happens async
- onSnapshot listener updates all connected clients
- Rollback on Firestore error

**Code Location**: `hooks/useShapeSync.ts`

**Key Functions**:
```typescript
createShape(shape) // Optimistic local add → Firestore sync
updateShape(id, updates) // Optimistic update → Firestore sync
deleteShape(id) // Optimistic remove → Firestore sync
lockShape(id, userId) // Set lock flag → Firestore sync
```

### 2. Object Locking Pattern
**Pattern**: First-to-drag wins with auto-timeout
- User starts dragging → locks shape immediately
- Other users see red border, cannot interact
- Lock released on drag end OR 5-second timeout
- Prevents concurrent edit conflicts

**Implementation**:
- `onDragStart` → call `lockShape(id, userId)`
- `onDragEnd` → call `unlockShape(id)` + update position
- Timeout: `setTimeout(() => unlockShape(id), 5000)`

### 3. Cursor Tracking Pattern  
**Pattern**: Throttled Realtime DB updates
- Mouse move events throttled to 16ms (60fps)
- Write to Realtime DB: `cursors/{userId}`
- onValue listener updates all clients
- onDisconnect() cleanup when user leaves

**Code Location**: `hooks/useCursorSync.ts`

### 4. Presence Tracking Pattern
**Pattern**: Active/Away/Offline with heartbeat
- User activity tracked via mouse movement and interactions
- Active → Away transition after 2 minutes of inactivity
- Offline when browser closes (onDisconnect)
- Status updates via Realtime DB

**Code Location**: `hooks/usePresence.ts`

### 5. Shape Rendering Pattern
**Pattern**: Konva Layer separation + React.memo
- Shapes on one Layer
- Cursors on separate Layer (listening: false for performance)
- Each shape component wrapped in React.memo
- Custom comparison function to prevent unnecessary re-renders

**Code Location**: `components/Canvas.tsx`

### 6. Shape Creation Modes
**Mode 1: Click-to-Place** (Current default for rectangles/circles)
- Click tool button → enter crosshair mode
- Click canvas → drag to define size
- Release → shape created at that size

**Mode 2: Drag-from-Tool** (Alternative)
- Click tool button and drag into canvas
- Shape appears at cursor position
- Drop to place with default size

**Implementation**: LeftSidebar handles mouse events, Canvas receives callbacks

### 7. Component Communication Pattern
**Pattern**: Props down, callbacks up
```
App → Canvas → Shape Components
    ↓
  AuthContext (user info)
  useShapeSync (shape data + operations)
  useCursorSync (multiplayer cursors)
  usePresence (user presence)
```

## Data Flow Diagrams

### Shape Creation Flow
```
User clicks tool → LeftSidebar onAddShape 
  → Canvas enterPlacementMode(type)
  → User drags on canvas
  → Canvas creates local preview shape
  → User releases mouse
  → Canvas calls createShape(data)
  → useShapeSync optimistic update
  → Firestore sync
  → onSnapshot triggers for all clients
  → All canvases re-render with new shape
```

### Shape Update Flow
```
User drags shape → Rectangle onDragStart
  → Canvas locks shape
  → User moves mouse
  → Rectangle position updates (Konva handles)
  → User releases → Rectangle onDragEnd
  → Canvas unlocks shape + updates position
  → useShapeSync.updateShape(id, {x, y})
  → Firestore sync
  → All clients receive update
```

## Key Design Decisions

### 1. Why separate Firestore (shapes) and Realtime DB (cursors)?
- Firestore: Better for persistent data, complex queries
- Realtime DB: Lower latency, cheaper for ephemeral data
- Cursors/presence don't need persistence

### 2. Why optimistic updates?
- Instant UI feedback (feels native)
- Masks network latency
- Sync happens invisibly in background
- Rollback only on actual errors

### 3. Why object locking?
- Last-write-wins can cause jarring jumps
- Locking gives clear ownership during edits
- Better UX for collaborative editing
- Auto-timeout prevents stuck locks

### 4. Shape interface design
Current approach uses single x, y, width, height for all shapes:
- Rectangle: x, y = top-left, width/height = size
- Circle: x, y = center, width = height = diameter
- Text: x, y = top-left, width/height = bounding box
- **Line (proposed)**: x, y = start point, width/height = delta to end point

This keeps the interface uniform but may be suboptimal for lines.

## Performance Optimizations

1. **React.memo on shape components**
   - Prevents re-renders when other shapes update
   - Custom comparison checks: x, y, isSelected, isLocked

2. **Separate Konva Layers**
   - Shapes layer: full interaction
   - Cursors layer: listening: false (no event handling overhead)

3. **Throttled cursor updates**
   - 16ms throttle = max 60 updates/second
   - Reduces Firebase writes and bandwidth

4. **Stage ref for cursor tracking**
   - Direct access to Konva stage
   - Avoids React re-renders for cursor position

## Testing Patterns

### Multi-browser Testing
Open 2-3 browser windows:
1. Test shape creation appears in all browsers
2. Test lock indicators show correctly
3. Test cursor tracking works
4. Test presence indicators update

### Stress Testing  
Use "Stress Test" button (dev mode):
- Creates 100 shapes at once
- Verify FPS stays >55
- Check Firestore quota usage
- Monitor memory usage

## Common Pitfalls

1. **Don't forget onDisconnect cleanup**
   - Always set onDisconnect().remove() for Realtime DB paths
   - Otherwise ghost cursors/presence remain

2. **Don't mutate shape objects directly**
   - Always create new objects for updates
   - React needs new references to detect changes

3. **Check lock status before allowing interactions**
   - Every drag/delete/edit must check isLocked && lockedBy !== currentUserId

4. **Remember two-way mapping for circle coordinates**
   - Store as center point internally
   - Konva Circle uses center-based positioning

