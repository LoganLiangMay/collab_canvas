# CollabCanvas MVP - Product Requirements Document

**Project:** CollabCanvas MVP - Real-Time Collaborative Canvas
**Timeline:** 24 hours (Due: Tuesday)
**Focus:** Bulletproof multiplayer infrastructure over features

---

## Executive Summary

Build a minimal Figma-like collaborative canvas where multiple users can create and move shapes in real-time. Success = solid multiplayer sync, not fancy features.

---

## User Stories

### User Type 1: Canvas Creator
**As a canvas creator**, I want to:
- Create a new canvas session that others can join
- Add basic shapes (rectangles) to my canvas
- Move shapes around by dragging them
- See where other users' cursors are in real-time
- Know who else is currently editing the canvas

### User Type 2: Collaborator
**As a collaborator**, I want to:
- Join an existing canvas by URL
- See all existing shapes immediately
- Create and move my own shapes
- See other users' changes appear instantly
- See other users' cursors with their names

### User Type 3: Returning User
**As a returning user**, I want to:
- See my previous work when I come back
- Not lose any shapes if I refresh the page
- Be able to leave and rejoin without breaking the canvas

---

## MVP Feature Requirements (Hard Gates)

### 1. Canvas Foundation
**What it does:** Large workspace you can navigate around

**Requirements:**
- Canvas area: 5000x5000px minimum
- Pan: Click and drag background to move viewport
- Zoom: Mouse wheel to zoom in/out (0.5x to 2x range is fine)
- 60 FPS performance during pan/zoom

**Acceptance Criteria:**
- ✅ Can drag canvas smoothly without lag
- ✅ Can zoom in/out without stuttering
- ✅ Frame rate stays above 55 FPS during movement

---

### 2. Shape Creation & Manipulation
**What it does:** Create and move rectangles

**Requirements:**
- ONE shape type: Rectangles
- Create: Click a "Add Rectangle" button, shape appears at center
- Move: Click and drag a rectangle to new position
- Select: Click a rectangle to select it (shows outline)
- Deselect: Click empty space to deselect

**Acceptance Criteria:**
- ✅ Rectangle appears when clicking add button
- ✅ Can drag selected rectangle smoothly
- ✅ Selection state is visually clear
- ✅ Multiple rectangles can exist on canvas

---

### 3. Real-Time Object Synchronization
**What it does:** All users see the same canvas state

**Requirements:**
- When User A creates a rectangle, User B sees it appear <100ms
- When User A moves a rectangle, User B sees it move <100ms
- Changes persist: refresh browser and shapes are still there
- Conflict resolution: Last edit wins (simpler is better)

**Acceptance Criteria:**
- ✅ Open canvas in 2 browsers, both users see same shapes
- ✅ Create shape in Browser 1, appears in Browser 2 within 100ms
- ✅ Move shape in Browser 1, updates in Browser 2 within 100ms
- ✅ Refresh browser, all shapes still visible

---

### 4. Multiplayer Cursors
**What it does:** See where other users are pointing

**Requirements:**
- Show cursor position for every connected user
- Each cursor has user's name as a label
- Each user gets a unique color
- Cursor updates <50ms (faster than object updates)

**Acceptance Criteria:**
- ✅ Open canvas in 2 browsers, see 2 cursors
- ✅ Move mouse in Browser 1, cursor moves in Browser 2 <50ms
- ✅ Each cursor shows the user's name
- ✅ Cursors have different colors

---

### 5. Presence Awareness
**What it does:** Know who's online

**Requirements:**
- List of currently connected users (name + color)
- Shows when users join/leave
- Updates in real-time

**Acceptance Criteria:**
- ✅ User list shows all connected users
- ✅ When user joins, they appear in list
- ✅ When user leaves, they disappear from list
- ✅ Can support 5+ concurrent users

---

### 6. User Authentication
**What it does:** Users have identities

**Requirements:**
- Users can sign up / log in
- Each user has a display name
- Login state persists (stay logged in after refresh)
- Simple as possible - no password reset, etc.

**Acceptance Criteria:**
- ✅ Can create account with name and password
- ✅ Can log in with credentials
- ✅ Name displays in cursor label and user list
- ✅ Stays logged in after refresh

---

### 7. State Persistence
**What it does:** Canvas survives disconnections

**Requirements:**
- All shapes saved to database
- Canvas state loads on page load
- Works even if all users disconnect

**Acceptance Criteria:**
- ✅ Create shapes, close all browsers, reopen → shapes still there
- ✅ Create shapes, refresh page → shapes still there
- ✅ User A creates shapes, User B joins → User B sees shapes

