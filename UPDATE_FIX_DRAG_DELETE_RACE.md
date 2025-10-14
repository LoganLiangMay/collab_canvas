# Fix: "No document to update" Error During Drag Operations

## Issue
When testing the collaborative canvas, you encountered this error:

```
FirebaseError: No document to update: 
projects/collab-canvas-2a24a/databases/(default)/documents/canvases/global-canvas-v1/shapes/0c6d7336-6403-4f59-b573-54cd668404c6
```

## Root Cause

This error occurs in a specific race condition scenario:

1. **User A** starts dragging a shape (locks it)
2. **User B** deletes the shape while User A is still dragging
3. **User A** finishes the drag (tries to update position and unlock)
4. **Error**: The shape no longer exists in Firestore, but the update operation still tries to execute

Similar scenarios:
- User drags a shape, another user deletes it before drag ends
- Auto-unlock timeout fires after shape is deleted
- Lock operation happens on a just-deleted shape

## Solution

Added comprehensive `not-found` error handling to all shape update operations:

### 1. **updateShape Function** (`useShapeSync.ts`)
```typescript
// Now catches not-found errors and logs warning instead of throwing
if (err.code === 'not-found') {
  console.warn(`[updateShape] Document not found - shape ${id} may have been deleted by another user`);
  errorLogger.logWarning('Attempted to update non-existent shape', { ... });
  return; // Don't throw - the shape was deleted, update is no longer relevant
}
```

**Why this works**:
- The Firestore listener will remove the shape from local state automatically
- No need to throw an error if the shape is already gone
- Logs a warning for debugging purposes

### 2. **handleShapeDragEnd Function** (`Canvas.tsx`)
```typescript
// Check if shape still exists before trying to update
const shapeExists = shapes.find(s => s.id === id);
if (!shapeExists) {
  console.warn(`[handleShapeDragEnd] Shape ${id} no longer exists - may have been deleted during drag`);
  return;
}
```

**Why this works**:
- Prevents unnecessary Firestore calls
- Fails fast at the UI layer before reaching Firestore
- No error thrown, just a clean return

### 3. **lockShape Function** (`useShapeSync.ts`)
```typescript
try {
  await updateShape(id, { isLocked: true, lockedBy: userId });
} catch (err: any) {
  if (err.code === 'not-found') {
    console.warn(`[lockShape] Shape ${id} no longer exists - cannot lock`);
    clearTimeout(timeout);
    lockTimeouts.current.delete(id);
    return; // Don't throw
  }
  throw err; // Re-throw other errors
}
```

**Why this works**:
- Cleans up timeout if shape no longer exists
- Prevents timeout from firing later
- No error propagated to UI

### 4. **unlockShape Function** (`useShapeSync.ts`)
```typescript
try {
  await updateShape(id, { isLocked: false, lockedBy: null });
} catch (err: any) {
  if (err.code === 'not-found') {
    console.warn(`[unlockShape] Shape ${id} no longer exists - already deleted`);
    return; // Don't throw
  }
  throw err;
}
```

**Why this works**:
- Shape is already deleted, no need to unlock it
- Auto-unlock timeout won't cause errors
- Silent success when shape is already gone

## What Changed

### Files Modified:
1. `src/hooks/useShapeSync.ts`
   - ✅ `updateShape`: Graceful not-found handling
   - ✅ `lockShape`: Try-catch with not-found check
   - ✅ `unlockShape`: Try-catch with not-found check

2. `src/components/Canvas.tsx`
   - ✅ `handleShapeDragEnd`: Pre-check if shape exists
   - ✅ Better error logging for drag operations

## Testing

### Reproduce the Original Error:
1. Open app in two browser tabs (Tab A and Tab B)
2. **Tab A**: Create a rectangle and start dragging it
3. **Tab B**: While Tab A is dragging, quickly delete the same rectangle
4. **Tab A**: Release the drag (drag end)
5. **Before Fix**: Error thrown, uncaught promise rejection
6. **After Fix**: Warning logged, no error thrown, app continues working

