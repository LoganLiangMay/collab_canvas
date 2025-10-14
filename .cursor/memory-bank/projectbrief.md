# Project Brief: CollabCanvas

## Project Identity
**Name:** CollabCanvas  
**Type:** Real-Time Collaborative Canvas Application  
**Status:** MVP Complete, Ready for Phase 2  
**Started:** October 2025  
**Timeline:** 7-day sprint (MVP completed in 24 hours)

## Core Mission
Build a Figma-like collaborative canvas where multiple users can create and manipulate shapes in real-time, with plans to integrate AI agents for natural language canvas manipulation.

## Primary Goals
1. **Real-Time Collaboration**: Enable seamless multi-user editing with <100ms sync latency
2. **Multiplayer Cursors**: Show cursor positions and user presence with <50ms latency
3. **Solid Foundation**: Bulletproof infrastructure over fancy features
4. **Performance**: Maintain 60 FPS during all interactions
5. **Scalability**: Support 5+ concurrent users editing 100+ shapes

## Success Criteria (MVP)
All 8 hard gate requirements met:
- ✅ Canvas with pan/zoom (60 FPS)
- ✅ Rectangle shapes (create, move, delete)
- ✅ Real-time object sync (<100ms)
- ✅ Multiplayer cursors (<50ms)
- ✅ Presence awareness
- ✅ User authentication
- ✅ State persistence
- ✅ Deployed publicly

## Future Vision (Phase 2)
- AI agent integration for natural language canvas manipulation
- Multiple shape types (circles, text, lines, arrows)
- Advanced features (resize, rotate, multi-select, undo/redo)
- Canvas sharing and permissions
- Mobile support

## Key Constraints
- **MVP Scope**: Single shape type (rectangles) only
- **Conflict Resolution**: Last-write-wins (acceptable for MVP)
- **Canvas ID**: Hardcoded as "global-canvas-v1" (multi-canvas in Phase 2)
- **Security**: Firebase rules in place for authenticated access only

## Technical Philosophy
1. **Multiplayer First**: Get sync working before adding features
2. **Vertical Building**: Complete one layer fully before moving to next
3. **Test Continuously**: Multi-browser, multi-user testing throughout
4. **Performance Obsessed**: Monitor FPS, profile constantly
5. **Simple Over Complex**: Last-write-wins > operational transforms for MVP

