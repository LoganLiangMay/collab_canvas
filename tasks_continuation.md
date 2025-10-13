## PR #4: Rectangle Creation & Local Manipulation

**Branch:** `feature/shapes-local`  
**Goal:** Create, select, and move rectangles (local state only, no Firebase yet)  
**Architecture Reference:** See `architecture.md` Section 1 (Rectangle component) & Section 7 (Shape data model)  
**Est. Time:** 2 hours

### Tasks:

- [ ] **4.1: Create Shape Type Definitions**
  
  - **Files to create:** `src/types/shape.types.ts`
  - **Content:** Define Shape interface matching architecture.md Section 7
    ```typescript
    interface Shape {
      id: string;
      type: 'rectangle';
      x: number;
      y: number;
      width: number;
      height: number;
      fill: string;
      userId: string;
      createdAt: number;
      updatedAt: number;
      isLocked?: boolean;
      lockedBy?: string;
    }
    ```
  - **AI Prompt:** "Create src/types/shape.types.ts with Shape interface as shown in architecture.md Section 7. Include id, type (literal 'rectangle'), x, y, width, height, fill, userId, createdAt, updatedAt, and optional isLocked/lockedBy fields."

- [ ] **4.2: Create Rectangle Component**
  
  - **Files to create:** `src/components/Rectangle.tsx`
  - **Props:** id, x, y, width, height, fill, isSelected, isLocked, onDragEnd, onClick
  - **Features:**
    - Konva Rect element
    - Draggable (but disabled if isLocked)
    - Shows stroke when selected
    - Different stroke color if locked by another user
  - **AI Prompt:** "Create Rectangle.tsx with Konva Rect component. Props: id, x, y, width, height, fill, isSelected, isLocked, lockedBy (optional), onDragEnd callback, onClick callback. Make draggable unless isLocked is true. Show blue stroke if isSelected, red stroke if isLocked. Call onDragEnd with id and new position. Call onClick with id."

- [ ] **4.3: Create Canvas Helper Utilities**
  
  - **Files to create:** `src/utils/canvasHelpers.ts`
  - **Functions:**
    - `generateId()`: Returns crypto.randomUUID()
    - `getCanvasCenter(stageWidth, stageHeight, stageScale, stagePos)`: Calculates center of visible viewport
  - **AI Prompt:** "Create src/utils/canvasHelpers.ts with generateId() that returns crypto.randomUUID(), and getCanvasCenter(stageWidth, stageHeight, stageScale, stagePos) that calculates center of current viewport: {x: (stageWidth/2 - stagePos.x) / stageScale, y: (stageHeight/2 - stagePos.y) / stageScale}."

- [ ] **4.4: Add Shape State to Canvas**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Add state:** `shapes` (Shape[]), `selectedId` (string | null)
  - **Add functions:**
    - `createShape()`: Generates new rectangle at canvas center, adds to shapes array
    - `updateShapePosition(id, x, y)`: Updates shape position in array
    - `selectShape(id)`: Sets selectedId
    - `deselectShape()`: Sets selectedId to null
  - **AI Prompt:** "Update Canvas.tsx to add shapes state (Shape[] from types), selectedId state (string | null). Add createShape function that uses generateId and getCanvasCenter to create new rectangle (width:150, height:100, fill:'#3498db') at viewport center. Add updateShapePosition, selectShape, and deselectShape functions."

- [ ] **4.5: Render Rectangles in Canvas**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Add:** Map over shapes array in Layer, render Rectangle component for each
  - **Pass:** All shape properties, isSelected check, onDragEnd/onClick handlers
  - **AI Prompt:** "Update Canvas.tsx Layer to map over shapes array and render Rectangle component for each. Pass shape props, isSelected={shape.id === selectedId}, isLocked={shape.isLocked}, onDragEnd={updateShapePosition}, onClick={selectShape}."

- [ ] **4.6: Create Toolbar Component**
  
  - **Files to create:** `src/components/UI/Toolbar.tsx`
  - **Content:** Fixed-position toolbar with "Add Rectangle" button
  - **Styling:** Top-left corner, padding, simple background
  - **AI Prompt:** "Create Toolbar.tsx with 'Add Rectangle' button. Fixed position top-left (top: 16px, left: 16px). Accept onAddRectangle prop. Style with padding, background, rounded corners."

- [ ] **4.7: Create Button Component**
  
  - **Files to create:** `src/components/UI/Button.tsx`
  - **Props:** children, onClick, disabled (optional)
  - **Styling:** Padding, background color, hover state, cursor pointer
  - **AI Prompt:** "Create Button.tsx reusable component. Props: children (ReactNode), onClick (function), disabled (optional boolean). Style with padding (8px 16px), background (#3498db), white text, rounded corners, hover effect (darker blue), cursor pointer, disabled state (gray + cursor not-allowed)."

- [ ] **4.8: Integrate Toolbar in Canvas**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Add:** Import and render Toolbar, pass createShape as onAddRectangle
  - **Position:** Render outside Stage (as sibling div)
  - **AI Prompt:** "Update Canvas.tsx to import and render Toolbar component outside Konva Stage (as sibling div with position: relative). Pass createShape function as onAddRectangle prop."

