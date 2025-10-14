# Technical Context: CollabCanvas

## Technology Stack

### Frontend
- **React 19.1.1** - UI framework with latest concurrent features
- **TypeScript 5.9.3** - Type safety and better DX
- **Konva.js 10.0.2** - Canvas rendering library
- **react-konva 19.0.10** - React bindings for Konva
- **Vite 7.1.7** - Fast build tool and dev server
- **Lucide React 0.545.0** - Icon library

### Backend Services (Firebase)
- **Firebase 12.4.0** - Complete BaaS solution
  - **Firebase Auth** - User authentication (email/password + Google OAuth)
  - **Firestore** - Persistent shape data (NoSQL document database)
  - **Realtime Database** - Ephemeral cursor/presence data (key-value store)
  - **Firebase Hosting** - Static site hosting with CDN

### Testing
- **Vitest 3.2.4** - Fast Vite-native test runner
- **@testing-library/react 16.3.0** - Component testing utilities
- **@testing-library/jest-dom 6.9.1** - DOM matchers
- **@testing-library/user-event 14.6.1** - User interaction simulation
- **jsdom 27.0.0** - Browser environment for Node tests

### Development Tools
- **ESLint 9.36.0** - Code linting
- **TypeScript ESLint 8.45.0** - TypeScript-specific linting
- **Firebase Tools** - CLI for deployment

## Project Structure

```
collabcanvas/
├── src/
│   ├── components/          # React components
│   │   ├── Canvas.tsx       # Main canvas with pan/zoom
│   │   ├── Rectangle.tsx    # Shape component (memo optimized)
│   │   ├── Cursor.tsx       # Remote cursor display (memo optimized)
│   │   ├── ErrorBoundary.tsx # Global error catcher
│   │   ├── Auth/            # Authentication components
│   │   │   ├── AuthGuard.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   └── UI/              # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Toolbar.tsx
│   │       ├── UserMenu.tsx
│   │       ├── UserPresence.tsx
│   │       ├── Toast.tsx    # Notification system
│   │       └── DebugPanel.tsx # Dev error monitor
│   ├── contexts/            # React Context providers
│   │   └── AuthContext.tsx  # Global auth state
│   ├── hooks/               # Custom React hooks
│   │   ├── useShapeSync.ts  # Shape CRUD + Firestore sync
│   │   ├── useCursorSync.ts # Cursor position + Realtime DB
│   │   └── usePresence.ts   # User presence tracking
│   ├── utils/               # Pure utility functions
│   │   ├── canvasHelpers.ts # UUID, canvas calculations
│   │   ├── colorUtils.ts    # User color assignment
│   │   └── errorLogger.ts   # Centralized error logging
│   ├── types/               # TypeScript type definitions
│   │   ├── shape.types.ts
│   │   ├── cursor.types.ts
│   │   └── user.types.ts
│   ├── test/                # Test utilities
│   │   └── setup.ts         # Test environment setup
│   ├── firebase.ts          # Firebase initialization
│   ├── App.tsx              # Root component
│   ├── main.tsx             # Entry point
│   └── index.css            # Global styles
├── dist/                    # Production build output
├── public/                  # Static assets
├── firebase.json            # Firebase config
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes (empty for MVP)
├── database.rules.json      # Realtime DB security rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript config (root)
├── tsconfig.app.json        # TypeScript config (app)
├── tsconfig.node.json       # TypeScript config (build tools)
├── vite.config.ts           # Vite configuration
├── vitest.config.ts         # Vitest test configuration
└── eslint.config.js         # ESLint configuration
```

## Development Setup

### Prerequisites
- **Node.js**: 20.19+ or 22.12+ (required for React 19)
- **npm**: 10+ (comes with Node)
- **Firebase CLI**: `npm install -g firebase-tools`
- **Git**: For version control

### Environment Variables
Create `.env.local` in `collabcanvas/`:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

### Local Development
```bash
cd /Applications/Gauntlet/collab_canvas/collabcanvas
npm install
npm run dev
# Opens http://localhost:5173
```

### Testing
```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

### Build
```bash
# TypeScript check + Vite build
npm run build

# Output: dist/ directory ready for deployment
```

### Deployment
```bash
# Login to Firebase
firebase login

# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only database
```

## Technical Constraints

### Firebase Quotas (Spark/Free Plan)
- **Firestore**: 50k reads/day, 20k writes/day
- **Realtime Database**: 100 simultaneous connections, 1GB stored
- **Hosting**: 10GB storage, 360MB/day transfer
- **Auth**: Unlimited (email/password), 50 Google OAuth users/day

**Impact on Design:**
- Cursor updates throttled to 60fps to stay under quotas
- Shapes use Firestore (fewer updates)
- Cursors use Realtime DB (cheaper for frequent updates)

### Browser Compatibility
**Supported:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required Features:**
- ES2020+ (optional chaining, nullish coalescing)
- Canvas API
- WebSocket (Firebase uses internally)

### Performance Targets
| Metric | Target | How Measured |
|--------|--------|--------------|
| FPS (Pan/Zoom) | 60 | requestAnimationFrame counter |
| FPS (Idle) | 60 | Chrome DevTools Performance |
| Shape Sync | <100ms | Network tab timestamps |
| Cursor Sync | <50ms | performance.now() timestamps |
| Concurrent Users | 5+ | Manual multi-browser testing |
| Max Shapes | 100+ | Stress test button (dev mode) |

## Build Configuration

### Vite Config (`vite.config.ts`)
```typescript
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'konva': ['konva', 'react-konva']
        }
      }
    }
  }
});
```

**Bundle Size:**
- Total: ~1,197 KB (320 KB gzipped)
- Firebase: ~400 KB
- Konva: ~150 KB
- React: ~140 KB
- App code: ~500 KB

### TypeScript Config
**Strict Mode Enabled:**
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`

**Target:** ES2020 (for modern browser features)

### ESLint Config
**Rules Enforced:**
- React Hooks rules (exhaustive deps)
- React Refresh rules (HMR compatibility)
- TypeScript strict type checking
- No unused variables
- Consistent code style

## Dependencies Rationale

### Why Konva.js?
- **Mature**: 10+ years, battle-tested
- **React Integration**: Official react-konva bindings
- **Performance**: Hardware-accelerated canvas rendering
- **Features**: Drag-and-drop, events, layers built-in
- **Size**: Reasonable at 150KB (vs Fabric.js 400KB)

### Why Firebase?
- **Speed**: Fastest path to working multiplayer
- **Real-time**: Built-in sync, no WebSocket code needed
- **Authentication**: Email/password + OAuth out of box
- **Hosting**: One-command deploy with CDN
- **Cost**: Free tier sufficient for MVP and testing

### Why Vite?
- **Speed**: 10x faster than Webpack for dev server
- **HMR**: Instant hot module replacement
- **Modern**: Native ES modules, no bundling in dev
- **React 19**: Full support for latest React features

### Why Vitest?
- **Vite Integration**: Uses same config, no setup needed
- **Speed**: 5x faster than Jest
- **Compatible**: Jest-like API, easy migration
- **ESM**: Native ES module support

## Known Technical Limitations

### MVP Constraints
1. **Single Canvas**: Hardcoded canvas ID (`global-canvas-v1`)
2. **Shape Types**: Only rectangles supported
3. **No Undo/Redo**: State history not tracked
4. **Simple Conflicts**: Last-write-wins only
5. **No Resize/Rotate**: Fixed 150x100 rectangles

### Firebase Limitations
1. **Firestore**: 1 write per second per document (not an issue with individual docs)
2. **Realtime DB**: 100 connections on free tier
3. **No Transactions**: Removed for performance (acceptable trade-off)

### Browser Limitations
1. **Local Storage**: Error logs limited to 50 entries
2. **Canvas Size**: Virtual 5000x5000px (actual render on-demand)
3. **Memory**: ~100MB for app + Firebase SDKs

## Development Workflows

### Feature Development
1. Create feature branch
2. Implement with TypeScript
3. Add tests (unit + integration)
4. Test multi-browser locally
5. Update documentation
6. PR review
7. Merge to main
8. Deploy to production

### Testing Strategy
- **Unit Tests**: Utilities, pure functions
- **Integration Tests**: Hooks with Firebase mocks
- **Manual Tests**: Multi-browser, multi-user
- **Performance Tests**: FPS monitoring, stress test

### Error Monitoring
- **Development**: Debug Panel + console logs
- **Production**: Error Logger stores last 50 errors in localStorage
- **Future**: Integrate Sentry or similar for prod monitoring

## Deployment Architecture

### Firebase Hosting
```
User Request
  ↓
Firebase CDN (Edge locations worldwide)
  ↓
dist/index.html (SPA)
  ↓
Browser loads JS bundles
  ↓
App initializes
  ↓
Connects to Firebase Auth/Firestore/Realtime DB
```

### Security
- **HTTPS**: Enforced by Firebase Hosting
- **Auth**: Required for all Firestore/Realtime DB access
- **Rules**: Server-side validation in Firebase Rules
- **CORS**: Configured automatically by Firebase

## Future Technical Considerations

### Phase 2 Improvements
1. **WebSocket Direct**: Bypass Firebase for even lower latency
2. **CRDTs**: Conflict-free replicated data types for complex merges
3. **IndexedDB**: Client-side caching for offline support
4. **Web Workers**: Background shape processing
5. **Viewport Culling**: Only render visible shapes
6. **Virtual Scrolling**: Optimize large user lists

### Scalability Path
1. **Firestore Scaling**: Already supports millions of documents
2. **Realtime DB Scaling**: Can shard by canvas ID
3. **Hosting Scaling**: Firebase CDN auto-scales
4. **Auth Scaling**: Firebase Auth handles millions of users


