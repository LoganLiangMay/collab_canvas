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

  return (
    <Group>
      {/* Invisible hitbox for smooth dragging - always present */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="transparent"
        draggable={isDraggable}
        onMouseDown={handleMouseDown}
        onDragStart={handleDragStart}
        onDragMove={handleDrag}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        onDblClick={handleDoubleClick}
        stroke={isSelected ? '#3498db' : isLockedByOther ? '#e74c3c' : undefined}
        strokeWidth={isSelected || isLockedByOther ? 2 : 0}
        dash={isSelected || isLockedByOther ? [5, 5] : undefined}
      />
      
      {/* Text display - white color, no background */}
      {/* Hide the text element when editing to prevent duplicate overlay */}
      {!isEditing && (
        <Text
          x={x}
          y={y}
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
      
      {/* Show lock indicator when locked by another user */}
      {isLockedByOther && (
        <Text
          x={x}
          y={y - 20}
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