- [ ] **4.9: Add Click-to-Deselect**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Add:** onClick handler on Stage
  - **Logic:** If click target is Stage (not a shape), call deselectShape()
  - **AI Prompt:** "Add onClick handler to Stage in Canvas.tsx. Check if e.target === e.target.getStage() (clicked background, not shape). If true, call deselectShape()."

- [ ] **4.10: Test Rectangle Interactions**
  
  - Click "Add Rectangle" multiple times
  - Click rectangles to select (should show blue outline)
  - Drag selected rectangles
  - Click canvas background to deselect
  - **AI Prompt:** N/A (Manual testing)

**PR Checklist:**

- [ ] "Add Rectangle" button creates rectangle at viewport center
- [ ] Multiple rectangles can be created
- [ ] Clicking rectangle selects it (shows blue stroke)
- [ ] Clicking background deselects
- [ ] Can drag selected rectangle smoothly
- [ ] Rectangle position updates in state on drag end
- [ ] All shapes have unique IDs
- [ ] No TypeScript errors
- [ ] ~60 FPS maintained with 10+ rectangles

**Architecture Alignment:**
- ✅ Shape type matches architecture.md Section 7 data model
- ✅ Rectangle component matches architecture.md diagram
- ✅ Helper utilities follow patterns
- ✅ Toolbar/Button UI components added

---

## PR #5: Real-Time Shape Synchronization with Object Locking

**Branch:** `feature/shape-sync`  
**Goal:** Sync shapes across users in real-time + implement object locking  
**Architecture Reference:** See `architecture.md` Section 5 (Shape Sync Flow) & Section 8 (Firestore rules)  
**Est. Time:** 3-4 hours

### Tasks:

- [ ] **5.1: Update Firestore Security Rules**
  
  - Go to Firebase Console → Firestore → Rules
  - Set to test mode (allow read, write: if true)
  - **Add comment:** // TODO: Restrict to authenticated users in production
  - **AI Prompt:** N/A (Manual Firebase console)

- [ ] **5.2: Design Firestore Schema**
  
  - **Collection:** `canvases`
  - **Document ID:** `global-canvas-v1` (hardcoded for MVP)
  - **Document structure:**
    ```typescript
    {
      canvasId: 'global-canvas-v1',
      shapes: Shape[],  // Array of shape objects
      lastUpdated: Timestamp
    }
    ```
  - **Note:** Using single document with array for simplicity; scale later with subcollections
  - **AI Prompt:** N/A (Schema documentation)

- [ ] **5.3: Create useShapeSync Hook**
  
  - **Files to create:** `src/hooks/useShapeSync.ts`
  - **Features:**
    - Subscribe to Firestore document with onSnapshot
    - Return shapes array, loading state, error state
    - Provide createShape, updateShape, deleteShape, lockShape, unlockShape functions
    - Optimistic updates: Update local state immediately, then sync to Firebase
  - **AI Prompt:** "Create useShapeSync.ts hook. Use Firestore onSnapshot to listen to canvases/global-canvas-v1 document. Return shapes array, loading, error. Provide createShape (add to shapes array in Firestore), updateShape (update shape in array), deleteShape (remove from array), lockShape (set isLocked: true, lockedBy: userId), unlockShape (set isLocked: false). Implement optimistic updates: update local state immediately, then call Firestore updateDoc. Handle errors and rollback on failure."

- [ ] **5.4: Implement Object Locking Logic**
  
  - **Files to update:** `src/hooks/useShapeSync.ts`
  - **lockShape(shapeId, userId):**
    - Set shape.isLocked = true, shape.lockedBy = userId
    - Update in Firestore
  - **unlockShape(shapeId):**
    - Set shape.isLocked = false, shape.lockedBy = null
    - Update in Firestore
  - **Auto-unlock timeout:** After 3-5 seconds of inactivity, auto-unlock
  - **AI Prompt:** "Add lockShape and unlockShape functions to useShapeSync.ts. lockShape sets isLocked: true and lockedBy: userId in Firestore. unlockShape sets isLocked: false. Implement auto-unlock: when shape is locked, set setTimeout for 5 seconds to auto-unlock if not manually unlocked first. Store timeout ID and clear on manual unlock."

- [ ] **5.5: Replace Local State with useShapeSync**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Replace:** Local shapes useState with useShapeSync hook
  - **Update:** createShape to call hook's createShape function
  - **Update:** updateShapePosition to call hook's updateShape function
  - **Add:** useAuth to get current userId for locking
  - **AI Prompt:** "Update Canvas.tsx to replace local shapes state with useShapeSync hook. Import useAuth to get current user. Update createShape to call hook's createShape with userId from useAuth. Update updateShapePosition to call hook's updateShape. Remove local state management."

- [ ] **5.6: Integrate Lock/Unlock on Drag**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **onDragStart:** Call lockShape(shapeId, userId)
  - **onDragEnd:** Call unlockShape(shapeId) + updateShapePosition
  - **Check lock:** Only allow drag if !isLocked || lockedBy === currentUserId
  - **AI Prompt:** "Update Rectangle component integration in Canvas.tsx. Add onDragStart handler that calls lockShape(shape.id, currentUser.uid). Update onDragEnd to call unlockShape then updateShapePosition. Pass isLocked prop to Rectangle. In Rectangle, set draggable={!isLocked || lockedBy === currentUserId}."

