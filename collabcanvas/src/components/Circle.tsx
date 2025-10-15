import { memo } from 'react';
import { Circle as KonvaCircle, Text, Group, Rect, Line } from 'react-konva';
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
  const diameter = width;

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

  // Calculate dimensions text and badge dimensions
  const dimensionsText = `${Math.round(diameter)} × ${Math.round(diameter)}`;
  const badgePadding = { x: 8, y: 4 };
  const badgeFontSize = 12;
  const textWidth = dimensionsText.length * 7;
  const badgeWidth = textWidth + badgePadding.x * 2;
  const badgeHeight = badgeFontSize + badgePadding.y * 2;

  // Corner handle positions (on the bounding box corners, relative to Group position)
  const handleSize = 6;
  const handlePositions = [
    { x: -radius, y: -radius }, // top-left
    { x: radius, y: -radius }, // top-right
    { x: -radius, y: radius }, // bottom-left
    { x: radius, y: radius }, // bottom-right
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
      {/* Main circle shape */}
      <KonvaCircle
        x={0}
        y={0}
        radius={radius}
        fill={fill}
        opacity={opacity}
        stroke={isLockedByOther ? '#e74c3c' : undefined}
        strokeWidth={isLockedByOther ? 2 : 0}
      />
      
      {/* Bounding box when selected */}
      {isSelected && (
        <Rect
          x={-radius}
          y={-radius}
          width={diameter}
          height={diameter}
          stroke="#3498db"
          strokeWidth={2}
          listening={false}
        />
      )}

      {/* Crosshair when selected */}
      {isSelected && (
        <Group>
          {/* Horizontal line */}
          <Line
            points={[-radius, 0, radius, 0]}
            stroke="#3498db"
            strokeWidth={1}
            listening={false}
          />
          {/* Vertical line */}
          <Line
            points={[0, -radius, 0, radius]}
            stroke="#3498db"
            strokeWidth={1}
            listening={false}
          />
        </Group>
      )}
      
      {/* Corner handles when selected */}
      {isSelected && handlePositions.map((pos, index) => (
        <Rect
          key={index}
          x={pos.x - handleSize / 2}
          y={pos.y - handleSize / 2}
          width={handleSize}
          height={handleSize}
          fill="white"
          stroke="#3498db"
          strokeWidth={2}
          listening={false}
        />
      ))}
      
      {/* Show lock indicator when locked by another user */}
      {isLockedByOther && (
        <Text
          x={-30}
          y={-radius - 20}
          text="🔒 Locked"
          fontSize={14}
          fill="#e74c3c"
          fontStyle="bold"
          listening={false}
        />
      )}

      {/* Show dimensions badge when selected */}
      {isSelected && (
        <Group>
          {/* Badge background */}
          <Rect
            x={-badgeWidth / 2}
            y={radius + 10}
            width={badgeWidth}
            height={badgeHeight}
            fill="#3498db"
            cornerRadius={4}
            listening={false}
          />
          {/* Dimensions text */}
          <Text
            x={-badgeWidth / 2}
            y={radius + 10 + badgePadding.y}
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

