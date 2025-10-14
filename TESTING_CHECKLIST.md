# Testing Checklist for Error Fixes and FPS Counter

## Quick Start
```bash
cd /Applications/Gauntlet/collab_canvas/collabcanvas
npm run dev
```

Then open: http://localhost:5174 (or the port shown in terminal)

## ✅ Visual Verification (30 seconds)

1. **FPS Counter** (Bottom-left corner)
   - [ ] Green "FPS: XX" text visible
   - [ ] Updates every second
   - [ ] Shows ~60 FPS on most displays

2. **Debug Panel** (Development mode only)
   - [ ] 🐛 button visible just above FPS counter
   - [ ] Click to open debug panel
   - [ ] Panel shows error statistics

## ✅ Basic Delete Tests (2 minutes)

### Test 1: Normal Delete with Keyboard
1. [ ] Click "Add Rectangle" button
2. [ ] Click on the shape to select it (blue border appears)
3. [ ] Press `Delete` or `Backspace` key
4. [ ] **Expected**: Green toast "Shape deleted successfully"
5. [ ] **Expected**: Shape disappears
6. [ ] **Check Debug Panel**: Should log the deletion

### Test 2: Normal Delete with Button
1. [ ] Add a rectangle
2. [ ] Select it
3. [ ] Click "Delete Selected" button (red button in toolbar)
4. [ ] **Expected**: Green toast "Shape deleted successfully"
5. [ ] **Expected**: Shape disappears

### Test 3: Rapid Delete Prevention
1. [ ] Add a rectangle and select it
2. [ ] Rapidly press Delete key 5 times quickly
3. [ ] **Expected**: Only one delete happens
4. [ ] **Expected**: No errors in browser console (F12)
5. [ ] **Check Debug Panel**: May show one warning about delete in progress

## ✅ Race Condition Tests (3 minutes)

### Test 4: Simultaneous Delete (Two Browser Tabs)
1. [ ] Open app in Tab 1
2. [ ] Open app in Tab 2 (same URL)
3. [ ] In Tab 1: Create a rectangle
4. [ ] In Tab 2: Wait for rectangle to appear (real-time sync)
5. [ ] In both tabs: Select the same rectangle
6. [ ] In Tab 1: Press Delete
7. [ ] Immediately in Tab 2: Press Delete
8. [ ] **Expected in Tab 2**: Orange warning toast "Shape was already deleted"
9. [ ] **Expected**: No errors, both tabs still work
10. [ ] **Check Debug Panel**: Should log the warning

### Test 5: Delete Already-Deleted Shape
1. [ ] Create a shape
2. [ ] Select and delete it
3. [ ] Before selection clears, rapidly try to select the disappearing shape
4. [ ] If you manage to select it, try to delete again
5. [ ] **Expected**: Warning message or graceful handling
6. [ ] **Expected**: No application crash

## ✅ Toast Notification Tests (1 minute)

### Test 6: Toast Behavior
1. [ ] Delete a shape
2. [ ] **Verify**: Toast appears in top-right corner
3. [ ] **Verify**: Toast auto-dismisses after 3 seconds
4. [ ] Delete another shape
5. [ ] Quickly click the X button on toast
6. [ ] **Verify**: Toast closes immediately

## ✅ Error Logging Tests (2 minutes)

### Test 7: Debug Panel Features
1. [ ] Open Debug Panel (click 🐛 button)
2. [ ] **Verify**: Shows error/warning counts
3. [ ] Perform various operations (create, delete shapes)
4. [ ] **Verify**: Logs appear in the panel in real-time
5. [ ] Click "All" tab - see all logs
6. [ ] Click "Errors" tab - see only errors
7. [ ] Click "Warnings" tab - see only warnings
8. [ ] Click "Export" button
9. [ ] **Verify**: JSON file downloads with logs
10. [ ] Click "Clear" button and confirm
11. [ ] **Verify**: Logs are cleared

### Test 8: Error Context
1. [ ] In Debug Panel, find any error log
2. [ ] Click "View context" dropdown
3. [ ] **Verify**: Shows additional context (shape ID, etc.)
4. [ ] If stack trace available, click "View stack trace"
5. [ ] **Verify**: Shows error stack