- [ ] **5.7: Visual Lock Indicators**
  
  - **Files to update:** `src/components/Rectangle.tsx`
  - **Add:** Show red stroke when locked by another user
  - **Add:** Show lockBy user's name as tooltip/label when locked
  - **AI Prompt:** "Update Rectangle.tsx to show red stroke when isLocked && lockedBy !== currentUserId. Add Konva Text element next to rectangle showing '{lockedByName} is editing' when locked by another user."

- [ ] **5.8: Handle Lock Conflicts**
  
  - **Files to update:** `src/hooks/useShapeSync.ts`
  - **Logic:** If lockShape fails (shape already locked), show error/warning
  - **Check:** Before locking, verify shape.isLocked === false in current state
  - **AI Prompt:** "Update lockShape in useShapeSync.ts to check if shape is already locked before attempting to lock. If shape.isLocked === true and shape.lockedBy !== userId, return error or show toast notification. Only proceed if unlocked."

- [ ] **5.9: Add Loading and Error States**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Show:** Loading spinner while shapes are fetching
  - **Show:** Error message if Firestore connection fails
  - **Add:** Retry button on error
  - **AI Prompt:** "Update Canvas.tsx to check useShapeSync's loading and error states. If loading, show centered Spinner component. If error, show error message with retry button that reloads page or re-initializes hook."

- [ ] **5.10: Test Multi-User Sync with Locking**
  
  - Open 2 browsers
  - User A creates shape → User B sees it
  - User A starts dragging → shape locks, shows red border for User B
  - User B tries to drag locked shape → cannot move
  - User A releases → shape unlocks automatically
  - User B can now drag the shape
  - Test auto-unlock after 5 seconds if User A disconnects mid-drag
  - **AI Prompt:** N/A (Manual multi-browser testing)

**PR Checklist:**

- [ ] Shapes sync across 2+ browsers <100ms
- [ ] Creating shape in Browser 1 appears in Browser 2
- [ ] Moving shape in Browser 1 updates in Browser 2
- [ ] User A drags shape → locks for User A
- [ ] User B sees red border/lock indicator on User A's locked shape
- [ ] User B cannot drag shape while User A has it locked
- [ ] Lock releases when User A stops dragging
- [ ] Lock auto-releases after 5 seconds if connection lost
- [ ] Cannot delete shapes locked by other users
- [ ] Page refresh loads all shapes from Firestore
- [ ] All users leave and return → shapes persist

**Architecture Alignment:**
- ✅ Follows shape sync sequence diagram in architecture.md Section 5
- ✅ Implements last-write-wins conflict resolution
- ✅ Optimistic updates as specified
- ✅ Object locking prevents concurrent edit conflicts

---

## PR #6: Multiplayer Cursors

**Branch:** `feature/multiplayer-cursors`  
**Goal:** Real-time cursor tracking with names and colors  
**Architecture Reference:** See `architecture.md` Section 6 (Disconnect Flow) & Section 7 (Cursor data model)  
**Est. Time:** 3 hours

### Tasks:

- [ ] **6.1: Update Realtime Database Security Rules**
  
  - Go to Firebase Console → Realtime Database → Rules
  - Set to allow read, write (test mode)
  - **Add comment:** // TODO: Restrict to authenticated users
  - **AI Prompt:** N/A (Manual Firebase console)

- [ ] **6.2: Create Cursor Type Definitions**
  
  - **Files to create:** `src/types/cursor.types.ts`
  - **Content:** Cursor interface from architecture.md Section 7
    ```typescript
    interface Cursor {
      x: number;
      y: number;
      name: string;
      color: string;
      timestamp: number;
    }
    ```
  - **AI Prompt:** "Create src/types/cursor.types.ts with Cursor interface: x, y (numbers for canvas coordinates), name (string), color (string, hex code), timestamp (number for staleness checks)."

- [ ] **6.3: Create Color Utility**
  
  - **Files to create:** `src/utils/colors.ts`
  - **Content:**
    - Color palette array (8-10 distinct colors)
    - `getUserColor(userId: string): string` - hash userId to consistent color
  - **AI Prompt:** "Create src/utils/colors.ts with color palette: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#AED581', '#FFD54F']. Export getUserColor(userId: string) that returns colors[userId.charCodeAt(0) % colors.length] for consistent color per user."

- [ ] **6.4: Create useCursorSync Hook**
  
  - **Files to create:** `src/hooks/useCursorSync.ts`
  - **Features:**
    - Listen to Realtime DB cursors/{canvasId} path
    - Update own cursor on mousemove (throttled to 16ms for 60fps)
    - Use onDisconnect() to auto-remove cursor
    - Filter out own cursor from returned array
    - Return cursors array
  - **AI Prompt:** "Create useCursorSync.ts hook. Takes canvasId, stageRef, currentUser. Listen to firebase Realtime DB ref(rtdb, `cursors/${canvasId}`). On mount, add mousemove listener to stage that throttles updates to max 16ms (60fps). Get pointer position from stage, write to rtdb at cursors/{canvasId}/{userId} with {x, y, name, color, timestamp}. Use onDisconnect().remove() to cleanup. Return array of other users' cursors (filter out own userId)."