---

### 8. Deployment
**What it does:** Anyone can access it

**Requirements:**
- Hosted on public URL
- No setup required for users
- Handles 5+ concurrent users
- Stays up reliably

**Acceptance Criteria:**
- ✅ Works on public URL (not localhost)
- ✅ Works in multiple browsers simultaneously
- ✅ 5 people can use it at the same time
- ✅ Doesn't crash or disconnect randomly

---

## Tech Stack Recommendations

### Option 1: React + Konva.js + Firebase (RECOMMENDED)

**Frontend:**
- **React**: UI framework
- **Konva.js**: Canvas rendering library (handles shapes, drag-drop, events)
- **TypeScript**: Type safety (optional but helpful)

**Backend:**
- **Firebase Firestore**: Database for shapes (persistent storage)
- **Firebase Realtime Database**: Cursor positions (fast ephemeral data)
- **Firebase Authentication**: User accounts
- **Firebase Hosting**: Deployment

**Why this stack:**
- ✅ Fastest path to working multiplayer
- ✅ Firebase handles real-time sync for you
- ✅ Konva abstracts canvas complexity
- ✅ No backend code to write
- ✅ Free tier is sufficient for MVP
- ✅ Deploy in one command

**Pitfalls to watch:**
- ⚠️ **Firebase read/write costs**: Cursor movements cost money. Solution: Throttle cursor updates to 60fps max (every 16ms), use Realtime DB not Firestore for cursors
- ⚠️ **Bundle size**: Konva + React + Firebase = ~300kb. Solution: Accept it for MVP, optimize later
- ⚠️ **React re-renders**: Moving shapes can cause lag. Solution: Use React.memo, separate cursor layer
- ⚠️ **Firestore latency**: Can be 100-200ms for writes. Solution: Optimistic updates (update UI immediately, sync in background)
- ⚠️ **Learning curve**: If you don't know Konva, budget 2-3 hours to learn basics
- ⚠️ **Concurrent edits**: Firestore doesn't lock documents. Solution: Last-write-wins with timestamp (acceptable for MVP)

**Estimated time breakdown:**
- Setup: 1 hour
- Canvas basics: 2 hours
- Shapes + drag: 2 hours
- Firebase integration: 3 hours
- Auth: 2 hours
- Multiplayer cursors: 3 hours
- Testing + deploy: 2 hours
- **Total: ~15 hours** (leaves 9 hours buffer)

---

### Option 2: React + Fabric.js + Supabase

**Frontend:**
- **React**: UI framework
- **Fabric.js**: Canvas library (more features than Konva)

**Backend:**
- **Supabase**: PostgreSQL database with real-time subscriptions
- **Supabase Auth**: User accounts
- **Vercel**: Deployment

**Why consider this:**
- ✅ Fabric.js has more built-in shape types
- ✅ PostgreSQL if you need complex queries later
- ✅ More control than Firebase
- ✅ Open source alternative

**Pitfalls to watch:**
- ⚠️ **Supabase real-time is slower** than Firebase Realtime DB (~100-150ms vs ~30-50ms)
- ⚠️ **Fabric.js is heavier** than Konva (~400kb vs ~150kb)
- ⚠️ **More configuration** required (database schema, RLS policies)
- ⚠️ **Cursor latency** may not meet <50ms requirement

**Estimated time: ~18 hours** (3 hours extra for setup/config)

**Verdict:** Only choose if you already know Supabase well

---

### Option 3: Vanilla JS + HTML5 Canvas + WebSocket Server

**Frontend:**
- **Vanilla JavaScript**: No framework
- **HTML5 Canvas API**: Direct canvas manipulation

**Backend:**
- **Node.js + Socket.io**: WebSocket server
- **PostgreSQL or MongoDB**: Database
- **Custom auth**: JWT tokens
- **Heroku/Render**: Deployment

**Why consider this:**
- ✅ Maximum performance (no framework overhead)
- ✅ Full control over everything
- ✅ Smallest bundle size

**Pitfalls to watch:**
- ⚠️ **Most work**: You build everything from scratch
- ⚠️ **Backend code**: Need to write server, handle disconnects, manage state
- ⚠️ **Auth complexity**: Manual JWT implementation
- ⚠️ **No offline support**: More code to handle
- ⚠️ **Deployment**: Need to manage server, not just static hosting

**Estimated time: ~24+ hours** (no buffer, high risk)

**Verdict:** Only for experienced full-stack devs who want control

---

## FINAL RECOMMENDATION: React + Konva + Firebase

