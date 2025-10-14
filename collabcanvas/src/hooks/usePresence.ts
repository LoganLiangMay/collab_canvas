import { useEffect, useState } from 'react';
import { ref, onValue, set, onDisconnect } from 'firebase/database';
import { rtdb } from '../firebase';

const CANVAS_ID = 'global-canvas-v1';

export interface PresenceData {
  userId: string;
  userName: string;
  status: 'online' | 'offline';
  lastSeen: number;
}

export interface PresenceState {
  [userId: string]: PresenceData;
}

interface UsePresenceReturn {
  presence: PresenceState;
  setUserOnline: () => void;
  setUserOffline: () => void;
  updateActivity: () => void;
}

export function usePresence(
  userId: string | null,
  userName: string
): UsePresenceReturn {
  const [presence, setPresence] = useState<PresenceState>({});

  // Listen to all user presence in this canvas
  useEffect(() => {
    const presenceRef = ref(rtdb, `presence/${CANVAS_ID}`);
    
    const unsubscribe = onValue(presenceRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val() as PresenceState;
        console.log(`[usePresence] Received ${Object.keys(data).length} users`);
        setPresence(data);
      } else {
        console.log('[usePresence] No users in presence');
        setPresence({});
      }
    }, (error) => {
      console.error('[usePresence] Error listening to presence:', error);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Set current user's presence
  useEffect(() => {
    if (!userId) {
      console.log('[usePresence] No userId, skipping presence setup');
      return;
    }

    console.log(`[usePresence] Setting up presence for user ${userId}`);

    const userPresenceRef = ref(rtdb, `presence/${CANVAS_ID}/${userId}`);

    // Set user as online
    const presenceData: PresenceData = {
      userId,
      userName,
      status: 'online',
      lastSeen: Date.now(),
    };

    set(userPresenceRef, presenceData)
      .then(() => {
        console.log(`[usePresence] User ${userId} set to online`);
      })
      .catch((err) => {
        console.error('[usePresence] Error setting user online:', err);
      });

    // Setup auto-disconnect handler to mark user as offline
    const disconnectRef = onDisconnect(userPresenceRef);
    disconnectRef.set({
      userId,
      userName,
      status: 'offline',
      lastSeen: Date.now(),
    })
      .then(() => {
        console.log(`[usePresence] Disconnect handler set for user ${userId}`);
      })
      .catch((err) => {
        console.error('[usePresence] Error setting disconnect handler:', err);
      });

    // Update lastSeen periodically while online (every 30 seconds)
    const intervalId = setInterval(() => {
      set(userPresenceRef, {
        ...presenceData,
        lastSeen: Date.now(),
      }).catch((err) => {
        console.error('[usePresence] Error updating lastSeen:', err);
      });
    }, 30000);

    // Cleanup on unmount
    return () => {
      clearInterval(intervalId);
      
      // Set user as offline when component unmounts
      set(userPresenceRef, {
        userId,
        userName,
        status: 'offline',
        lastSeen: Date.now(),
      }).catch((err) => {
        console.error('[usePresence] Error setting user offline on unmount:', err);
      });
    };
  }, [userId, userName]);

  const setUserOnline = () => {
    if (!userId) return;

    const userPresenceRef = ref(rtdb, `presence/${CANVAS_ID}/${userId}`);
    set(userPresenceRef, {
      userId,
      userName,
      status: 'online',
      lastSeen: Date.now(),
    }).catch((err) => {
      console.error('[usePresence] Error setting user online:', err);
    });
  };

  const setUserOffline = () => {
    if (!userId) return;

    const userPresenceRef = ref(rtdb, `presence/${CANVAS_ID}/${userId}`);
    set(userPresenceRef, {
      userId,
      userName,
      status: 'offline',
      lastSeen: Date.now(),
    }).catch((err) => {
      console.error('[usePresence] Error setting user offline:', err);
    });
  };

  const updateActivity = () => {
    if (!userId) return;

    const userPresenceRef = ref(rtdb, `presence/${CANVAS_ID}/${userId}`);
    set(userPresenceRef, {
      userId,
      userName,
      status: 'online',
      lastSeen: Date.now(),
    }).catch((err) => {
      console.error('[usePresence] Error updating activity:', err);
    });
  };

  return {
    presence,
    setUserOnline,
    setUserOffline,
    updateActivity,
  };
}