- [ ] **6.5: Implement Cursor Throttling**
  
  - **Files to update:** `src/hooks/useCursorSync.ts`
  - **Logic:** Track lastUpdate timestamp, only update if >16ms elapsed
  - **Reason:** Reduces Firebase writes, maintains 60fps max
  - **AI Prompt:** "In useCursorSync.ts mousemove handler, add throttling: let lastUpdate = 0; in handler check if Date.now() - lastUpdate < 16, return early if true. Otherwise update lastUpdate = Date.now() and proceed with cursor update. This limits to ~60fps."

- [ ] **6.6: Create Cursor Component**
  
  - **Files to create:** `src/components/Cursor.tsx`
  - **Content:** Konva Group with Circle (dot) and Text (name label)
  - **Styling:** Circle radius 5px, text offset 10px to right and up
  - **AI Prompt:** "Create Cursor.tsx component. Props: x, y, name, color. Render Konva Group at position (x, y) containing: Circle with radius 5 and fill color, Text with name, fontSize 12, fill color, positioned at x+10, y-5 relative to group. Export React.memo(Cursor) for performance."

- [ ] **6.7: Add Stage Ref to Canvas**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Add:** useRef for Stage, attach to Stage component ref prop
  - **AI Prompt:** "In Canvas.tsx, add const stageRef = useRef<any>(null). Pass ref={stageRef} to Stage component."

- [ ] **6.8: Integrate useCursorSync in Canvas**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Import:** useCursorSync hook
  - **Call:** const cursors = useCursorSync('global-canvas-v1', stageRef, currentUser)
  - **AI Prompt:** "Import useCursorSync in Canvas.tsx. After shapes hook, add const cursors = useCursorSync('global-canvas-v1', stageRef, currentUser from useAuth). This returns array of other users' cursors."

- [ ] **6.9: Render Cursors in Separate Layer**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Add:** Second Layer above shapes layer
  - **Render:** Map over cursors array, render Cursor component for each
  - **Reason:** Separate layer for performance (cursors update frequently)
  - **AI Prompt:** "In Canvas.tsx Stage, add a second Layer after the shapes Layer. In this cursor layer, map over cursors array and render Cursor component for each: cursors.map(c => <Cursor key={c.userId} x={c.x} y={c.y} name={c.name} color={c.color} />). Separate layer allows independent rendering for performance."

- [ ] **6.10: Memoize Cursor Component**
  
  - **Files to update:** `src/components/Cursor.tsx`
  - **Wrap:** Export React.memo(Cursor) with custom comparison
  - **Reason:** Prevent re-renders when props haven't changed
  - **AI Prompt:** "Wrap Cursor component export in React.memo: export default React.memo(Cursor, (prev, next) => prev.x === next.x && prev.y === next.y && prev.name === next.name && prev.color === next.color). This prevents unnecessary re-renders."

- [ ] **6.11: Test Cursor Sync**
  
  - Open 2 browsers
  - Move mouse in Browser 1 → cursor appears in Browser 2
  - Check latency with performance.now() timestamps (should be <50ms)
  - Close Browser 1 → cursor disappears in Browser 2
  - Open 3+ browsers → all cursors visible
  - **AI Prompt:** N/A (Manual multi-browser testing)

**PR Checklist:**

- [ ] Moving mouse shows cursor for other users
- [ ] Cursor has correct name and unique color
- [ ] Cursor updates <50ms latency
- [ ] No jitter or jumpiness in cursor movement
- [ ] Cursor disappears when user disconnects
- [ ] Own cursor not shown (only others)
- [ ] Cursors work with 5+ concurrent users
- [ ] No performance impact on canvas FPS
- [ ] Cursor colors match getUserColor utility
- [ ] TypeScript types correct

**Architecture Alignment:**
- ✅ Cursor type matches architecture.md Section 7
- ✅ 16ms throttling for 60fps as specified
- ✅ Separate Konva layer for performance
- ✅ onDisconnect cleanup per architecture.md Section 6
- ✅ React.memo optimization

---

## PR #7: Presence Awareness System

**Branch:** `feature/presence`  
**Goal:** Show online users list  
**Architecture Reference:** See `architecture.md` Section 1 (UserList component)  
**Est. Time:** 1.5-2 hours

### Tasks:

- [ ] **7.1: Create usePresence Hook**
  
  - **Files to create:** `src/hooks/usePresence.ts`
  - **Features:**
    - Set own presence in Realtime DB on mount
    - Listen to presence path (same structure as cursors)
    - Use onDisconnect() to remove presence
    - Return onlineUsers array
  - **AI Prompt:** "Create usePresence.ts hook. Takes canvasId, currentUser. On mount, write to rtdb ref(rtdb, `presence/${canvasId}/${userId}`) with {name, color, joinedAt: Date.now()}. Use onDisconnect().remove(). Listen to presence/${canvasId} with onValue, return array of online users. Clean up on unmount."

- [ ] **7.2: Integrate usePresence in App**
  
  - **Files to update:** `src/App.tsx`
  - **Call:** const onlineUsers = usePresence('global-canvas-v1', currentUser)
  - **Pass:** onlineUsers to Canvas or new UserList component
  - **AI Prompt:** "In App.tsx, import usePresence and useAuth. Call const onlineUsers = usePresence('global-canvas-v1', currentUser from useAuth). Pass onlineUsers as prop to Canvas or render UserList component."

