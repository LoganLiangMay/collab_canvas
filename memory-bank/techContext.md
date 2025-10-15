# Technical Context

## Development Environment
- **Node.js**: 20.19+ or 22.12+ required
- **Package Manager**: npm
- **Dev Server**: Vite (port 5173)
- **Build Tool**: Vite
- **Testing**: Vitest + React Testing Library

## Tech Stack

### Frontend
- **React**: 19.0.0 (latest)
- **TypeScript**: 5.6.2 (strict mode enabled)
- **Vite**: 5.4.10 (build tool + dev server)

### Canvas Rendering
- **Konva**: 9.3.17 (HTML5 canvas library)
- **react-konva**: 18.2.10 (React bindings)

### Backend Services (Firebase 11.0.2)
- **Authentication**: Email/password + Google OAuth
- **Firestore**: Shape data persistence
- **Realtime Database**: Cursors + presence (low latency)
- **Hosting**: Static site deployment

### UI & Icons
- **lucide-react**: 0.468.0 (icon library)
- **CSS Modules**: Component-scoped styling

### AI Integration (Optional)
- **OpenAI**: 4.77.0 (AI command processing)
- Environment variable: `VITE_OPENAI_API_KEY`
- Toggle: `AI_ENABLED` flag in `services/aiService.ts`

## File Structure
```
collabcanvas/
├── src/
│   ├── components/
│   │   ├── Canvas.tsx           # Main canvas component
│   │   ├── Rectangle.tsx        # Rectangle shape component
│   │   ├── Circle.tsx           # Circle shape component
│   │   ├── TextBox.tsx          # Text shape component
│   │   ├── [Line.tsx]           # ⚠️ TO BE CREATED
│   │   ├── Cursor.tsx           # Multiplayer cursor
│   │   ├── LeftSidebar.tsx      # Tool palette
│   │   ├── ErrorBoundary.tsx    # Error handling wrapper
│   │   ├── Auth/
│   │   │   ├── AuthGuard.tsx    # Route protection
│   │   │   ├── LoginForm.tsx    # Email/password login
│   │   │   └── SignupForm.tsx   # User registration
│   │   ├── UI/
│   │   │   ├── Button.tsx       # Reusable button
│   │   │   ├── Toast.tsx        # Notification system
│   │   │   ├── UserMenu.tsx     # User dropdown menu
│   │   │   ├── UserPresence.tsx # Online user list
│   │   │   └── DebugPanel.tsx   # Dev error monitoring
│   │   └── AI/
│   │       └── AICommandInput.tsx # AI command interface
│   ├── hooks/
│   │   ├── useShapeSync.ts      # Firestore shape operations
│   │   ├── useCursorSync.ts     # Realtime cursor tracking
│   │   └── usePresence.ts       # User presence system
│   ├── contexts/
│   │   └── AuthContext.tsx      # Firebase Auth provider
│   ├── types/
│   │   ├── shape.types.ts       # Shape interfaces
│   │   ├── cursor.types.ts      # Cursor interfaces
│   │   └── user.types.ts        # User interfaces
│   ├── utils/
│   │   ├── canvasHelpers.ts     # Canvas utility functions
│   │   ├── colorUtils.ts        # Color generation + throttle
│   │   └── errorLogger.ts       # Error tracking system
│   ├── services/
│   │   ├── aiService.ts         # OpenAI integration
│   │   └── aiCommandParser.ts   # AI command parsing
│   ├── firebase.ts              # Firebase initialization
│   ├── App.tsx                  # Root component
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles
├── public/
├── dist/                        # Production build output
├── memory-bank/                 # 🆕 Project documentation
├── .env.local                   # Local environment variables
├── firebase.json                # Firebase config
├── firestore.rules              # Firestore security rules
├── database.rules.json          # Realtime DB security rules
├── package.json
├── tsconfig.json                # TypeScript config (strict mode)
├── vite.config.ts               # Vite configuration
└── vitest.config.ts             # Test configuration
```

## Environment Variables
Required in `.env.local`:
```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
VITE_FIREBASE_DATABASE_URL=<your-database-url>

# Optional: OpenAI API (for AI features)
VITE_OPENAI_API_KEY=<your-openai-key>
```

## Development Commands
```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Type check
npm run type-check

# Lint code
npm run lint

# Deploy to Firebase
firebase deploy
```

## Firebase Configuration

### Firestore Database
- **Collection**: `canvases`
- **Document**: `global-canvas-v1` (hardcoded for MVP)
- **Schema**:
```typescript
{
  canvasId: 'global-canvas-v1',
  shapes: Shape[], // Array of all shapes
  lastUpdated: Timestamp
}
```

### Realtime Database
- **Cursors**: `cursors/{userId}`
```typescript
{
  x: number,
  y: number,
  userName: string,
  color: string,
  timestamp: number
}
```

- **Presence**: `presence/{userId}`
```typescript
{
  userName: string,
  status: 'active' | 'away' | 'offline',
  lastActivity: number,
  joinedAt: number
}
```

## Security Rules (Production)

### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /canvases/{canvasId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### Realtime Database Rules
```json
{
  "rules": {
    "cursors": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $userId"
      }
    },
    "presence": {
      "$userId": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid == $userId"
      }
    }
  }
}
```

## Known Dependencies Issues
None currently. All packages are compatible with React 19.

## Browser Compatibility
- Chrome 90+ (recommended)
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance Targets
- **FPS**: Maintain 60 FPS during all interactions
- **Shape Sync**: <100ms latency
- **Cursor Sync**: <50ms latency
- **Max Shapes**: 500+ without performance degradation
- **Max Users**: 5+ concurrent users

## Build Characteristics
- **Bundle Size**: ~1.2 MB (320 KB gzipped)
- **Chunks**: Vendor splitting enabled
  - react-vendor: React + ReactDOM
  - konva-vendor: Konva.js
  - firebase-vendor: Firebase SDK
- **Build Time**: ~5 seconds

## Testing Strategy
- **Unit Tests**: Utils, hooks, pure functions
- **Integration Tests**: Component interactions, Firebase mocking
- **Manual Testing**: Multi-browser, stress testing, edge cases
- **Performance Profiling**: Chrome DevTools, React Profiler

## Debugging Tools

### Development Mode
- FPS counter (bottom-left, always visible)
- Debug Panel (🐛 button, shows errors/warnings)
- Console logging for shape operations
- React DevTools compatible

### Production Mode
- Error Boundary catches crashes
- Error logging to localStorage (last 50 errors)
- Toast notifications for user feedback
- No console logs (cleaned up)

## Git Workflow
- **main**: Production branch (protected)
- **development**: Feature development branch (current)
- **feature/***: Individual feature branches (optional)
- Commit message format: `type: description` (e.g., `feat: add line shape`)

## Deployment Process
1. Work on `development` branch
2. Test thoroughly on localhost
3. Merge to `main` when ready
4. Build: `npm run build`
5. Deploy: `firebase deploy`
6. Verify on https://collab-canvas-2a24a.web.app/

## Troubleshooting

### Common Issues
1. **Firebase errors**: Check .env.local has all variables
2. **TypeScript errors**: Run `npm run type-check`
3. **Build fails**: Clear node_modules, reinstall
4. **Dev server won't start**: Check port 5173 is available
5. **Shapes not syncing**: Check Firebase rules, verify onSnapshot

### Reset Commands
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf node_modules/.vite

# Reset Firebase cache
firebase logout
firebase login
```

