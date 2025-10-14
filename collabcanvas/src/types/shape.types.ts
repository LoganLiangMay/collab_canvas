/**
 * Shape type definitions matching architecture.md Section 7
 * Extended to support multiple shape types (rectangle, circle)
 */

export type ShapeType = 'rectangle' | 'circle';

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
  // Note: For circles, width and height should be equal (diameter)
  // x, y represent center point for circles, top-left for rectangles
}