- [ ] **7.3: Create UserList Component**
  
  - **Files to create:** `src/components/UserList.tsx`
  - **Props:** onlineUsers array
  - **Display:** List of users with colored dot + name
  - **Show:** User count (e.g., "3 users online")
  - **Styling:** Fixed position top-right, padding, background, rounded
  - **AI Prompt:** "Create UserList.tsx component. Props: onlineUsers (array). Render fixed-position container (top: 16px, right: 16px, background: white, padding: 16px, rounded, box-shadow). Show '{onlineUsers.length} users online' heading. Map over onlineUsers to show each: colored circle (10px, getUserColor) + name. Style with gap between items."

- [ ] **7.4: Add UserList to App**
  
  - **Files to update:** `src/App.tsx`
  - **Render:** UserList component as sibling to Canvas
  - **Position:** Will be fixed, so render order doesn't matter
  - **AI Prompt:** "In App.tsx inside AuthGuard, render <UserList onlineUsers={onlineUsers} /> after Canvas component. UserList uses fixed positioning so will overlay on canvas."

- [ ] **7.5: Style UserList**
  
  - **Files to update:** `src/components/UserList.tsx`
  - **Add:** Hover effects on user items
  - **Add:** Smooth transitions for join/leave
  - **Consider:** Collapse button if list gets long
  - **AI Prompt:** "In UserList.tsx, add CSS-in-JS or inline styles: user list items with hover effect (background: #f5f5f5), transition for opacity when users join/leave (CSS transition: opacity 0.3s ease). Limit height to 300px with scroll if > 10 users."

- [ ] **7.6: Add Join/Leave Notifications (Optional Enhancement)**
  
  - **Files to update:** `src/App.tsx` or create `src/components/Notification.tsx`
  - **Feature:** Show toast when users join/leave
  - **Display:** "[Name] joined" / "[Name] left" for 3 seconds
  - **AI Prompt:** "Create Notification.tsx component: fixed bottom-right, shows message for 3 seconds then fades out. In App.tsx, use useEffect to watch onlineUsers array changes, detect additions (join) or removals (leave), show notification. Use setTimeout to auto-dismiss after 3s."

- [ ] **7.7: Test Presence**
  
  - Open 3 browsers
  - Verify all 3 users show in each browser's list
  - Close Browser 1 → verify removed from list in Browsers 2 & 3
  - Refresh Browser 2 → verify stays in list
  - Check colors match cursor colors
  - **AI Prompt:** N/A (Manual testing)

**PR Checklist:**

- [ ] UserList shows all connected users
- [ ] User count is accurate
- [ ] Each user shows with name and colored dot
- [ ] Colors match cursor colors (same getUserColor)
- [ ] User appears in list when joining
- [ ] User disappears when leaving/closing browser
- [ ] User persists after page refresh
- [ ] List updates in real-time
- [ ] UI is clean and non-intrusive
- [ ] Works with 10+ concurrent users

**Architecture Alignment:**
- ✅ UserList component matches architecture.md diagram
- ✅ Uses same color utility as cursors
- ✅ Shares Realtime DB structure with cursors
- ✅ onDisconnect pattern for cleanup

---

## PR #8: Performance Optimization & Testing

**Branch:** `feature/performance-optimization`  
**Goal:** Ensure 60 FPS and handle edge cases  
**Architecture Reference:** See `architecture.md` Section 2 (Performance Architecture) & Section 9 (Performance Targets)  
**Est. Time:** 2-3 hours

### Tasks:

- [ ] **8.1: Add Performance Monitoring**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Improve:** FPS counter to show on-screen (not just console)
  - **Add:** Display in corner (dev mode only)
  - **Reference:** architecture.md Section 9 for FPS monitoring code
  - **AI Prompt:** "Update FPS counter in Canvas.tsx to render on-screen in dev mode. Add <div> in top-left corner (position: fixed, z-index: 1000) showing 'FPS: {fps}'. Only render if import.meta.env.DEV. Style with monospace font, semi-transparent background."

- [ ] **8.2: Optimize Rectangle Rendering**
  
  - **Files to update:** `src/components/Rectangle.tsx`
  - **Add:** React.memo with custom comparison
  - **Check:** Only re-render if x, y, isSelected, or isLocked changed
  - **AI Prompt:** "Wrap Rectangle component in React.memo with custom comparison function. Compare prev and next props: x, y, width, height, fill, isSelected, isLocked. Return true (skip re-render) if all match. This prevents unnecessary renders when other shapes update."

- [ ] **8.3: Test with Many Shapes**
  
  - **Goal:** Verify 60 FPS with 100+ shapes
  - **Method:** Modify createShape to add 10 shapes at once (test button)
  - **Measure:** FPS during pan, zoom, drag with 100+ shapes
  - **Target:** FPS should stay above 55
  - **AI Prompt:** "Add temporary 'Stress Test' button in Toolbar that calls createShape 100 times in a loop with random positions. Test FPS during pan/zoom/drag. Remove button before merging or keep in dev mode only."

- [ ] **8.4: Test with Multiple Concurrent Users**
  
  - **Goal:** Verify smooth operation with 5 users
  - **Method:** Open 5 browser windows, all users create/move shapes
  - **Check:** No lag, cursors smooth, locks work correctly
  - **Measure:** Network usage in Chrome DevTools
  - **AI Prompt:** N/A (Manual multi-browser testing)

