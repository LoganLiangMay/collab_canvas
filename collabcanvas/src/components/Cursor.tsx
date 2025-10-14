import { memo } from 'react';
import { Circle, Text, Group, Arrow, Rect } from 'react-konva';
import type { CursorPosition } from '../types/cursor.types';

interface CursorProps {
  cursor: CursorPosition;
}

function Cursor({ cursor }: CursorProps) {
  const { x, y, userName, color, timestamp } = cursor;
  
  // Check if user is active (within last 5 minutes)
  const isActive = Date.now() - timestamp < 5 * 60 * 1000;
  
  // Measure text width for background box (approximate)
  const padding = 8;
  const textWidth = userName.length * 7.5; // ~7.5px per char for 13px bold font
  const circleSpacing = 6;
  const circleRadius = 4;
  const totalWidth = padding + textWidth + (isActive ? circleSpacing + circleRadius * 2 + padding : padding);
  const textHeight = 20;

  return (
    <Group listening={false}>
      <Arrow
        points={[x, y, x + 15, y + 15]}
        pointerLength={5}
        pointerWidth={5}
        fill={color}
        stroke={color}
        strokeWidth={2}
        listening={false}
      />
      <Circle
        x={x}
        y={y}
        radius={3}
        fill={color}
        listening={false}
      />
      <Group x={x + 20} y={y + 5}>
        <Rect
          x={0}
          y={-2}
          width={totalWidth}
          height={textHeight}
          fill="rgba(0, 0, 0, 0.75)"
          cornerRadius={4}
          listening={false}
        />
        <Text
          text={userName}
          x={padding}
          y={2}
          fontSize={13}
          fontFamily="Arial"
          fontStyle="bold"
          fill="#ffffff"
          listening={false}
        />
        {isActive && (
          <Circle
            x={padding + textWidth + circleSpacing + circleRadius}
            y={8}
            radius={circleRadius}
            fill="#2ecc71"
            listening={false}
          />
        )}
      </Group>
    </Group>
  );
}

// Memoize cursor component - only re-render if position or user info changes
export default memo(Cursor, (prevProps, nextProps) => {
  return (
    prevProps.cursor.x === nextProps.cursor.x &&
    prevProps.cursor.y === nextProps.cursor.y &&
    prevProps.cursor.userName === nextProps.cursor.userName &&
    prevProps.cursor.color === nextProps.cursor.color &&
    prevProps.cursor.timestamp === nextProps.cursor.timestamp
  );
});

