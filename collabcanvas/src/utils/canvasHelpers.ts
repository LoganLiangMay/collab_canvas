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