- [ ] **8.5: Add Error Boundary**
  
  - **Files to create:** `src/components/ErrorBoundary.tsx`
  - **Features:** Catch errors, show fallback UI, log error
  - **Wrap:** Wrap App or Canvas in ErrorBoundary
  - **AI Prompt:** "Create ErrorBoundary.tsx class component with componentDidCatch. State: hasError (boolean), error (Error | null). If hasError, render fallback UI with error message and 'Reload' button. Otherwise render children. In App.tsx or main.tsx, wrap app with <ErrorBoundary>."

- [ ] **8.6: Add Loading Spinner Component**
  
  - **Files to create:** `src/components/Spinner.tsx`
  - **Content:** Simple CSS spinner (rotating circle)
  - **Usage:** Show while shapes are loading
  - **AI Prompt:** "Create Spinner.tsx component with centered loading spinner. Use CSS animation (rotating border). Accept optional size prop. Style with border-radius: 50%, border: 4px solid #f3f3f3, border-top: 4px solid #3498db, width/height from size prop (default 40px), animation: spin 1s linear infinite."

- [ ] **8.7: Handle Network Disconnects**
  
  - **Test:** Disconnect WiFi, verify error message shows
  - **Test:** Reconnect, verify shapes sync correctly
  - **Add:** Retry logic in useShapeSync if Firestore connection fails
  - **AI Prompt:** "In useShapeSync.ts, add error handling for onSnapshot. If error occurs, set error state. In Canvas, show error message with 'Retry' button that calls window.location.reload(). Test by disabling network in browser DevTools."

- [ ] **8.8: Test Edge Cases**
  
  - Rapid shape creation (spam click)
  - Simultaneous drag by 2 users (test locking)
  - Browser refresh during drag operation
  - Close browser mid-drag (test auto-unlock)
  - Delete shape while another user is dragging it
  - **AI Prompt:** N/A (Manual edge case testing)

- [ ] **8.9: Add Performance Profiling**
  
  - Use React DevTools Profiler
  - Use Chrome DevTools Performance tab
  - Record flamegraph during heavy interaction
  - Identify and optimize any bottlenecks
  - **AI Prompt:** N/A (Use browser DevTools)

- [ ] **8.10: Document Performance Characteristics**
  
  - **Files to update:** `README.md`
  - **Add:** Performance section with measured FPS, latency, max shapes tested
  - **Add:** Known limitations
  - **AI Prompt:** "Update README.md to add Performance section. Document: Measured FPS (60fps with 100+ shapes), cursor latency (<50ms), shape sync latency (<100ms), max concurrent users tested (5+), max shapes tested (500+). Add Known Limitations section."

**PR Checklist:**

- [ ] FPS counter shows 60fps in dev mode
- [ ] React.memo applied to Rectangle and Cursor
- [ ] Maintains 55+ FPS with 100+ shapes
- [ ] Smooth operation with 5 concurrent users
- [ ] ErrorBoundary catches and displays errors
- [ ] Loading spinner shows during initial load
- [ ] Network disconnect shows error + retry
- [ ] All edge cases handled gracefully
- [ ] No memory leaks (check Chrome Task Manager)
- [ ] Performance profiled and optimized

**Architecture Alignment:**
- ✅ Matches performance architecture in Section 2
- ✅ React.memo optimizations as specified
- ✅ Error handling patterns
- ✅ Meets performance targets in Section 9

---

## PR #9: Final Polish, Delete Feature & Documentation

**Branch:** `feature/final-polish`  
**Goal:** Production-ready MVP with complete CRUD  
**Architecture Reference:** All sections for final verification  
**Est. Time:** 2 hours

### Tasks:

- [ ] **9.1: Add Delete Shape Functionality**
  
  - **Files to update:** `src/hooks/useShapeSync.ts`
  - **Add:** deleteShape(shapeId) function that removes shape from Firestore array
  - **Check:** Cannot delete if locked by another user
  - **AI Prompt:** "Add deleteShape function to useShapeSync.ts. Takes shapeId. Check if shape.isLocked && shape.lockedBy !== currentUserId, if true return error. Otherwise, update Firestore document to remove shape from shapes array using arrayRemove or filter."

- [ ] **9.2: Add Delete Button to Toolbar**
  
  - **Files to update:** `src/components/UI/Toolbar.tsx`
  - **Add:** "Delete Selected" button (disabled if no selection)
  - **Wire up:** Call deleteShape(selectedId) when clicked
  - **AI Prompt:** "Add 'Delete Selected' button to Toolbar.tsx. Accept selectedId prop. Button disabled if !selectedId. On click, call onDeleteShape prop with selectedId. Style similar to 'Add Rectangle' button but with red background."

- [ ] **9.3: Integrate Delete in Canvas**
  
  - **Files to update:** `src/components/Canvas.tsx`
  - **Pass:** selectedId to Toolbar
  - **Pass:** deleteShape function as onDeleteShape prop
  - **Add:** Keyboard shortcut: Delete/Backspace key deletes selected shape
  - **AI Prompt:** "In Canvas.tsx, pass selectedId to Toolbar. Pass deleteShape function as onDeleteShape. Add useEffect with window keydown listener for 'Delete' or 'Backspace' key. If selectedId exists and key pressed, call deleteShape(selectedId). Clean up listener on unmount."