## ✅ Network Error Tests (2 minutes)

### Test 9: Offline Behavior
1. [ ] Open browser DevTools (F12)
2. [ ] Go to Network tab
3. [ ] Select "Offline" from throttling dropdown
4. [ ] Try to create a shape
5. [ ] **Expected**: Error toast appears
6. [ ] **Expected**: Error logged in Debug Panel
7. [ ] Set network back to "Online"
8. [ ] **Verify**: App recovers and works normally
9. [ ] Try creating/deleting shapes again
10. [ ] **Expected**: Everything works

## ✅ Performance Tests (1 minute)

### Test 10: FPS Under Load
1. [ ] Note current FPS (should be ~60)
2. [ ] Click "Stress Test (100 shapes)" button (only in dev mode)
3. [ ] Wait for 100 shapes to be created
4. [ ] **Monitor FPS**: Should stay above 30 FPS
5. [ ] Try panning the canvas (click and drag background)
6. [ ] Try zooming (scroll wheel)
7. [ ] **Verify**: FPS counter updates correctly
8. [ ] **Verify**: No significant lag

### Test 11: Multiple Operations
1. [ ] Create 5-10 shapes quickly
2. [ ] Delete them all one by one
3. [ ] **Monitor FPS**: Should remain stable
4. [ ] **Check Debug Panel**: All operations logged
5. [ ] **Verify**: No memory leaks (DevTools → Memory)

## ✅ Browser Console Check (1 minute)

### Test 12: Console Logs
1. [ ] Open browser console (F12 → Console)
2. [ ] Perform various operations
3. [ ] **Expected logs** (in brackets):
   - `[SHAPE CREATED]` - when adding
   - `[DELETE]` - when deleting
   - `[deleteShape]` - Firestore operation
4. [ ] **No red errors** for normal operations
5. [ ] **Yellow warnings** are OK for race conditions

## ✅ Multi-User Collaboration (3 minutes)

### Test 13: Real-Time Sync
1. [ ] Open app in two browser windows side-by-side
2. [ ] In Window 1: Create a rectangle
3. [ ] In Window 2: **Verify** rectangle appears immediately
4. [ ] In Window 1: Drag the rectangle
5. [ ] In Window 2: **Verify** rectangle moves in real-time
6. [ ] In Window 2: Delete the rectangle
7. [ ] In Window 1: **Verify** rectangle disappears
8. [ ] **Check both Debug Panels**: Both should log the deletion

## 🎯 Success Criteria

All tests should pass with:
- ✅ No application crashes
- ✅ No uncaught errors in console
- ✅ FPS counter always visible and updating
- ✅ Toast notifications appear and dismiss correctly
- ✅ Debug panel logs all operations
- ✅ Graceful handling of race conditions
- ✅ No memory leaks
- ✅ Real-time sync works correctly

## 🐛 Bug Reporting

If you encounter any issues:

1. **Check Debug Panel**: Review error logs
2. **Export Logs**: Click "Export" button in Debug Panel
3. **Browser Console**: Take screenshots of any red errors
4. **Reproduction Steps**: Document exactly what you did
5. **Environment**: Note browser version, OS, network status

## 📊 Expected Error Logs (Normal Operation)

These are NORMAL and expected:
- ⚠️ "Shape was already deleted by another user" - Race condition handled
- ⚠️ "Delete already in progress" - Double-delete prevented
- ⚠️ "Shape not found in local state" - Sync timing issue

These are PROBLEMS:
- ❌ "Permission denied" - Check Firestore rules
- ❌ "Failed to delete shape" (not not-found) - Check network
- ❌ "Uncaught exception" - Bug in code

## 🚀 Quick Smoke Test (30 seconds)

If you're short on time, just do this:
1. [ ] FPS counter visible? ✅
2. [ ] Debug panel opens? ✅
3. [ ] Add shape → works? ✅
4. [ ] Select shape → blue border? ✅
5. [ ] Delete shape → green toast? ✅
6. [ ] No red errors in console? ✅

If all ✅, you're good to go! 🎉



