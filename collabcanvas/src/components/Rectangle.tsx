import { memo } from 'react';
import { Rect, Text, Group } from 'react-konva';
import type Konva from 'konva';

interface RectangleProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
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

function Rectangle({
  id,
  x,
  y,
  width,
  height,
  fill,
  isSelected,
  isLocked,
  lockedBy,
  currentUserId,
  onDragStart,
  onDragEnd,
  onClick,
  opacity = 1,
}: RectangleProps) {
  // Check if this shape is locked by another user
  const isLockedByOther = isLocked && lockedBy !== currentUserId;
  
  // Allow dragging if not locked OR if locked by current user
  const isDraggable = !isLocked || lockedBy === currentUserId;

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true; // Prevent stage from receiving drag event
    console.log(`[SHAPE DRAG START] ID: ${id}, Position: (${x}, ${y})`);
    onDragStart(id);
  };

  const handleDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    console.log(`[SHAPE DRAGGING] ID: ${id}, Position: (${e.target.x().toFixed(2)}, ${e.target.y().toFixed(2)})`);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    const newX = e.target.x();
    const newY = e.target.y();
    console.log(`[SHAPE DRAG END] ID: ${id}, Final Position: (${newX.toFixed(2)}, ${newY.toFixed(2)})`);
    onDragEnd(id, newX, newY);
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent stage click
    onClick(id);
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent stage from starting drag
  };

  // Calculate dimensions text and badge dimensions
  const dimensionsText = `${Math.round(width)} × ${Math.round(height)}`;
  const badgePadding = { x: 8, y: 4 };
  const badgeFontSize = 12;
  // Approximate text width (rough estimate: 7px per character)
  const textWidth = dimensionsText.length * 7;
  const badgeWidth = textWidth + badgePadding.x * 2;
  const badgeHeight = badgeFontSize + badgePadding.y * 2;

  // Corner handle positions (for Figma-style selection)
  const handleSize = 6;
  const handlePositions = [
    { x: 0, y: 0 }, // top-left
    { x: width, y: 0 }, // top-right
    { x: 0, y: height }, // bottom-left
    { x: width, y: height }, // bottom-right
  ];

  return (
    <Group
      x={x}
      y={y}
      draggable={isDraggable}
      onMouseDown={handleMouseDown}
      onDragStart={handleDragStart}
      onDragMove={handleDrag}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
    >
      {/* Main rectangle shape */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill={fill}
        opacity={opacity}
        stroke={isSelected ? '#3498db' : isLockedByOther ? '#e74c3c' : undefined}
        strokeWidth={isSelected || isLockedByOther ? 2 : 0}
      />
      
      {/* Figma-style corner handles when selected */}
      {isSelected && handlePositions.map((pos, index) => (
        <Group key={index}>
          {/* White fill */}
          <Rect
            x={pos.x - handleSize / 2}
            y={pos.y - handleSize / 2}
            width={handleSize}
            height={handleSize}
            fill="white"
            stroke="#3498db"
            strokeWidth={2}
            listening={false}
          />
        </Group>
      ))}
      
      {/* Show lock indicator when locked by another user */}
      {isLockedByOther && (
        <Text
          x={0}
          y={-20}
          text="🔒 Locked"
          fontSize={14}
          fill="#e74c3c"
          fontStyle="bold"
          listening={false}
        />
      )}

      {/* Show dimensions badge when selected - follows during drag */}
      {isSelected && (
        <Group>
          {/* Badge background */}
          <Rect
            x={width / 2 - badgeWidth / 2}
            y={height + 10}
            width={badgeWidth}
            height={badgeHeight}
            fill="#3498db"
            cornerRadius={4}
            listening={false}
          />
          {/* Dimensions text */}
          <Text
            x={width / 2 - badgeWidth / 2}
            y={height + 10 + badgePadding.y}
            width={badgeWidth}
            text={dimensionsText}
            fontSize={badgeFontSize}
            fill="white"
            align="center"
            fontStyle="bold"
            listening={false}
          />
        </Group>
      )}
    </Group>
  );
}

// Memoize component to prevent unnecessary re-renders
// Only re-render if these specific props change
export default memo(Rectangle, (prevProps, nextProps) => {
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

