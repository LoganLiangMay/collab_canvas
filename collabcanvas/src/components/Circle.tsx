import { memo } from 'react';
import { Circle as KonvaCircle, Text, Group } from 'react-konva';
import type Konva from 'konva';

interface CircleProps {
  id: string;
  x: number;
  y: number;
  width: number;  // Diameter (we'll use width/2 as radius)
  height: number; // Should equal width for circles
  fill: string;
  isSelected: boolean;
  isLocked?: boolean;
  lockedBy?: string;
  currentUserId?: string;
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  opacity?: number;
}

function Circle({
  id,
  x,
  y,
  width,
  fill,
  isSelected,
  isLocked,
  lockedBy,
  currentUserId,
  onDragStart,
  onDragEnd,
  onClick,
  opacity = 1,
}: CircleProps) {
  // Check if this shape is locked by another user
  const isLockedByOther = isLocked && lockedBy !== currentUserId;
  
  // Allow dragging if not locked OR if locked by current user
  const isDraggable = !isLocked || lockedBy === currentUserId;

  // Calculate radius from width (diameter)
  const radius = width / 2;

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true; // Prevent stage from receiving drag event
    console.log(`[CIRCLE DRAG START] ID: ${id}, Position: (${x}, ${y})`);
    onDragStart(id);
  };

  const handleDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    console.log(`[CIRCLE DRAGGING] ID: ${id}, Position: (${e.target.x().toFixed(2)}, ${e.target.y().toFixed(2)})`);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    const newX = e.target.x();
    const newY = e.target.y();
    console.log(`[CIRCLE DRAG END] ID: ${id}, Final Position: (${newX.toFixed(2)}, ${newY.toFixed(2)})`);
    onDragEnd(id, newX, newY);
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent stage click
    onClick(id);
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent stage from starting drag
  };

  return (
    <Group>
      <KonvaCircle
        x={x}
        y={y}
        radius={radius}
        fill={fill}
        opacity={opacity}
        draggable={isDraggable}
        onMouseDown={handleMouseDown}
        onDragStart={handleDragStart}
        onDragMove={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        stroke={isSelected ? '#3498db' : isLockedByOther ? '#e74c3c' : undefined}
        strokeWidth={isSelected || isLockedByOther ? 3 : 0}
        shadowBlur={isSelected ? 10 : 0}
        shadowColor={isSelected ? '#3498db' : undefined}
        shadowOpacity={isSelected ? 0.5 : 0}
      />
      
      {/* Show lock indicator when locked by another user */}
      {isLockedByOther && (
        <Text
          x={x - 30}
          y={y - radius - 20}
          text="🔒 Locked"
          fontSize={14}
          fill="#e74c3c"
          fontStyle="bold"
          listening={false}
        />
      )}
    </Group>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-render if these specific props change
export default memo(Circle, (prevProps, nextProps) => {
  return (
    prevProps.x === nextProps.x &&
    prevProps.y === nextProps.y &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.fill === nextProps.fill &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isLocked === nextProps.isLocked &&
    prevProps.lockedBy === nextProps.lockedBy &&
    prevProps.currentUserId === nextProps.currentUserId &&
    prevProps.opacity === nextProps.opacity
  );
});