**Reasons:**
1. You'll spend more time on multiplayer sync (the hard part) and less on boilerplate
2. Firebase real-time is proven for this use case (Figma's early version used Firebase)
3. Konva handles canvas complexity you don't want to deal with
4. Free tier covers MVP needs
5. Deploy in minutes, not hours

**Mitigations for pitfalls:**
- Throttle cursor updates to 60fps
- Use Realtime DB for cursors, Firestore for shapes
- Implement optimistic updates
- Profile performance early and often

---

## Out of Scope for MVP

### ❌ NOT Building (Save for Later)

**Canvas Features:**
- Multiple shape types (circles, lines, text) - stick to rectangles only
- Shape styling (colors, borders, shadows)
- Resize handles - no resizing, fixed size rectangles
- Rotation - no rotating shapes
- Multi-select (shift+click multiple shapes)
- Copy/paste, duplicate
- Delete shapes - if needed, can add as stretch goal
- Layers panel
- Undo/redo
- Keyboard shortcuts
- Grid/snap to grid
- Export/download

**Collaboration Features:**
- Chat or comments
- User avatars
- Permissions (view-only users)
- Multiple canvases per user
- Canvas sharing links
- Version history

**Performance Optimizations:**
- Rendering only visible shapes (viewport culling)
- Web Workers for background processing
- Canvas virtualization
- IndexedDB caching

**Polish:**
- Loading states
- Error messages
- Mobile support
- Responsive design
- Dark mode
- Onboarding tutorial

**The Rule:** If it's not in the 8 hard gate requirements, don't build it.

---

## Step-by-Step Implementation Guide for Claude Code

### Phase 1: Project Setup (Hour 0-1)

**Step 1.1: Initialize React Project**
```bash
npx create-react-app collabcanvas --template typescript
cd collabcanvas
npm install konva react-konva firebase
```

**Step 1.2: Firebase Project Setup**
1. Go to firebase.google.com
2. Create new project "collabcanvas-mvp"
3. Enable Authentication → Email/Password
4. Create Firestore Database → Start in test mode
5. Create Realtime Database → Start in test mode
6. Copy Firebase config

**Step 1.3: Create Firebase Config File**
```typescript
// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // Paste your config here
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
```

**Step 1.4: Deploy Empty App**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

✅ **Checkpoint:** You have a deployed React app with Firebase connected

---

### Phase 2: Basic Canvas (Hour 1-3)

**Step 2.1: Create Canvas Component**
```typescript
// src/components/Canvas.tsx
import { Stage, Layer } from 'react-konva';
import { useState } from 'react';

export default function Canvas() {
  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });
  const [stageScale, setStageScale] = useState(1);

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();
    
    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    setStageScale(newScale);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable
      onWheel={handleWheel}
      x={stagePos.x}
      y={stagePos.y}
      scaleX={stageScale}
      scaleY={stageScale}
      onDragEnd={(e) => setStagePos({ x: e.target.x(), y: e.target.y() })}
    >
      <Layer>
        {/* Shapes will go here */}
      </Layer>
    </Stage>
  );
}
```

**Step 2.2: Add Rectangle Shape**
```typescript
// src/components/Rectangle.tsx
import { Rect } from 'react-konva';

interface RectangleProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  onDragEnd: (id: string, x: number, y: number) => void;
}

export default function Rectangle({ id, x, y, width, height, fill, onDragEnd }: RectangleProps) {
  return (
    <Rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={fill}
      draggable
      onDragEnd={(e) => onDragEnd(id, e.target.x(), e.target.y())}
    />
  );
}
```

**Step 2.3: Test Local Canvas**
Add button to create rectangles, test drag and zoom

✅ **Checkpoint:** Canvas pans, zooms, and can create/move rectangles locally

---

### Phase 3: Authentication (Hour 3-5)

**Step 3.1: Create Auth Context**
```typescript
// src/contexts/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
  };

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
```

**Step 3.2: Create Login/Signup Form**
Simple form with email, password, name fields

**Step 3.3: Protect Canvas Route**
Show login form if not authenticated, show canvas if authenticated

✅ **Checkpoint:** Users can sign up, log in, and stay logged in after refresh

---

### Phase 4: Firestore Shape Sync (Hour 5-9)

**Step 4.1: Define Firestore Schema**
```typescript
// Firestore structure:
// canvases/{canvasId}/shapes/{shapeId}
// {
//   id: string,
//   type: 'rectangle',
//   x: number,
//   y: number,
//   width: number,
//   height: number,
//   fill: string,
//   userId: string,
//   createdAt: timestamp
// }
```

**Step 4.2: Create Shape Sync Hook**
```typescript
// src/hooks/useShapeSync.ts
import { useEffect, useState } from 'react';
import { collection, onSnapshot, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export function useShapeSync(canvasId: string) {
  const [shapes, setShapes] = useState<any[]>([]);

  useEffect(() => {
    const shapesRef = collection(db, 'canvases', canvasId, 'shapes');
    
    const unsubscribe = onSnapshot(shapesRef, (snapshot) => {
      const newShapes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setShapes(newShapes);
    });

    return unsubscribe;
  }, [canvasId]);

  const createShape = async (shape: any) => {
    const shapesRef = collection(db, 'canvases', canvasId, 'shapes');
    await addDoc(shapesRef, shape);
  };

  const updateShape = async (shapeId: string, updates: any) => {
    const shapeRef = doc(db, 'canvases', canvasId, 'shapes', shapeId);
    await updateDoc(shapeRef, updates);
  };

  return { shapes, createShape, updateShape };
}
```

**Step 4.3: Integrate with Canvas**
- Replace local state with Firestore shapes
- Create button calls `createShape`
- Drag end calls `updateShape`
- Render shapes from `shapes` array

**Step 4.4: Test Multi-Browser**
Open in 2 browsers, create shapes, verify both see updates

✅ **Checkpoint:** Shapes sync between browsers in <100ms

---

### Phase 5: Multiplayer Cursors (Hour 9-14)

**Step 5.1: Setup Realtime Database Structure**
```typescript
// Realtime Database structure:
// cursors/{canvasId}/{userId}
// {
//   x: number,
//   y: number,
//   name: string,
//   color: string,
//   timestamp: number
// }
```

**Step 5.2: Create Cursor Sync Hook**
```typescript
// src/hooks/useCursorSync.ts
import { useEffect, useState } from 'react';
import { ref, onValue, set, onDisconnect } from 'firebase/database';
import { rtdb } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function useCursorSync(canvasId: string, stageRef: any) {
  const [cursors, setCursors] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const cursorsRef = ref(rtdb, `cursors/${canvasId}`);
    
    // Listen to all cursors
    const unsubscribe = onValue(cursorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const cursorArray = Object.entries(data)
          .filter(([userId]) => userId !== user.uid)
          .map(([userId, cursor]) => ({ userId, ...(cursor as any) }));
        setCursors(cursorArray);
      }
    });

    // Update own cursor on mouse move
    let lastUpdate = 0;
    const handleMouseMove = () => {
      const now = Date.now();
      if (now - lastUpdate < 16) return; // Throttle to 60fps
      lastUpdate = now;

      const stage = stageRef.current;
      if (!stage) return;

      const pointer = stage.getPointerPosition();
      if (!pointer) return;

      const userCursorRef = ref(rtdb, `cursors/${canvasId}/${user.uid}`);
      set(userCursorRef, {
        x: pointer.x,
        y: pointer.y,
        name: user.displayName,
        color: getUserColor(user.uid),
        timestamp: Date.now()
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Remove cursor on disconnect
    const userCursorRef = ref(rtdb, `cursors/${canvasId}/${user.uid}`);
    onDisconnect(userCursorRef).remove();

    return () => {
      unsubscribe();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [canvasId, user, stageRef]);

  return cursors;
}

function getUserColor(userId: string): string {
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8'];
  const index = userId.charCodeAt(0) % colors.length;
  return colors[index];
}
```

**Step 5.3: Render Cursors**
```typescript
// src/components/Cursor.tsx
import { Circle, Text, Group } from 'react-konva';

interface CursorProps {
  x: number;
  y: number;
  name: string;
  color: string;
}

export default function Cursor({ x, y, name, color }: CursorProps) {
  return (
    <Group x={x} y={y}>
      <Circle radius={5} fill={color} />
      <Text text={name} fontSize={12} fill={color} x={10} y={-5} />
    </Group>
  );
}
```

**Step 5.4: Add Cursors to Canvas**
Render cursor components in separate Konva Layer

✅ **Checkpoint:** Cursors sync between browsers with <50ms latency

---

### Phase 6: Presence System (Hour 14-16)

**Step 6.1: Track Online Users**
```typescript
// src/hooks/usePresence.ts
import { useEffect, useState } from 'react';
import { ref, onValue, set, onDisconnect } from 'firebase/database';
import { rtdb } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export function usePresence(canvasId: string) {
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const presenceRef = ref(rtdb, `presence/${canvasId}`);
    
    // Listen to presence
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const users = Object.entries(data).map(([userId, info]) => ({
          userId,
          ...(info as any)
        }));
        setOnlineUsers(users);
      }
    });

    // Set own presence
    const userPresenceRef = ref(rtdb, `presence/${canvasId}/${user.uid}`);
    set(userPresenceRef, {
      name: user.displayName,
      color: getUserColor(user.uid),
      joinedAt: Date.now()
    });

    // Remove on disconnect
    onDisconnect(userPresenceRef).remove();

    return unsubscribe;
  }, [canvasId, user]);

  return onlineUsers;
}
```

**Step 6.2: Create User List UI**
Simple sidebar showing online users with colored dots

✅ **Checkpoint:** User list shows who's online, updates on join/leave

---

### Phase 7: Testing & Polish (Hour 16-22)

**Step 7.1: Test Scenarios**
- 2 browsers simultaneous editing ✓
- Refresh browser mid-edit ✓
- Create 10+ shapes rapidly ✓
- Measure FPS during interaction ✓
- Test with 3-4 users ✓

**Step 7.2: Performance Check**
```typescript
// Add FPS counter
let lastTime = performance.now();
let frames = 0;
function checkFPS() {
  frames++;
  const now = performance.now();
  if (now >= lastTime + 1000) {
    console.log('FPS:', frames);
    frames = 0;
    lastTime = now;
  }
  requestAnimationFrame(checkFPS);
}
checkFPS();
```

**Step 7.3: Handle Edge Cases**
- User disconnects mid-drag
- Network error handling
- Empty state (no shapes yet)

**Step 7.4: Final Deploy**
```bash
npm run build
firebase deploy
```

✅ **Checkpoint:** All 8 hard gate requirements pass

---

### Phase 8: Buffer Time (Hour 22-24)

**Use this time for:**
- Bug fixes discovered during testing
- Improving error messages
- Adding a delete button if time permits
- Documentation (README with setup instructions)
- Recording demo video if required

---

## Testing Checklist

Before submitting, verify:

- [ ] Canvas pans smoothly (click-drag background)
- [ ] Canvas zooms smoothly (mouse wheel)
- [ ] Can create rectangles
- [ ] Can drag rectangles
- [ ] Open 2 browsers, both see same canvas
- [ ] Create shape in Browser 1, appears in Browser 2 <100ms
- [ ] Move shape in Browser 1, updates in Browser 2 <100ms
- [ ] Refresh browser, shapes persist
- [ ] Cursors show in both browsers with names
- [ ] Cursor movement <50ms latency
- [ ] User list shows all connected users
- [ ] User joins, appears in list
- [ ] User leaves, disappears from list
- [ ] Can sign up with email/password/name
- [ ] Can log in
- [ ] Stays logged in after refresh
- [ ] Works on deployed URL (not localhost)
- [ ] 5 people can use simultaneously

---

## Common Issues & Solutions

### Issue: Shapes lag when moving
**Solution:** Use optimistic updates - update local state immediately, then sync

### Issue: Cursors are jumpy
**Solution:** Throttle updates to 16ms (60fps), not every mousemove event

### Issue: Firebase quota exceeded
**Solution:** 
- Use Realtime DB for cursors (cheaper)
- Throttle cursor updates
- Don't store every mouse position

### Issue: Canvas performance drops below 60 FPS
**Solution:**
- Separate cursors into their own Konva layer
- Use React.memo on shape components
- Check Chrome DevTools Performance tab

### Issue: Shapes don't appear for other users
**Solution:**
- Check Firestore rules (make sure they're set to test mode)
- Verify onSnapshot listener is active
- Check browser console for errors

### Issue: Authentication doesn't persist
**Solution:**
- Verify Firebase config is correct
- Check that onAuthStateChanged is set up
- Clear browser cache and cookies

---

## Success Criteria

### MVP Passes If:
✅ All 8 hard gate requirements work
✅ <100ms object sync latency
✅ <50ms cursor sync latency  
✅ 60 FPS performance
✅ 5+ concurrent users supported
✅ Deployed and publicly accessible

### MVP Fails If:
❌ Sync is broken or inconsistent
❌ Cursors don't show or lag >100ms
❌ Canvas doesn't persist shapes
❌ FPS drops below 30
❌ App crashes with multiple users
❌ Not deployed publicly

---

**Next Steps:**
1. Review this PRD
2. Make tech stack decision
3. Start Phase 1 setup
4. Follow step-by-step guide
5. Test continuously
6. Deploy early and often

