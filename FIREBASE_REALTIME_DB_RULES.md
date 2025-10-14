# Firebase Realtime Database Security Rules

## Overview
This document covers the security rules for:
- **PR #6**: Multiplayer Cursors (real-time cursor position updates)
- **User Presence**: Online/offline/away status tracking for all registered users

## Security Rules

Add these rules to your Firebase Realtime Database:

```json
{
  "rules": {
    "cursors": {
      "$canvasId": {
        ".read": "auth != null",
        "$userId": {
          ".write": "auth != null && $userId == auth.uid"
        }
      }
    },
    "presence": {
      "$canvasId": {
        ".read": "auth != null",
        "$userId": {
          ".write": "auth != null && $userId == auth.uid"
        }
      }
    }
  }
}
```

## Rule Explanation

### Cursors
1. **Authenticated Read Access**: Only authenticated users can read cursor positions
   - Path: `/cursors/{canvasId}/{userId}`
   - Required for multiplayer collaboration

2. **Authenticated Write**: Users can only write their own cursor position
   - Only authenticated users can update cursors
   - Users can only modify their own cursor data (`$userId == auth.uid`)

3. **Auto-cleanup**: The `onDisconnect()` handler automatically removes cursors when users leave

### Presence
1. **Authenticated Read Access**: Only authenticated users can read presence data
   - Path: `/presence/{canvasId}/{userId}`
   - Shows all users who have registered and their online/offline status

2. **Authenticated Write**: Users can only write their own presence status
   - Only authenticated users can update presence
   - Users can only modify their own presence data (`$userId == auth.uid`)

3. **Auto-offline**: The `onDisconnect()` handler automatically marks users as offline when they disconnect

## How to Apply Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Realtime Database** → **Rules** tab
4. Replace the existing rules with the rules above
5. Click **Publish**

## Testing the Rules

After applying the rules, test that:

**Cursors:**
- ✅ Authenticated users can update their cursor position
- ✅ All authenticated users can see other users' cursors
- ❌ Users cannot modify other users' cursor positions
- ✅ Cursors are removed when users disconnect

**Presence:**
- ✅ Authenticated users can update their presence status
- ✅ All authenticated users can see all registered users and their status
- ❌ Users cannot modify other users' presence status
- ✅ Users are marked offline when they disconnect

## Data Structure

### Cursors
Cursors are stored at:
```
/cursors/global-canvas-v1/{userId}
```

Each cursor object contains:
```json
{
  "x": 150.5,
  "y": 200.3,
  "userId": "user123",
  "userName": "John Doe",
  "color": "#FF6B6B",
  "timestamp": 1699876543210
}
```

### Presence
Presence data is stored at:
```
/presence/global-canvas-v1/{userId}
```

Each presence object contains:
```json
{
  "userId": "user123",
  "userName": "John Doe",
  "status": "online",
  "lastSeen": 1699876543210
}
```

**Status values:**
- `"online"` - User is currently connected
- `"offline"` - User has disconnected

## Performance Considerations

**Cursors:**
- Cursor updates are throttled to 16ms (60fps max)
- Each user's cursor is in a separate path for efficient updates
- Cursors use Realtime Database (not Firestore) for lower latency
- Separate Konva layer prevents cursor updates from re-rendering shapes

**Presence:**
- Presence updates every 30 seconds to keep `lastSeen` current
- Each user's presence is in a separate path for efficient updates
- `onDisconnect()` handlers ensure users are marked offline automatically
- Presence data is used to determine user status:
  - **Active** (🟢): Has cursor activity within last 5 minutes
  - **Away** (🟡): Online but no cursor activity for 5+ minutes
  - **Offline** (🔴): Disconnected or no activity for 5+ minutes

## User Status Logic

The user presence panel combines both cursor activity and presence data:
1. If presence status is "offline" → Show as **Offline** (🔴)
2. If user has cursor activity < 5 min → Show as **Active** (🟢)
3. If user is online but no cursor activity → Show as **Away** (🟡)
4. If user hasn't been seen for 5+ min → Show as **Offline** (🔴)

