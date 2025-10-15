import React from 'react';
import { Line as KonvaLine, Group, Circle } from 'react-konva';

interface LineProps {
  id: string;
  x: number;
  y: number;
  width: number;  // Delta X to end point
  height: number; // Delta Y to end point
  fill: string;   // Stroke color
  isSelected: boolean;
  isLocked: boolean;
  lockedBy?: string;
  lockedByName?: string;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onDragStart: (id: string) => void;
  opacity?: number; // For preview mode
}

const Line = React.memo(({
  id,
  x,
  y,
  width,
  height,
  fill,
  isSelected,
  isLocked,
  lockedBy,
  lockedByName,
  onSelect,
  onDragEnd,
  onDragStart,
  opacity = 1,
}: LineProps) => {
  // Calculate endpoints from stored data
  // x, y = start point, width/height = delta to end point
  const startX = 0;
  const startY = 0;
  const endX = width;
  const endY = height;

  // Determine stroke color based on state
  const getStrokeColor = () => {
    if (isLocked && lockedBy) {
      return '#e74c3c'; // Red for locked by another user
    }
    if (isSelected) {
      return '#3498db'; // Blue for selected
    }
    return fill; // Normal fill color
  };

  // Determine stroke width based on state
  const getStrokeWidth = () => {
    if (isSelected || isLocked) {
      return 4;
    }
    return 3;
  };

  const handleMouseDown = (e: any) => {
    // CRITICAL: Stop ALL event propagation to prevent stage from capturing
    e.cancelBubble = true;
    if (e.evt) {
      e.evt.stopPropagation();
      e.evt.preventDefault();
    }
    console.log(`[LINE MOUSE DOWN] ID: ${id} - Stopping event propagation`);
  };

  const handleDragStart = (e: any) => {
    // CRITICAL: Stop ALL event propagation
    e.cancelBubble = true;
    if (e.evt) {
      e.evt.stopPropagation();
      e.evt.preventDefault();
    }
    console.log(`[LINE DRAG START] ID: ${id}, Position: (${x}, ${y})`);
    if (!isLocked || !lockedBy) {
      onDragStart(id);
    }
  };

  const handleDrag = (e: any) => {
    e.cancelBubble = true;
    if (e.evt) {
      e.evt.stopPropagation();
    }
    console.log(`[LINE DRAGGING] ID: ${id}, Position: (${e.target.x().toFixed(2)}, ${e.target.y().toFixed(2)})`);
  };

  const handleDragEnd = (e: any) => {
    e.cancelBubble = true;
    if (e.evt) {
      e.evt.stopPropagation();
    }
    const node = e.target;
    // Get the new position (group position changed during drag)
    const newX = node.x();
    const newY = node.y();
    
    console.log(`[LINE DRAG END] ID: ${id}, Final Position: (${(x + newX).toFixed(2)}, ${(y + newY).toFixed(2)})`);
    onDragEnd(id, x + newX, y + newY);
    
    // Reset group position to 0,0 after updating parent coordinates
    node.position({ x: 0, y: 0 });
  };

  const handleClick = (e: any) => {
    e.cancelBubble = true;
    if (e.evt) {
      e.evt.stopPropagation();
    }
    console.log(`[LINE CLICK] ID: ${id} - Selecting`);
    onSelect(id);
  };

  // Debug: Check draggability (only log on changes to reduce spam)
  const isDraggable = !isLocked || !lockedBy;
  const prevDraggableRef = React.useRef<boolean>(isDraggable);
  
  React.useEffect(() => {
    if (prevDraggableRef.current !== isDraggable) {
      console.log(`[LINE DRAGGABILITY CHANGED] ID: ${id}, isDraggable: ${isDraggable}, isLocked: ${isLocked}, lockedBy: ${lockedBy}`);
      prevDraggableRef.current = isDraggable;
    }
  }, [isDraggable, isLocked, lockedBy, id]);

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
      onTap={handleClick}
    >
      {/* Main line */}
      <KonvaLine
        points={[startX, startY, endX, endY]}
        stroke={getStrokeColor()}
        strokeWidth={getStrokeWidth()}
        lineCap="round"
        lineJoin="round"
        hitStrokeWidth={20} // Makes line easier to click
        opacity={opacity}
      />
      
      {/* Endpoint circles for better visibility when selected */}
      {isSelected && (
        <>
          <Circle
            x={startX}
            y={startY}
            radius={6}
            fill="#3498db"
            stroke="#ffffff"
            strokeWidth={2}
          />
          <Circle
            x={endX}
            y={endY}
            radius={6}
            fill="#3498db"
            stroke="#ffffff"
            strokeWidth={2}
          />
        </>
      )}
      
      {/* Lock indicator label */}
      {isLocked && lockedBy && lockedByName && (
        <KonvaLine
          points={[startX, startY - 20, endX, endY - 20]}
          stroke="#e74c3c"
          strokeWidth={1}
          dash={[5, 5]}
        />
      )}
    </Group>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  // Only re-render if these props changed
  return (
    prevProps.x === nextProps.x &&
    prevProps.y === nextProps.y &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.fill === nextProps.fill &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isLocked === nextProps.isLocked &&
    prevProps.lockedBy === nextProps.lockedBy
  );
});

Line.displayName = 'Line';

export default Line;

