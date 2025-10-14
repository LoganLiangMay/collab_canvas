import { useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { CursorsState } from '../../types/cursor.types';
import type { PresenceState } from '../../hooks/usePresence';

interface UserPresenceProps {
  cursors: CursorsState;
  presence: PresenceState;
}

interface UserStatus {
  userId: string;
  userName: string;
  status: 'active' | 'away' | 'offline';
  lastSeen: number;
}

export default function UserPresence({ cursors, presence }: UserPresenceProps) {
  const { user } = useAuth();

  // Calculate user statuses from presence and cursor data
  const userStatuses = useMemo(() => {
    const statuses: UserStatus[] = [];
    const now = Date.now();
    const ACTIVE_THRESHOLD = 5 * 60 * 1000; // 5 minutes for away/active status

    // Process all users from presence data
    Object.values(presence).forEach((presenceData) => {
      const timeSinceLastSeen = now - presenceData.lastSeen;
      
      let status: 'active' | 'away' | 'offline';
      
      // Use consistent logic for all users based on their presence data
      if (presenceData.status === 'offline') {
        // User is explicitly offline
        status = 'offline';
      } else if (presenceData.status === 'online' && timeSinceLastSeen < ACTIVE_THRESHOLD) {
        // User is online and has recent activity (lastSeen updated via cursor movement)
        status = 'active';
      } else if (presenceData.status === 'online' && timeSinceLastSeen >= ACTIVE_THRESHOLD) {
        // User is online but no recent activity - they're away
        status = 'away';
      } else {
        // Fallback: mark as offline if no clear status
        status = 'offline';
      }

      statuses.push({
        userId: presenceData.userId,
        userName: presenceData.userName,
        status,
        lastSeen: presenceData.lastSeen,
      });
    });

    // Sort by status (active first, then away, then offline) and then by name
    return statuses.sort((a, b) => {
      if (a.status !== b.status) {
        const statusOrder = { active: 0, away: 1, offline: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return a.userName.localeCompare(b.userName);
    });
  }, [cursors, presence]);

  const getStatusColor = (status: 'active' | 'away' | 'offline') => {
    switch (status) {
      case 'active':
        return '#2ecc71'; // Green
      case 'away':
        return '#f39c12'; // Yellow/Orange
      case 'offline':
        return '#e74c3c'; // Red
    }
  };

  const getStatusText = (status: 'active' | 'away' | 'offline') => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'away':
        return 'Away';
      case 'offline':
        return 'Offline';
    }
  };

  return (
    <div className="user-presence">
      <div className="user-presence-header">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M7 7C8.65685 7 10 5.65685 10 4C10 2.34315 8.65685 1 7 1C5.34315 1 4 2.34315 4 4C4 5.65685 5.34315 7 7 7Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M13 13C13 10.7909 10.3137 9 7 9C3.68629 9 1 10.7909 1 13"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Active Users ({userStatuses.length})</span>
      </div>
      
      <div className="user-presence-list">
        {userStatuses.map((userStatus) => (
          <div key={userStatus.userId} className="user-presence-item">
            <div
              className="user-status-indicator"
              style={{ backgroundColor: getStatusColor(userStatus.status) }}
            />
            <div className="user-presence-info">
              <div className="user-presence-name">
                {userStatus.userName}
                {userStatus.userId === user?.uid && ' (You)'}
              </div>
              <div className="user-presence-status">
                {getStatusText(userStatus.status)}
              </div>
            </div>
          </div>
        ))}
        
        {userStatuses.length === 0 && (
          <div className="user-presence-empty">
            No other users online
          </div>
        )}
      </div>
    </div>
  );
}

