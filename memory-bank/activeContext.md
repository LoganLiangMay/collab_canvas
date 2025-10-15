# Active Context

**Last Updated**: October 15, 2025
**Current Branch**: `development` (newly created)
**Working From**: Localhost development environment

## Current Focus
Adding **Line shape** as the next feature to complete the basic shape toolkit.

## Recent Changes
- Created `development` branch to isolate feature work from production
- Production site is live and stable at https://collab-canvas-2a24a.web.app/

## What We Just Discovered
1. **Line Shape is Partially Implemented**:
   - LeftSidebar has a button for 'line' shape (Minus icon from lucide-react)
   - Shape types already include 'line' in the TypeScript definition
   - Canvas.tsx references line handling in placement mode
   - **BUT**: No `Line.tsx` component exists yet!

2. **Current Shape Implementation Pattern**:
   - Rectangle.tsx - exists, uses Konva Rect
   - Circle.tsx - exists, uses Konva Circle  
   - TextBox.tsx - exists, uses Konva Text with HTML textarea for editing
   - Line.tsx - **MISSING** - should use Konva Line

## Immediate Next Steps
1. ✅ Create `development` branch (DONE)
2. 📋 Review Line implementation requirements
3. 🔨 Create Line.tsx component
4. 🔧 Update Canvas.tsx line rendering logic
5. 🧪 Test Line creation, selection, movement, deletion
6. 🔄 Ensure real-time sync works for lines

## Known Patterns to Follow
### Shape Component Structure
All shape components follow this pattern:
```typescript
interface ShapeProps {
  id: string;
  x: number;
  y: number;
  // shape-specific dimensions
  fill: string;
  isSelected: boolean;
  isLocked: boolean;
  lockedBy?: string;
  lockedByName?: string;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDragStart: (id: string) => void;
}
```

### Real-time Sync Pattern
- Optimistic updates (UI updates immediately)
- Firestore sync happens in background via useShapeSync hook
- Object locking on drag start
- Auto-unlock on drag end or 5-second timeout

## Current Challenges
1. **Line Shape Specifics**:
   - Lines need two points (start and end) vs. single x,y position
   - Current Shape interface uses x, y, width, height - may need extension
   - Konva Line uses `points` array: `[x1, y1, x2, y2]`

2. **Data Model Considerations**:
   - Do we modify Shape interface to support points array?
   - Or map width/height to represent line endpoints?
   - Suggestion: Use (x, y) as start point, (x+width, y+height) as end point

## Active Decisions
- **Branch Strategy**: development for features, main for production
- **Testing Environment**: localhost:5173 for development
- **Deployment**: Only from main branch to Firebase Hosting

## User's Intent
User wants to:
1. Work on feature additions safely in development branch
2. Keep production site stable on main branch  
3. Start by adding Line shape functionality
4. Get recommendations for what to work on next

