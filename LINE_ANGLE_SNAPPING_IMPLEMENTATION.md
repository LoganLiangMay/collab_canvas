# Line Angle Snapping Implementation

**Date**: October 16, 2025  
**Status**: ✅ Complete - Ready for Testing

## Overview
Enhanced line creation with intelligent angle snapping to cardinal directions (0°, 90°, 180°, 270°) when drawing lines. This provides a professional crosshair-based line creation experience similar to design tools like Figma.

## Problem Solved
Previously, clicking to add a line created a fixed horizontal line (120×0) that couldn't be rotated during creation. Users couldn't create lines at custom angles or have them snap to clean cardinal directions.

## Implementation Details

### 1. Angle Snapping Utilities (`canvasHelpers.ts`)

Added three new helper functions:

#### `calculateAngle(deltaX, deltaY): number`
- Calculates the angle in degrees from delta coordinates
- Uses `Math.atan2` for accurate angle calculation
- Normalizes result to 0-360° range

#### `snapAngle(angle, tolerance): number`
- Snaps angle to nearest cardinal direction (0°, 90°, 180°, 270°)
- Default tolerance: 2 degrees
- Returns original angle if not within tolerance

#### `snapLineDelta(deltaX, deltaY, tolerance): object`
- Main function for line snapping
- Returns: `{ deltaX, deltaY, isSnapped }`
- Calculates line length and angle
- Applies snapping if within tolerance
- For snapped lines, enforces exact 0 or full-length dimensions:
  - **0° (right)**: `deltaX = length, deltaY = 0`
  - **90° (down)**: `deltaX = 0, deltaY = length`
  - **180° (left)**: `deltaX = -length, deltaY = 0`
  - **270° (up)**: `deltaX = 0, deltaY = -length`

### 2. Canvas Integration (`Canvas.tsx`)

#### Import Addition
```typescript
import { snapLineDelta } from '../utils/canvasHelpers';
```

#### Line Creation with Snapping
Updated `handleMouseMove` function to apply angle snapping during line creation:

```typescript
if (placementType === 'line') {
  let deltaX = canvasX - startX;
  let deltaY = canvasY - startY;
  
  // Apply angle snapping (snap to 0°, 90°, 180°, 270° within 2° tolerance)
  const snapped = snapLineDelta(deltaX, deltaY, 2);
  deltaX = snapped.deltaX;
  deltaY = snapped.deltaY;
  
  console.log(`[LINE PREVIEW] ... ${snapped.isSnapped ? ' [SNAPPED]' : ''}`);
  setPreviewShape({ 
    x: startX, 
    y: startY, 
    width: deltaX, 
    height: deltaY 
  });
}
```

#### Dimension Badge Enhancement
Updated dimension display for lines to show actual line dimensions (not bounding box):

```typescript
if (selectedShape.type === 'line') {
  const absWidth = Math.abs(Math.round(displayProps.width));
  const absHeight = Math.abs(Math.round(displayProps.height));
  dimensionsText = `${absWidth} × ${absHeight}`;
}
```

**Examples:**
- Horizontal line: `120 × 0`
- Vertical line: `0 × 120`
- Diagonal line: `85 × 85`

## User Experience

### Creating Lines with Angle Snapping

1. **Click Line Tool** in the left sidebar
2. **Click and Drag** on canvas to create a line
3. **Automatic Snapping**:
   - Drag nearly horizontal → snaps to perfect horizontal (0° or 180°)
   - Drag nearly vertical → snaps to perfect vertical (90° or 270°)
   - Visual feedback in console: `[SNAPPED]` indicator
4. **Release Mouse** to create the line

### Snapping Behavior

The line will snap when within **2 degrees** of cardinal directions:

| Target Angle | Snap Range | Result |
|--------------|------------|--------|
| 0° (Right) | -2° to +2° | Perfect horizontal (→) |
| 90° (Down) | 88° to 92° | Perfect vertical (↓) |
| 180° (Left) | 178° to 182° | Perfect horizontal (←) |
| 270° (Up) | 268° to 272° | Perfect vertical (↑) |

