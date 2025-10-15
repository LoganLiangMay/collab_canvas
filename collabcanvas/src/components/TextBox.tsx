import { memo } from 'react';
import { Text, Group, Rect } from 'react-konva';
import type Konva from 'konva';

interface TextBoxProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string; // Not used for text, but kept for consistency
  text: string;
  isSelected: boolean;
  isLocked?: boolean;
  lockedBy?: string;
  currentUserId?: string;
  isEditing?: boolean; // NEW: Whether this text box is currently being edited
  onDragStart: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onClick: (id: string) => void;
  onTextChange?: (id: string, newText: string) => void;
  onStartEdit?: (id: string) => void;
  opacity?: number;
}

function TextBox({
  id,
  x,
  y,
  width,
  height,
  fill: _fill, // Unused but kept for interface consistency
  text,
  isSelected,
  isLocked,
  lockedBy,
  currentUserId,
  isEditing = false,
  onDragStart,
  onDragEnd,
  onClick,
  onStartEdit,
  opacity = 1,
}: TextBoxProps) {
  // Check if this shape is locked by another user
  const isLockedByOther = isLocked && lockedBy !== currentUserId;
  
  // Allow dragging if not locked OR if locked by current user
  const isDraggable = !isLocked || lockedBy === currentUserId;

  // Calculate font size proportional to height (like Figma)
  // Font size is approximately 80% of the height for good readability
  const fontSize = Math.max(12, height * 0.8);

  const handleDragStart = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true; // Prevent stage from receiving drag event
    console.log(`[TEXTBOX DRAG START] ID: ${id}, Position: (${x}, ${y})`);
    onDragStart(id);
  };

  const handleDrag = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    console.log(`[TEXTBOX DRAGGING] ID: ${id}, Position: (${e.target.x().toFixed(2)}, ${e.target.y().toFixed(2)})`);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
    e.cancelBubble = true;
    const newX = e.target.x();
    const newY = e.target.y();
    console.log(`[TEXTBOX DRAG END] ID: ${id}, Final Position: (${newX.toFixed(2)}, ${newY.toFixed(2)})`);
    onDragEnd(id, newX, newY);
  };

  const handleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent stage click
    onClick(id);
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true; // Prevent stage from starting drag
  };

  const handleDoubleClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
    if (!isLockedByOther && isSelected && onStartEdit) {
      console.log(`[TEXTBOX] Double-click detected on ${id}, entering edit mode`);
      onStartEdit(id);
    }
  };

  // Calculate dimensions text and badge dimensions
  const dimensionsText = `${Math.round(width)} × ${Math.round(height)}`;
  const badgePadding = { x: 8, y: 4 };
  const badgeFontSize = 12;
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
      onDblClick={handleDoubleClick}
    >
      {/* Invisible hitbox for smooth dragging - always present */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="transparent"
        stroke={isSelected ? '#3498db' : isLockedByOther ? '#e74c3c' : undefined}
        strokeWidth={isSelected || isLockedByOther ? 2 : 0}
      />
      
      {/* Text display - white color, no background */}
      {/* Hide the text element when editing to prevent duplicate overlay */}
      {!isEditing && (
        <Text
          x={0}
          y={0}
          width={width}
          height={height}
          text={text}
          fontSize={fontSize}
          fill="#ffffff"
          fontFamily="Arial, sans-serif"
          verticalAlign="middle"
          align="left"
          opacity={opacity}
          listening={false}
        />
      )}
      
      {/* Figma-style corner handles when selected */}
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
          x={0}
          y={-20}
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
export default memo(TextBox, (prevProps, nextProps) => {
  return (
    prevProps.x === nextProps.x &&
    prevProps.y === nextProps.y &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.fill === nextProps.fill &&
    prevProps.text === nextProps.text &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isLocked === nextProps.isLocked &&
    prevProps.lockedBy === nextProps.lockedBy &&
    prevProps.currentUserId === nextProps.currentUserId &&
    prevProps.opacity === nextProps.opacity &&
    prevProps.isEditing === nextProps.isEditing
  );
});