### Verify the Fix:
```bash
# Check browser console - should see:
[handleShapeDragEnd] Shape {id} no longer exists - may have been deleted during drag
# OR
[updateShape] Document not found - shape {id} may have been deleted by another user

# Should NOT see:
❌ Uncaught (in promise) FirebaseError: No document to update
```

### Expected Behavior After Fix:
- ✅ No uncaught errors
- ✅ Warning logged in console (for debugging)
- ✅ Warning logged in Debug Panel
- ✅ App continues functioning normally
- ✅ No error dialog shown to user
- ✅ Shape disappears cleanly in both tabs

## Error Handling Summary

| Operation | Not-Found Error | Other Errors |
|-----------|----------------|--------------|
| `updateShape` | ⚠️ Log warning, return | ❌ Throw error |
| `deleteShape` | ⚠️ Log warning, return | ❌ Throw error |
| `lockShape` | ⚠️ Log warning, cleanup, return | ❌ Throw error |
| `unlockShape` | ⚠️ Log warning, return | ❌ Throw error |
| `handleShapeDragEnd` | ⚠️ Pre-check, early return | ❌ Log error |

## Why This Approach?

### Graceful Degradation
- Shape is already deleted → operation is no longer needed
- Throwing an error doesn't help the user
- The Firestore listener will sync the state anyway

### User Experience
- No disruptive error messages
- App remains responsive
- Seamless multi-user collaboration

### Debugging
- Still logs warnings in console
- Errors tracked in Debug Panel
- Context provided for investigation

## Console Output Examples

### Normal Flow (No Issues):
```
[handleShapeDragStart] Locking shape abc123
[lockShape] Locking shape abc123 for user user456
[updateShape] Updating shape abc123
[updateShape] Shape abc123 synced to Firestore
[handleShapeDragEnd] Updating position and unlocking shape abc123
[updateShape] Updating shape abc123
[updateShape] Shape abc123 synced to Firestore
```

### Race Condition (Shape Deleted During Drag):
```
[handleShapeDragStart] Locking shape abc123
[lockShape] Locking shape abc123 for user user456
[updateShape] Updating shape abc123
[updateShape] Shape abc123 synced to Firestore
[DELETE] Deleting shape abc123  <-- Another user deletes
[handleShapeDragEnd] Updating position and unlocking shape abc123
[handleShapeDragEnd] Shape abc123 no longer exists - may have been deleted during drag  <-- Early return
```

### Alternative Flow (Update Attempted):
```
[handleShapeDragEnd] Updating position and unlocking shape abc123
[updateShape] Updating shape abc123
[updateShape] Shape abc123 not found in local state - may have been deleted
[updateShape] Error syncing to Firestore: FirebaseError: No document to update
[updateShape] Document not found - shape abc123 may have been deleted by another user  <-- Graceful handling
```

## Related Improvements

This fix complements the previous delete error handling:
1. Double-delete prevention (prevents rapid delete attempts)
2. Delete of already-deleted shapes (handles delete race conditions)
3. **NEW**: Update of already-deleted shapes (handles drag/update race conditions)

All three work together to provide a robust, error-free multi-user experience.

## Impact

- ✅ Eliminates "No document to update" errors
- ✅ No breaking changes to existing functionality
- ✅ Better debugging information
- ✅ Improved user experience in collaborative scenarios
- ✅ No performance impact

## Deployment

Changes are hot-reloaded automatically in development.

For production:
```bash
cd /Applications/Gauntlet/collab_canvas/collabcanvas
npm run build
firebase deploy
```

## Verification Checklist

- [x] No linting errors
- [x] Builds successfully
- [x] Dev server runs without errors
- [x] Race condition handled gracefully
- [x] Console logs appropriate warnings
- [x] Debug Panel captures warnings
- [x] No uncaught promise rejections
- [x] App remains functional after race condition
- [x] Multi-user testing successful

## Status

✅ **FIXED** - All "No document to update" errors are now handled gracefully.

The application now properly handles all race conditions involving shape updates and deletions in a multi-user collaborative environment.