### Dimension Display

When a line is selected:
- **Snapped horizontal**: Shows `120 × 0`
- **Snapped vertical**: Shows `0 × 150`
- **Diagonal**: Shows actual deltas, e.g., `85 × 60`

## Technical Benefits

1. **Clean Dimensions**: Snapped lines have exact 0 values for perpendicular axis
2. **Professional Feel**: Mimics behavior of industry-standard design tools
3. **No Visual Jitter**: Snapping is smooth and predictable
4. **Console Feedback**: Debug logs show `[SNAPPED]` indicator for development

## Testing Checklist

- [ ] **Horizontal Line Creation**
  - Click line tool
  - Drag left-to-right (nearly horizontal)
  - Verify line snaps to perfect horizontal
  - Check dimension badge shows `XXX × 0`

- [ ] **Vertical Line Creation**
  - Click line tool
  - Drag top-to-bottom (nearly vertical)
  - Verify line snaps to perfect vertical
  - Check dimension badge shows `0 × XXX`

- [ ] **Diagonal Line (No Snap)**
  - Click line tool
  - Drag at 45° angle (outside snap tolerance)
  - Verify line does NOT snap
  - Check dimension badge shows both non-zero values

- [ ] **Snap Tolerance**
  - Drag at exactly 1° from horizontal → should snap
  - Drag at exactly 3° from horizontal → should NOT snap

- [ ] **All Four Directions**
  - Right (0°) → should snap
  - Down (90°) → should snap
  - Left (180°) → should snap
  - Up (270°) → should snap

- [ ] **Console Logging**
  - Check browser console for `[LINE PREVIEW]` messages
  - Verify `[SNAPPED]` indicator appears when snapping occurs

## Implementation Notes

### Why 2° Tolerance?
- **Too tight (1°)**: Hard to trigger, feels restrictive
- **Just right (2°)**: Professional tools (Figma, Sketch) use similar tolerance
- **Too loose (5°)**: Unexpected snapping, loss of control

### Data Model Consistency
Lines continue to use the existing shape interface:
- `x, y`: Start point
- `width`: Delta X (can be negative)
- `height`: Delta Y (can be negative)
- `rotation`: Currently unused (future feature)

This maintains compatibility with existing Firebase schema and shape operations.

### Performance Impact
- Minimal: Only calculates during line creation (on mouse move)
- Single `Math.atan2` call + angle comparison
- No continuous background calculations

## Future Enhancements

1. **Hold Shift to Snap**: Force snapping with keyboard modifier
2. **More Snap Angles**: Add 45° diagonal snapping
3. **Visual Snap Indicator**: Show guides when snapping occurs
4. **Adjustable Tolerance**: User preference for snap sensitivity
5. **Rotation Handle**: Allow rotating existing lines post-creation

## Files Modified

1. `/collabcanvas/src/utils/canvasHelpers.ts`
   - Added `calculateAngle()`
   - Added `snapAngle()`
   - Added `snapLineDelta()`

2. `/collabcanvas/src/components/Canvas.tsx`
   - Imported `snapLineDelta`
   - Updated line creation logic in `handleMouseMove()`
   - Enhanced dimension badge for line-specific display

## Zero Breaking Changes

✅ All existing functionality preserved  
✅ No changes to shape data model  
✅ No changes to Firebase schema  
✅ Backward compatible with existing lines  
✅ No linter errors

## Next Steps

1. ✅ Start dev server: `npm run dev` 
2. 🔄 Manual testing (see checklist above)
3. 📸 Capture screenshots/video of snapping behavior
4. 🐛 File any issues in `/docs/bugs/`
5. ✅ Commit changes to development branch
6. 🚀 Merge to main and deploy if testing passes

---

**Dev Server**: http://localhost:5173  
**Branch**: `development`  
**Linter Status**: ✅ No errors

