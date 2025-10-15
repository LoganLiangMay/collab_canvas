# Project Brief: CollabCanvas

## Project Name
CollabCanvas - Real-Time Collaborative Canvas

## Core Purpose
Build a Figma-inspired collaborative canvas where multiple users can create and manipulate shapes in real-time with bulletproof multiplayer infrastructure.

## Project Status
**Current Phase**: MVP Complete (v1.0) - Production Deployed
**Production URL**: https://collab-canvas-2a24a.web.app/
**Development Branch**: `development` (just created)
**Main Branch**: Protected production branch

## Timeline
- **MVP Delivered**: Completed across 9 PRs
- **Current Focus**: Phase 2 feature additions
- **Next Deadline**: TBD

## Success Criteria (MVP - ACHIEVED ✅)
1. ✅ Real-time multiplayer sync <100ms
2. ✅ Multiplayer cursors <50ms 
3. ✅ 60 FPS performance
4. ✅ Object locking system
5. ✅ User authentication (Email + Google OAuth)
6. ✅ Presence awareness (Active/Away/Offline)
7. ✅ Deployed publicly
8. ✅ Support 5+ concurrent users

## Tech Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Canvas**: Konva.js + react-konva
- **Backend**: Firebase (Auth, Firestore, Realtime Database)
- **Deployment**: Firebase Hosting
- **State**: React Hooks + Context

## Key Constraints
- Single hardcoded canvas (`global-canvas-v1`) - MVP limitation
- Firebase free tier usage optimization
- Performance target: 60 FPS sustained
- Sync latency targets: <100ms shapes, <50ms cursors

## Current Shape Types (Implemented)
1. ✅ Rectangle - Full CRUD
2. ✅ Circle - Full CRUD  
3. ✅ Text - Full CRUD with inline editing
4. ⚠️ **Line - Partially implemented** (UI button exists but no component)

## Phase 2 Goals
- Add Line shape (next immediate task)
- Enhance AI agent capabilities
- Add more shape types
- Implement undo/redo
- Multi-canvas support