- [ ] **9.4: Update README with Complete Documentation**
  
  - **Files to update:** `README.md`
  - **Sections to add/update:**
    - Project description
    - Live demo URL
    - Features list
    - Setup instructions (clone, install, env vars, run, deploy)
    - Tech stack
    - Architecture overview (link to architecture.md)
    - Performance characteristics
    - Known limitations
    - Future enhancements (Phase 2)
    - Contributing guide (optional)
  - **AI Prompt:** "Create comprehensive README.md with: Title/description, live demo link, feature list (auth, canvas, shapes, real-time sync, object locking, cursors, presence), setup instructions (prerequisites, installation steps, env variables, run commands, deployment), tech stack, architecture link, performance specs, known limitations, future roadmap."

- [ ] **9.5: Clean Up Code**
  
  - Remove all console.logs (except errors)
  - Remove commented code
  - Remove debug/test features
  - Format all files consistently (Prettier)
  - Fix any remaining TypeScript warnings
  - **AI Prompt:** "Review all files and remove: console.logs (except console.error), commented code, unused imports, debug features. Run Prettier to format all files. Fix TypeScript warnings. Add missing types where `any` is used."

- [ ] **9.6: Verify All MVP Requirements**
  
  - Go through PRD.md 8 hard gate requirements
  - Test each systematically
  - Document results in checklist format
  - Fix any failures
  - **Requirements:**
    1. ✅ Canvas with pan/zoom
    2. ✅ Rectangle shapes
    3. ✅ Create/move/delete objects
    4. ✅ Object locking
    5. ✅ Real-time sync <100ms
    6. ✅ Multiplayer cursors <50ms with names/colors
    7. ✅ Presence awareness
    8. ✅ Authentication (email/password + Google)
    9. ✅ Deployed publicly
  - **AI Prompt:** N/A (Manual verification)

- [ ] **9.7: Run Full Test Suite**
  
  - **Scenario 1:** 2 users simultaneous editing
  - **Scenario 2:** User A locks shape, User B cannot move
  - **Scenario 3:** Browser refresh mid-edit, state persists
  - **Scenario 4:** Rapid shape creation
  - **Scenario 5:** 5 concurrent users stress test
  - **Scenario 6:** Create 100+ shapes, verify performance
  - **AI Prompt:** N/A (Manual scenario testing)

- [ ] **9.8: Final Deployment**
  
  - **Command:** `npm run build`
  - **Verify:** No build errors, check bundle size
  - **Command:** `firebase deploy`
  - **Test:** Open deployed URL, verify all features work
  - **Test:** Multi-user on deployed URL (not localhost)
  - **AI Prompt:** N/A (Manual deployment + testing)

- [ ] **9.9: Security Review**
  
  - Review Firebase Firestore rules (currently test mode)
  - Review Realtime Database rules (currently test mode)
  - **Add TODO comments:** Restrict to authenticated users in production
  - **Document:** Security improvements needed for production
  - **Files to create:** `firestore.rules`, `database.rules.json` with proper auth checks (for future)
  - **AI Prompt:** "Create firestore.rules file with: allow read, write: if request.auth != null; (authenticated only). Create database.rules.json with: '.read': 'auth != null', '.write': 'auth != null'. Document in README that test mode is used for MVP and production needs these rules deployed."

- [ ] **9.10: Final Git Commit & Tag**
  
  - **Commit:** All final changes with descriptive message
  - **Tag:** Create v1.0.0-mvp tag
  - **Push:** Push commits and tags to GitHub
  - **Verify:** GitHub repo is up to date
  - **Command:**
    ```bash
    git add .
    git commit -m "feat: complete MVP with all requirements"
    git tag v1.0.0-mvp
    git push origin main --tags
    ```
  - **AI Prompt:** N/A (Manual git commands)

**PR Checklist:**

- [ ] Delete functionality works (button + keyboard shortcut)
- [ ] Cannot delete locked shapes
- [ ] README is comprehensive and professional
- [ ] All code is clean (no debug artifacts)
- [ ] All 8 MVP requirements verified and passing
- [ ] Full test suite completed successfully
- [ ] Deployed to public URL and tested
- [ ] Security concerns documented
- [ ] Git tagged v1.0.0-mvp
- [ ] Ready for submission

**Architecture Alignment:**
- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ All components from architecture.md implemented
- ✅ All data models match specifications
- ✅ All performance targets met
- ✅ Production-ready (with noted security TODOs)

---

## MVP Completion Checklist

### Hard Gate Requirements:

- [ ] **1. Basic canvas with pan/zoom**
  - [ ] Canvas is 5000x5000px (virtual size)
  - [ ] Pan by dragging background
  - [ ] Zoom with mouse wheel (0.5x - 2x)
  - [ ] Zoom centers on cursor
  - [ ] 60 FPS during pan/zoom

