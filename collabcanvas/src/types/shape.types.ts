/**
 * Shape type definitions matching architecture.md Section 7
 */

export interface Shape {
  id: string;
  type: 'rectangle';
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
}


