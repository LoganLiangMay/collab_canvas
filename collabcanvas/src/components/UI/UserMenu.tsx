import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import type { PresenceState } from '../../hooks/usePresence';

interface UserMenuProps {
  presence: PresenceState;
}

export default function UserMenu({ presence }: UserMenuProps) {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPresenceOpen, setIsPresenceOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const presenceRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (presenceRef.current && !presenceRef.current.contains(event.target as Node)) {
        setIsPresenceOpen(false);
      }
    };

    if (isUserMenuOpen || isPresenceOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen, isPresenceOpen]);

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      setIsUserMenuOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Get user display name or email
  const displayName = user.displayName || user.email?.split('@')[0] || 'User';
  const email = user.email || '';

  // Get user initials for avatar
  const initials = displayName
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Calculate user statuses for presence list
  const userStatuses = Object.values(presence).map((presenceData) => {
    const now = Date.now();
    const timeSinceLastSeen = now - presenceData.lastSeen;
    const ACTIVE_THRESHOLD = 5 * 60 * 1000;
    
    let status: 'active' | 'away' | 'offline';
    if (presenceData.status === 'offline') {
      status = 'offline';
    } else if (presenceData.status === 'online' && timeSinceLastSeen < ACTIVE_THRESHOLD) {
      status = 'active';
    } else if (presenceData.status === 'online' && timeSinceLastSeen >= ACTIVE_THRESHOLD) {
      status = 'away';
    } else {
      status = 'offline';
    }

    return {
      userId: presenceData.userId,
      userName: presenceData.userName,
      status,
      lastSeen: presenceData.lastSeen,
    };
  }).sort((a, b) => {
    if (a.status !== b.status) {
      const statusOrder = { active: 0, away: 1, offline: 2 };
      return statusOrder[a.status] - statusOrder[b.status];
    }
    return a.userName.localeCompare(b.userName);
  });

  const activeUserCount = userStatuses.filter(s => s.status === 'active').length;

  const getStatusColor = (status: 'active' | 'away' | 'offline') => {
    switch (status) {
      case 'active': return '#2ecc71';
      case 'away': return '#f39c12';
      case 'offline': return '#e74c3c';
    }
  };

  const getStatusText = (status: 'active' | 'away' | 'offline') => {
    switch (status) {
      case 'active': return 'Active';
      case 'away': return 'Away';
      case 'offline': return 'Offline';
    }
  };

  const getDisplayName = (userName: string, userId: string) => {
    return userId === user?.uid ? `${userName} (You)` : userName;
  };

  return (
    <div className="user-menu-container">
      {/* Active Users Button */}
      <div className="user-presence-menu" ref={presenceRef}>
        <button
          className="user-menu-button"
          onClick={() => setIsPresenceOpen(!isPresenceOpen)}
          aria-label="Active users"
        >
          <svg width="20" height="20" viewBox="0 0 16 16" fill="none">
            <path
              d="M13 14C13 11.7909 10.3137 10 7 10C3.68629 10 1 11.7909 1 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M7 8C8.65685 8 10 6.65685 10 5C10 3.34315 8.65685 2 7 2C5.34315 2 4 3.34315 4 5C4 6.65685 5.34315 8 7 8Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="user-name">{activeUserCount} Online</span>
          <svg
            className={`chevron ${isPresenceOpen ? 'open' : ''}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isPresenceOpen && (
          <div className="user-menu-dropdown presence-dropdown">
            <div className="user-presence-header">
              Active Users
            </div>
            <div className="user-presence-list">
              {userStatuses.length === 0 ? (
                <div className="user-presence-empty">No other users online</div>
              ) : (
                userStatuses.map((u) => (
                  <div key={u.userId} className="user-presence-item">
                    <div
                      className="user-status-indicator"
                      style={{ background: getStatusColor(u.status) }}
                    />
                    <div className="user-presence-info">
                      <div className="user-presence-name">{getDisplayName(u.userName, u.userId)}</div>
                      <div className="user-presence-status">{getStatusText(u.status)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* User Profile Menu */}
      <div className="user-menu" ref={menuRef}>
        <button
          className="user-menu-button"
          onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
          aria-label="User menu"
        >
          <div className="user-avatar">{initials}</div>
          <span className="user-name">{displayName}</span>
          <svg
            className={`chevron ${isUserMenuOpen ? 'open' : ''}`}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2 4L6 8L10 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {isUserMenuOpen && (
          <div className="user-menu-dropdown">
            <div className="user-menu-header">
              <div className="user-avatar-large">{initials}</div>
              <div className="user-info">
                <div className="user-info-name">{displayName}</div>
                <div className="user-info-email">{email}</div>
              </div>
            </div>
            
            <div className="user-menu-divider" />
            
            <div className="user-menu-items">
              <button
                className="user-menu-item"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  alert('Profile page coming soon!');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 8C9.65685 8 11 6.65685 11 5C11 3.34315 9.65685 2 8 2C6.34315 2 5 3.34315 5 5C5 6.65685 6.34315 8 8 8Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 14C14 11.7909 11.3137 10 8 10C4.68629 10 2 11.7909 2 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                View Profile
              </button>

              <button
                className="user-menu-item"
                onClick={() => {
                  setIsUserMenuOpen(false);
                  alert('Settings coming soon!');
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 10C9.10457 10 10 9.10457 10 8C10 6.89543 9.10457 6 8 6C6.89543 6 6 6.89543 6 8C6 9.10457 6.89543 10 8 10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13 10C12.9 10.3 13 10.6 13.2 10.9L13.3 11C13.4 11.2 13.5 11.4 13.5 11.6C13.5 11.8 13.4 12 13.3 12.2C13.2 12.4 13 12.5 12.8 12.6C12.6 12.7 12.4 12.7 12.2 12.7C12 12.7 11.8 12.6 11.6 12.5L11.5 12.4C11.2 12.2 10.9 12.1 10.6 12.2C10.3 12.3 10.1 12.5 10 12.8V13C10 13.6 9.6 14 9 14H8C7.4 14 7 13.6 7 13V12.9C6.9 12.6 6.7 12.3 6.4 12.2C6.1 12.1 5.8 12.2 5.5 12.4L5.4 12.5C5.2 12.6 5 12.7 4.8 12.7C4.6 12.7 4.4 12.6 4.2 12.5C4 12.4 3.9 12.2 3.8 12C3.7 11.8 3.7 11.6 3.7 11.4C3.7 11.2 3.8 11 3.9 10.8L4 10.7C4.2 10.4 4.3 10.1 4.2 9.8C4.1 9.5 3.9 9.3 3.6 9.2H3.5C2.9 9.2 2.5 8.8 2.5 8.2V7.8C2.5 7.2 2.9 6.8 3.5 6.8H3.6C3.9 6.7 4.2 6.5 4.3 6.2C4.4 5.9 4.3 5.6 4.1 5.3L4 5.2C3.9 5 3.8 4.8 3.8 4.6C3.8 4.4 3.9 4.2 4 4C4.1 3.8 4.3 3.7 4.5 3.6C4.7 3.5 4.9 3.5 5.1 3.5C5.3 3.5 5.5 3.6 5.7 3.7L5.8 3.8C6.1 4 6.4 4.1 6.7 4C7 3.9 7.2 3.7 7.3 3.4V3.3C7.3 2.7 7.7 2.3 8.3 2.3H8.7C9.3 2.3 9.7 2.7 9.7 3.3V3.4C9.8 3.7 10 4 10.3 4.1C10.6 4.2 10.9 4.1 11.2 3.9L11.3 3.8C11.5 3.7 11.7 3.6 11.9 3.6C12.1 3.6 12.3 3.7 12.5 3.8C12.7 3.9 12.8 4.1 12.9 4.3C13 4.5 13 4.7 13 4.9C13 5.1 12.9 5.3 12.8 5.5L12.7 5.6C12.5 5.9 12.4 6.2 12.5 6.5C12.6 6.8 12.8 7 13.1 7.1H13.2C13.8 7.1 14.2 7.5 14.2 8.1V8.5C14.2 9.1 13.8 9.5 13.2 9.5H13.1C12.8 9.6 12.5 9.8 12.4 10.1L13 10Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Settings
              </button>

              <div className="user-menu-divider" />

              <button
                className="user-menu-item logout"
                onClick={handleLogout}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 11L14 8L11 5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 8H6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Log Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

