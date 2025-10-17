/**
 * Canvas helper utilities
 */

/**
 * Generate a unique ID for shapes using crypto.randomUUID()
 */
export function generateId(): string {
  return crypto.randomUUID();
}

/**
 * Calculate the center of the current visible viewport
 * Takes into account stage position and scale
 */
export function getCanvasCenter(
  stageWidth: number,
  stageHeight: number,
  stageScale: number,
  stagePos: { x: number; y: number }
): { x: number; y: number } {
  return {
    x: (stageWidth / 2 - stagePos.x) / stageScale,
    y: (stageHeight / 2 - stagePos.y) / stageScale,
  };
}

/**
 * Calculate angle in degrees from deltas
 */
export function calculateAngle(deltaX: number, deltaY: number): number {
  // atan2 returns radians, convert to degrees
  let angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  // Normalize to 0-360 range
  if (angle < 0) angle += 360;
  return angle;
}

/**
 * Snap angle to nearest cardinal direction (0°, 90°, 180°, 270°)
 * if within tolerance (default 5 degrees)
 */
export function snapAngle(angle: number, tolerance: number = 5): number {
  const cardinals = [0, 90, 180, 270, 360];
  
  for (const cardinal of cardinals) {
    const diff = Math.abs(angle - cardinal);
    if (diff <= tolerance) {
      return cardinal % 360; // Normalize 360 to 0
    }
  }
  
  return angle;
}

/**
 * Apply angle snapping to line deltas
 * Returns snapped deltaX and deltaY that align to cardinal directions
 */
export function snapLineDelta(
  deltaX: number, 
  deltaY: number, 
  tolerance: number = 5
): { deltaX: number; deltaY: number; isSnapped: boolean } {
  // Calculate the length of the line
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  
  // Calculate current angle
  const angle = calculateAngle(deltaX, deltaY);
  
  // Try to snap to cardinal directions
  const snappedAngle = snapAngle(angle, tolerance);
  
  // Check if snapping occurred
  const isSnapped = Math.abs(angle - snappedAngle) <= tolerance;
  
  if (!isSnapped) {
    // No snapping, return original deltas
    return { deltaX, deltaY, isSnapped: false };
  }
  
  // Convert snapped angle back to deltas
  // For snapped angles, we want clean dimensions (no decimals)
  const radians = snappedAngle * (Math.PI / 180);
  let newDeltaX = Math.cos(radians) * length;
  let newDeltaY = Math.sin(radians) * length;
  
  // For cardinal directions, enforce exact 0 or full length
  if (snappedAngle === 0) {
    newDeltaX = length;
    newDeltaY = 0;
  } else if (snappedAngle === 90) {
    newDeltaX = 0;
    newDeltaY = length;
  } else if (snappedAngle === 180) {
    newDeltaX = -length;
    newDeltaY = 0;
  } else if (snappedAngle === 270) {
    newDeltaX = 0;
    newDeltaY = -length;
  }
  
  return { 
    deltaX: newDeltaX, 
    deltaY: newDeltaY, 
    isSnapped: true 
  };
}


