/**
 * Shape type definitions matching architecture.md Section 7
 * Extended to support multiple shape types (rectangle, circle, text, line)
 */

export type ShapeType = 'rectangle' | 'circle' | 'text' | 'line';

export interface Shape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  userId: string;
  createdAt: number;
  updatedAt: number;
  isLocked?: boolean;
  lockedBy?: string;
  text?: string; // For text shapes - the text content to display
  // Note: For circles, width and height should be equal (diameter)
  // Note: For lines, width and height represent deltaX and deltaY from start point
  // x, y represent center point for circles, top-left for rectangles and text boxes, start point for lines
}


