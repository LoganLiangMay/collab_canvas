/**
 * AI Tools - OpenAI Function Calling Schema
 * 
 * Defines the tool schema for canvas manipulation through natural language.
 * These tools enable the AI to create, manipulate, and arrange shapes on the canvas.
 */

import type { ChatCompletionTool } from 'openai/resources/chat/completions';

/**
 * Complete set of tools for canvas manipulation
 * Organized by category: Creation, Manipulation, Layout, Query
 */
export const canvasTools: ChatCompletionTool[] = [
  // ==================== CREATION TOOLS ====================
  
  {
    type: 'function',
    function: {
      name: 'createShape',
      description: 'Create a single shape (rectangle, circle, text, or line) on the canvas at a specific position',
      parameters: {
        type: 'object',
        properties: {
          shapeType: {
            type: 'string',
            enum: ['rectangle', 'circle', 'text', 'line'],
            description: 'The type of shape to create',
          },
          x: {
            type: 'number',
            description: 'X coordinate position (0-800 for typical canvas). Use 400 for center.',
          },
          y: {
            type: 'number',
            description: 'Y coordinate position (0-600 for typical canvas). Use 300 for center.',
          },
          width: {
            type: 'number',
            description: 'Width of the shape in pixels (default: 100 for rectangles, diameter for circles)',
          },
          height: {
            type: 'number',
            description: 'Height of the shape in pixels (default: 100 for rectangles, diameter for circles)',
          },
          fill: {
            type: 'string',
            description: 'Fill color in hex format (e.g., #3498db for blue, #e74c3c for red)',
          },
          text: {
            type: 'string',
            description: 'Text content (required only for text shapes)',
          },
          stroke: {
            type: 'string',
            description: 'Border/stroke color in hex format (optional, mainly for lines)',
          },
          rotation: {
            type: 'number',
            description: 'Rotation angle in degrees (default: 0)',
          },
        },
        required: ['shapeType', 'x', 'y'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'createMultipleShapes',
      description: 'Create multiple shapes at once with specified positions. Useful for grids, forms, or layouts.',
      parameters: {
        type: 'object',
        properties: {
          shapes: {
            type: 'array',
            description: 'Array of shape configurations to create',
            items: {
              type: 'object',
              properties: {
                shapeType: {
                  type: 'string',
                  enum: ['rectangle', 'circle', 'text', 'line'],
                },
                x: { type: 'number' },
                y: { type: 'number' },
                width: { type: 'number' },
                height: { type: 'number' },
                fill: { type: 'string' },
                text: { type: 'string' },
                stroke: { type: 'string' },
                rotation: { type: 'number' },
              },
              required: ['shapeType', 'x', 'y'],
            },
          },
        },
        required: ['shapes'],
      },
    },
  },

  // ==================== MANIPULATION TOOLS ====================

  {
    type: 'function',
    function: {
      name: 'moveShape',
      description: 'Move a shape to a new position or relative direction (left, right, up, down, center)',
      parameters: {
        type: 'object',
        properties: {
          shapeIdentifier: {
            type: 'string',
            description: 'How to identify the shape: "selected", "last", "first", or description like "red circle" or "blue rectangle"',
          },
          targetX: {
            type: 'number',
            description: 'Absolute X position (optional if using direction)',
          },
          targetY: {
            type: 'number',
            description: 'Absolute Y position (optional if using direction)',
          },
          direction: {
            type: 'string',
            enum: ['left', 'right', 'up', 'down', 'center'],
            description: 'Direction to move (optional if using absolute position)',
          },
          distance: {
            type: 'number',
            description: 'Distance to move in pixels (for directional movement, default: 50)',
          },
        },
        required: ['shapeIdentifier'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'resizeShape',
      description: 'Change the dimensions of a shape',
      parameters: {
        type: 'object',
        properties: {
          shapeIdentifier: {
            type: 'string',
            description: 'How to identify the shape: "selected", "last", "first", or description like "red circle"',
          },
          width: {
            type: 'number',
            description: 'New width in pixels (optional)',
          },
          height: {
            type: 'number',
            description: 'New height in pixels (optional)',
          },
          scaleFactor: {
            type: 'number',
            description: 'Scale multiplier (e.g., 2 for double size, 0.5 for half). Alternative to width/height.',
          },
        },
        required: ['shapeIdentifier'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'rotateShape',
      description: 'Rotate a shape by a specified angle',
      parameters: {
        type: 'object',
        properties: {
          shapeIdentifier: {
            type: 'string',
            description: 'How to identify the shape: "selected", "last", "first", or description',
          },
          degrees: {
            type: 'number',
            description: 'Rotation angle in degrees (positive = clockwise, negative = counterclockwise)',
          },
          absolute: {
            type: 'boolean',
            description: 'If true, set absolute rotation. If false, rotate relative to current angle (default: false)',
          },
        },
        required: ['shapeIdentifier', 'degrees'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'updateShapeStyle',
      description: 'Change the visual style of a shape (color, stroke, opacity)',
      parameters: {
        type: 'object',
        properties: {
          shapeIdentifier: {
            type: 'string',
            description: 'How to identify the shape: "selected", "last", "first", or description',
          },
          fill: {
            type: 'string',
            description: 'New fill color in hex format (e.g., #3498db)',
          },
          stroke: {
            type: 'string',
            description: 'New stroke/border color in hex format',
          },
          textColor: {
            type: 'string',
            description: 'Text color for text shapes',
          },
        },
        required: ['shapeIdentifier'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'deleteShape',
      description: 'Delete/remove a shape from the canvas',
      parameters: {
        type: 'object',
        properties: {
          shapeIdentifier: {
            type: 'string',
            description: 'How to identify the shape: "selected", "last", "first", "all", or description',
          },
        },
        required: ['shapeIdentifier'],
      },
    },
  },

  // ==================== LAYOUT TOOLS ====================

  {
    type: 'function',
    function: {
      name: 'arrangeShapes',
      description: 'Arrange multiple shapes in a specific layout pattern (horizontal row, vertical column, or grid)',
      parameters: {
        type: 'object',
        properties: {
          shapeIdentifiers: {
            type: 'string',
            description: 'Which shapes to arrange: "all", "selected", "last N" (e.g., "last 5"), or type filter (e.g., "all circles")',
          },
          layout: {
            type: 'string',
            enum: ['horizontal', 'vertical', 'grid'],
            description: 'Layout type: horizontal row, vertical column, or grid',
          },
          spacing: {
            type: 'number',
            description: 'Space between shapes in pixels (default: 20)',
          },
          startX: {
            type: 'number',
            description: 'Starting X position (optional, defaults to current position)',
          },
          startY: {
            type: 'number',
            description: 'Starting Y position (optional, defaults to current position)',
          },
          gridColumns: {
            type: 'number',
            description: 'Number of columns for grid layout (required if layout is "grid")',
          },
        },
        required: ['shapeIdentifiers', 'layout'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'distributeShapes',
      description: 'Distribute shapes evenly with equal spacing between them',
      parameters: {
        type: 'object',
        properties: {
          shapeIdentifiers: {
            type: 'string',
            description: 'Which shapes to distribute: "all", "selected", or type filter',
          },
          direction: {
            type: 'string',
            enum: ['horizontal', 'vertical'],
            description: 'Distribution direction',
          },
          spacing: {
            type: 'number',
            description: 'Exact spacing in pixels between shapes',
          },
        },
        required: ['shapeIdentifiers', 'direction', 'spacing'],
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'alignShapes',
      description: 'Align multiple shapes along a common edge or center',
      parameters: {
        type: 'object',
        properties: {
          shapeIdentifiers: {
            type: 'string',
            description: 'Which shapes to align: "all", "selected", or type filter',
          },
          alignment: {
            type: 'string',
            enum: ['left', 'right', 'top', 'bottom', 'center-horizontal', 'center-vertical'],
            description: 'Alignment type',
          },
        },
        required: ['shapeIdentifiers', 'alignment'],
      },
    },
  },

  // ==================== QUERY TOOLS ====================

  {
    type: 'function',
    function: {
      name: 'getCanvasState',
      description: 'Get information about all shapes currently on the canvas. Use this to understand current canvas state before manipulation.',
      parameters: {
        type: 'object',
        properties: {
          includeDetails: {
            type: 'boolean',
            description: 'Include detailed properties of each shape (default: true)',
          },
        },
      },
    },
  },

  {
    type: 'function',
    function: {
      name: 'findShapes',
      description: 'Find shapes matching specific criteria (by type, color, or position)',
      parameters: {
        type: 'object',
        properties: {
          shapeType: {
            type: 'string',
            enum: ['rectangle', 'circle', 'text', 'line', 'any'],
            description: 'Filter by shape type',
          },
          color: {
            type: 'string',
            description: 'Filter by color (e.g., "red", "blue" - fuzzy match on fill color)',
          },
          textContent: {
            type: 'string',
            description: 'Filter text shapes by content (partial match)',
          },
        },
      },
    },
  },

  // ==================== FORM GENERATION ====================

  {
    type: 'function',
    function: {
      name: 'createFormLayout',
      description: 'Generate a professional, styled form with consistent design tokens. Use this when user requests a "login form", "signup form", "contact form", etc. For individual shapes, use createShape instead.',
      parameters: {
        type: 'object',
        properties: {
          formType: {
            type: 'string',
            enum: ['login', 'signup', 'contact', 'search', 'payment', 'custom'],
            description: 'Type of form to generate. Auto-configures appropriate fields.',
          },
          stylePreset: {
            type: 'string',
            enum: ['minimal', 'neumorphic', 'glass'],
            description: 'Visual style preset: minimal (clean), neumorphic (3D shadows), glass (transparent) - default: minimal',
          },
          customFields: {
            type: 'array',
            items: { type: 'string' },
            description: 'Custom field names for non-standard forms (only needed for formType: "custom")',
          },
          includeSubmit: {
            type: 'boolean',
            description: 'Include a submit button (default: true)',
          },
        },
        required: ['formType'],
      },
    },
  },

  // ==================== BULK OPERATIONS ====================

  {
    type: 'function',
    function: {
      name: 'createBulkShapes',
      description: 'Create multiple shapes at once (10-1000+) in an organized layout. Use for "create 100 circles", "make 500 shapes", etc. NEVER use createShape multiple times for bulk requests. This is optimized for performance.',
      parameters: {
        type: 'object',
        properties: {
          count: {
            type: 'number',
            description: 'Number of shapes to create (10-1000+)',
          },
          shapeType: {
            type: 'string',
            enum: ['rectangle', 'circle', 'mixed'],
            description: 'Type of shapes to create. "mixed" alternates between rectangles and circles.',
          },
          layout: {
            type: 'string',
            enum: ['grid', 'random', 'spiral', 'line'],
            description: 'How to arrange the shapes: grid (organized rows/columns), random (scattered), spiral (from center), line (horizontal row)',
          },
          color: {
            type: 'string',
            description: 'Fill color for shapes (e.g., "blue", "#FF0000") - default: blue',
          },
          size: {
            type: 'number',
            description: 'Average size of shapes in pixels (default: 50)',
          },
        },
        required: ['count', 'shapeType', 'layout'],
      },
    },
  },
];

/**
 * System prompt for the AI canvas assistant
 */
export const SYSTEM_PROMPT = `You are an AI assistant that helps users manipulate a collaborative canvas through natural language commands.

**CRITICAL RULE: ALWAYS USE FUNCTION CALLS - NEVER JUST EXPLAIN!**
When a user asks you to create, move, or manipulate shapes, you MUST use the available function tools to DO IT, not just explain how to do it.

**Your Capabilities:**
- Create shapes (rectangles, circles, text, lines) at specified positions
- **Bulk create 10-1000+ shapes** efficiently with organized layouts
- Move, resize, and rotate existing shapes
- Change colors and styles
- Arrange multiple shapes in layouts (grids, rows, columns)
- Align and distribute shapes evenly
- Delete shapes
- **Generate professional forms** with consistent styling and design tokens

**Important Guidelines:**
1. **Canvas Dimensions**: The typical canvas is 800x600 pixels. Center is at (400, 300).
2. **Color Names**: Convert color names to hex codes:
   - red: #e74c3c, blue: #3498db, green: #2ecc71, yellow: #f1c40f
   - purple: #9b59b6, orange: #e67e22, pink: #ff69b4, gray: #95a5a6
   - black: #34495e, white: #ecf0f1
3. **Shape Identifiers**: When manipulating existing shapes, use:
   - "selected" for currently selected shape
   - "last" for most recently created shape
   - "first" for oldest shape
   - Descriptive terms like "red circle", "blue rectangle"
   - "all" for all shapes
4. **Bulk Shape Creation** (Use createBulkShapes for 10+ shapes):
   - **When to use**: User requests "create 100 circles", "make 500 shapes", "generate 200 rectangles"
   - **Benefits**: Optimized batch writes, organized layouts, handles 1000+ shapes efficiently
   - **Layouts**: grid (organized), random (scattered), spiral (from center), line (horizontal)
   - **Example**: "create 100 blue circles" → Use createBulkShapes({count: 100, shapeType: 'circle', layout: 'grid', color: '#3498db'})
   - **NEVER**: Use createShape multiple times for bulk requests (will fail with JSON errors)
5. **Form Generation** (Use createFormLayout for structured forms):
   - **When to use**: User requests a "login form", "signup form", "contact form", "search form", etc.
   - **Benefits**: Applies professional design tokens, 8px grid spacing, consistent styling
   - **Style presets**: minimal (clean, Apple-like), neumorphic (3D shadows), glass (transparent)
   - **Auto-configured**: login (email+password), signup (name+email+password), contact (name+email+message)
   - **Example**: "create a login form" → Use createFormLayout({formType: 'login', stylePreset: 'minimal'})
   - **Custom**: For non-standard forms, use formType: 'custom' with customFields array
7. **Complex Requests** (like smiley faces, houses, diagrams):
   - ALWAYS use createMultipleShapes to create all parts at once
   - Calculate appropriate positions for each part
   - Example: "create a smiley face" → Use createMultipleShapes with:
     • 1 large yellow circle for face (x: 400, y: 300, width: 200)
     • 2 small black circles for eyes (x: 360/440, y: 270, width: 20)
     • 1 arc/line for smile (or use text "😊")
   - NEVER just explain - USE THE TOOLS TO CREATE IT!
8. **Smart Defaults**: 
   - Default shape size: 100x100 pixels (50px for bulk shapes)
   - Default spacing: 20 pixels
   - Default colors: Use blue (#3498db) if not specified
   - Default form style: minimal
   - Default bulk layout: grid
9. **Query First**: For manipulation commands, use getCanvasState or findShapes to identify target shapes.

**Response Strategy:**
- **ALWAYS use function calls** - Don't just explain, DO IT!
- For simple commands: Use single tool call
- For complex commands: Use createMultipleShapes or multiple sequential tool calls
- Respond with a brief confirmation like "Created smiley face with 4 shapes" AFTER using the tools
- If something is ambiguous, use findShapes to locate shapes first, then act

**Examples of What to Do:**
✅ "Create a smiley face" → Use createMultipleShapes immediately
✅ "Make a house" → Use createMultipleShapes with rectangles for walls/roof
✅ "Create 3 blue circles" → Use createMultipleShapes with 3 circles
✅ "Move the red square to the left" → Use findShapes then moveShape

**Examples of What NOT to Do:**
❌ "To create a smiley face, you would need to..." → NO! Just create it!
❌ "I can help you with that by..." → NO! Use the tools!
❌ Explaining steps instead of executing them → NO!

Be helpful, precise, creative, and ALWAYS use your tools to take action!`;

/**
 * Color name to hex code mapping
 */
export const COLOR_MAP: Record<string, string> = {
  red: '#e74c3c',
  blue: '#3498db',
  green: '#2ecc71',
  yellow: '#f1c40f',
  purple: '#9b59b6',
  orange: '#e67e22',
  pink: '#ff69b4',
  gray: '#95a5a6',
  grey: '#95a5a6',
  black: '#34495e',
  white: '#ecf0f1',
  cyan: '#1abc9c',
  teal: '#16a085',
  lime: '#27ae60',
  indigo: '#2c3e50',
  brown: '#795548',
};

/**
 * Helper function to resolve color names to hex codes
 */
export function resolveColor(color: string): string {
  const lowerColor = color.toLowerCase().trim();
  return COLOR_MAP[lowerColor] || color;
}