- [ ] **2. Rectangle shapes**
  - [ ] Can create rectangles
  - [ ] Rectangles have gray fill (#3498db or similar)
  - [ ] Fixed size (150x100px)

- [ ] **3. Create, move, delete objects**
  - [ ] "Add Rectangle" button works
  - [ ] Can drag rectangles
  - [ ] Can delete with button or keyboard
  - [ ] Cannot delete locked shapes

- [ ] **4. Object locking**
  - [ ] First user to drag locks the shape
  - [ ] Locked shape shows visual indicator (red border)
  - [ ] Other users cannot move locked shape
  - [ ] Lock releases on drag end
  - [ ] Auto-unlock after 5 seconds if disconnect

- [ ] **5. Real-time sync <100ms**
  - [ ] Create shape → appears for all users <100ms
  - [ ] Move shape → updates for all users <100ms
  - [ ] Delete shape → removes for all users <100ms
  - [ ] Tested with 2+ browsers

- [ ] **6. Multiplayer cursors with names/colors**
  - [ ] See other users' cursors in real-time
  - [ ] Each cursor shows user's displayName
  - [ ] Each user has unique color
  - [ ] Cursor updates <50ms
  - [ ] Cursor disappears on disconnect

- [ ] **7. Presence awareness**
  - [ ] User list shows who's online
  - [ ] Shows user count
  - [ ] Updates when users join/leave
  - [ ] Colors match cursor colors

- [ ] **8. Authentication**
  - [ ] Can sign up with email/password/name
  - [ ] Can log in with email/password
  - [ ] Can sign in with Google
  - [ ] Display name shows correctly
  - [ ] Auth persists after refresh

- [ ] **9. Deployed publicly**
  - [ ] Hosted on Firebase Hosting (or similar)
  - [ ] Public URL works
  - [ ] Tested from multiple networks
  - [ ] 5+ concurrent users supported

### Performance Targets:

- [ ] 60 FPS during all interactions (pan, zoom, drag)
- [ ] Shape sync <100ms latency
- [ ] Cursor sync <50ms latency
- [ ] 100+ shapes without FPS drops
- [ ] 5+ concurrent users without degradation

### Testing Scenarios:

- [ ] **Scenario 1:** 2 users editing simultaneously
  - Both can create shapes
  - Both see each other's changes in real-time
  - Cursors show correctly

- [ ] **Scenario 2:** Object locking
  - User A drags shape → locks for User A
  - User B sees red border on User A's shape
  - User B cannot drag locked shape
  - Lock releases when User A stops dragging

- [ ] **Scenario 3:** State persistence
  - Create shapes
  - Refresh browser
  - All shapes still visible

- [ ] **Scenario 4:** Stress test
  - Create 100+ shapes
  - Pan/zoom remains smooth (55+ FPS)
  - All shapes sync correctly

- [ ] **Scenario 5:** Multi-user stress
  - 5 users create/move shapes simultaneously
  - No lag or errors
  - All cursors visible and smooth

---

## Time Tracking

| PR # | Feature | Estimated | Actual | Status |
|------|---------|-----------|--------|--------|
| 1 | Setup & Deploy | 1h | | ⬜ |
| 2 | Authentication | 2-3h | | ⬜ |
| 3 | Canvas Pan/Zoom | 2h | | ⬜ |
| 4 | Shapes Local | 2h | | ⬜ |
| 5 | Shape Sync + Locking | 3-4h | | ⬜ |
| 6 | Cursors | 3h | | ⬜ |
| 7 | Presence | 1.5-2h | | ⬜ |
| 8 | Performance | 2-3h | | ⬜ |
| 9 | Polish & Docs | 2h | | ⬜ |
| **Total** | | **20-24h** | | |

---

## Troubleshooting Guide

### Firebase Issues:

**"Firebase: Error (auth/configuration-not-found)"**
- Check `.env.local` has all VITE_FIREBASE_* variables
- Verify Firebase project is active in console
- Restart dev server after adding env variables

**"Permission denied" in Firestore/Realtime DB**
- Check rules are in test mode: allow read, write: if true;
- Verify Firebase Auth is initialized correctly

**Shapes not syncing**
- Check Firestore onSnapshot listener is active
- Check browser console for errors
- Verify canvasId is consistent ('global-canvas-v1')

### Performance Issues:

**FPS drops below 30**
- Check React.memo is applied to Rectangle/Cursor
- Verify separate Konva layers for shapes and cursors
- Profile with Chrome DevTools Performance tab
- Reduce number of shapes for testing

**Cursor lag**
- Verify throttling is working (16ms)
- Check Realtime DB latency in Network tab
- Test on better network connection

### Locking Issues:

**Shapes stay locked forever**
- Check auto-unlock timeout is working (5 seconds)
- Verify onDisconnect() is cleaning up locks
- Manually unlock in Firebase console if stuck

---

## Next Steps After MVP

1. **Security Hardening**
   - Update Firestore rules to restrict to authenticated users
   - Add user-level permissions
   - Implement rate limiting

2. **Additional Features** (Phase 2)
   - Multiple shape types (circles, text, lines)
   - Shape styling (colors, borders, shadows)
   - Resize and rotate functionality
   - Multi-select (shift-click)
   - Undo/redo system
   - AI agent integration

3. **Performance Optimizations**
   - Viewport culling (only render visible shapes)
   - Web Workers for heavy computations
   - IndexedDB caching
   - Virtual scrolling for large user lists

4. **Production Deployment**
   - Custom domain
   - Analytics tracking
   - Error logging (Sentry)
   - User feedback system

---

**Congratulations! You've built a production-ready real-time collaborative canvas with object locking.** 🎉

This is a solid foundation for Phase 2 features and AI integration.
