# PR #6: Multiplayer Cursors - Testing Guide

## ✅ What Was Implemented

### Features
- ✅ Real-time cursor position synchronization
- ✅ Throttled updates (16ms = 60fps max)
- ✅ Color-coded cursors (consistent per user)
- ✅ User name labels next to cursors
- ✅ Auto-cleanup when users disconnect
- ✅ Separate rendering layer for performance
- ✅ Cursor coordinates account for pan/zoom

### Files Created
1. `src/types/cursor.types.ts` - Type definitions
2. `src/utils/colorUtils.ts` - Color assignment & throttle utility
3. `src/hooks/useCursorSync.ts` - Realtime cursor sync hook
4. `src/components/Cursor.tsx` - Visual cursor component

### Files Modified
1. `src/components/Canvas.tsx` - Integrated cursor tracking

---

## 🧪 How to Test

### Prerequisites
1. **Firebase Realtime Database Rules** must be set up (see `FIREBASE_REALTIME_DB_RULES.md`)
2. App must be running with valid Firebase credentials
3. Need at least 2 browser windows/tabs for testing

### Testing Steps

#### 1. Start the Development Server
```bash
cd collabcanvas
npm run dev
```

#### 2. Open Multiple Browser Windows

**Option A: Two Tabs (Same Browser)**
- Open http://localhost:5173 in two tabs
- Sign in with different accounts in each tab

**Option B: Two Browsers (Recommended)**
- Open http://localhost:5173 in Chrome and Firefox
- Sign in with different accounts
- This better simulates real multiplayer

**Option C: Incognito + Regular Window**
- Regular window: Sign in as User A
- Incognito window: Sign in as User B

#### 3. Test Cursor Tracking

**Test 1: Basic Cursor Visibility**
- [ ] Move mouse in Window 1
- [ ] Verify cursor appears in Window 2
- [ ] Cursor should have:
  - Colored arrow pointer
  - User name label
  - Smooth movement

**Test 2: Multiple Users**
- [ ] Move mouse in both windows simultaneously
- [ ] Each user should see the other's cursor
- [ ] Cursors should have different colors
- [ ] Each cursor shows correct user name

**Test 3: Pan/Zoom Coordination**
- [ ] Zoom in/out in Window 1 (mouse wheel)
- [ ] Move cursor in Window 2
- [ ] Verify cursor position is correct in both windows
- [ ] Pan canvas in Window 1 (drag background)
- [ ] Move cursor in Window 2
- [ ] Cursor should still track correctly

**Test 4: Performance**
- [ ] Move mouse rapidly in circles
- [ ] Cursor updates should be smooth (60fps)
- [ ] No lag or stuttering
- [ ] Canvas still responds to other interactions

**Test 5: Auto-Cleanup**
- [ ] Move cursor in Window 2
- [ ] Close Window 2 (or refresh)
- [ ] Cursor should disappear from Window 1 within ~5 seconds

**Test 6: Cursor Colors**
- [ ] Sign in as different users in 3+ windows
- [ ] Each user should get a distinct, consistent color
- [ ] Same user = same color across sessions

**Test 7: Shape Interaction**
- [ ] Move cursor over shapes
- [ ] Cursor tracking should not interfere with:
  - Clicking shapes
  - Dragging shapes
  - Shape selection
  - Object locking

---

## 🔍 Expected Behavior

### Cursor Appearance
- **Arrow pointer**: Small colored arrow at cursor position
- **User label**: Name displayed to the right of cursor
- **Color**: Consistent color per user (from 15-color palette)

### Cursor Movement
- **Smooth**: 60fps tracking
- **Throttled**: Updates sent every 16ms max
- **Accurate**: Position accounts for canvas pan/zoom

### Cursor Lifecycle
- **Appears**: When user moves mouse on canvas
- **Updates**: As user moves mouse
- **Disappears**: When user leaves/disconnects

---

## 🐛 Common Issues & Solutions

### Issue 1: Cursors Not Appearing
**Symptoms**: Can't see other users' cursors  
**Solutions**:
1. Check Firebase Realtime Database rules are set up
2. Verify both users are signed in
3. Check browser console for errors
4. Ensure `VITE_FIREBASE_DATABASE_URL` is set in `.env`

### Issue 2: Cursor Position Wrong
**Symptoms**: Cursor appears in wrong location  
**Solutions**:
1. Verify pan/zoom state is synchronized
2. Check that canvas coordinates are calculated correctly
3. Refresh both browser windows

### Issue 3: Cursors Lag or Stutter
**Symptoms**: Choppy cursor movement  
**Solutions**:
1. Check network connection
2. Verify throttling is working (16ms)
3. Check if there are many shapes (performance issue)
4. Open browser dev tools → Performance tab

### Issue 4: Cursors Don't Disappear
**Symptoms**: Old cursors remain after user leaves  
**Solutions**:
1. Check `onDisconnect()` handler is set up
2. Wait ~5 seconds for Firebase to detect disconnect
3. Manually remove cursor data in Firebase console

---

## 📊 Performance Metrics

### Expected Performance
- **Cursor Update Rate**: 60fps max (16ms throttle)
- **Network Traffic**: ~60 updates/sec per user
- **Latency**: < 100ms for cursor updates
- **Memory**: Minimal (one cursor object per user)

### How to Monitor
1. **Browser DevTools**: Console → filter for `[useCursorSync]`
2. **Firebase Console**: Realtime Database → Data tab → watch `cursors/`
3. **Network Tab**: Monitor WebSocket traffic to Firebase

---

## ✅ Acceptance Criteria

- [x] Code builds without errors
- [ ] Cursors appear in real-time across multiple users
- [ ] Each user gets a unique, consistent color
- [ ] User names display next to cursors
- [ ] Cursor position accounts for pan/zoom
- [ ] Updates are smooth (60fps)
- [ ] Cursors auto-cleanup on disconnect
- [ ] No interference with shape interactions
- [ ] No performance degradation

---

## 🎯 Next Steps

Once PR #6 is tested and working:
- Mark PR #6 as complete
- Move to **PR #7: Presence System** (show active users list)
- Or continue with other multiplayer features from the roadmap

---

## 📝 Notes

- Cursors use Firebase Realtime Database (not Firestore) for lower latency
- Cursor updates are throttled client-side to 16ms
- Cursors render in a separate Konva layer for performance
- Each user's color is deterministic based on their user ID
- System supports unlimited users, but UI may get crowded with 10+ cursors

---

**Ready to test?** Fire up two browser windows and watch those cursors dance! 🎉


