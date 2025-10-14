/**
 * AI Service
 * 
 * Handles AI-powered canvas manipulation using OpenAI and LangChain.
 * Currently using placeholder implementation with simple parsing.
 * 
 * Future: Will integrate OpenAI function calling for advanced natural language understanding.
 */

import type { Shape } from '../types/shape.types';
import { parseCommand, type AICommand } from './aiCommandParser';

// Check if AI features are enabled via API key
export const AI_ENABLED = Boolean(import.meta.env.VITE_OPENAI_API_KEY);

/**
 * Execute an AI command on the canvas
 * 
 * @param command - Natural language command from user
 * @param canvasState - Current shapes on canvas (for context)
 * @returns Parsed command to execute
 * 
 * Future Enhancement: This will use OpenAI's function calling to interpret complex commands like:
 * - "Create a login form with username, password, and submit button"
 * - "Arrange all circles in a horizontal row"
 * - "Move the red rectangle to the center"
 * - "Create 5 blue circles spaced evenly"
 */
export async function executeAICommand(
  command: string,
  canvasState: Shape[]
): Promise<AICommand> {
  console.log('[AI Service] Processing command:', command);
  console.log('[AI Service] Canvas state:', canvasState.length, 'shapes');

  // TODO: Implement OpenAI integration
  // 
  // Planned architecture:
  // 1. Use ChatOpenAI from @langchain/openai
  // 2. Define function calling schema for canvas operations:
  //    - createShape(type, properties)
  //    - moveShape(id, x, y)
  //    - deleteShape(id)
  //    - updateShape(id, properties)
  //    - arrangeShapes(ids, layout)
  // 3. Pass canvas state as context
  // 4. Parse OpenAI's function call response
  // 5. Return structured command
  //
  // Example:
  // const chat = new ChatOpenAI({ 
  //   openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY,
  //   modelName: "gpt-4",
  // });
  //
  // const result = await chat.invoke([
  //   new SystemMessage("You are a canvas manipulation assistant..."),
  //   new HumanMessage(command)
  // ], {
  //   functions: [...canvasFunctions]
  // });

  // For now: Use simple regex parsing
  const parsedCommand = parseCommand(command);

  if (!parsedCommand) {
    throw new Error('Could not understand command. Try: "create red circle" or "create blue rectangle"');
  }

  return parsedCommand;
}

/**
 * Validate that the AI service is properly configured
 */
export function validateAIService(): { isValid: boolean; error?: string } {
  if (!AI_ENABLED) {
    return {
      isValid: false,
      error: 'OpenAI API key not configured. Add VITE_OPENAI_API_KEY to your .env.local file.',
    };
  }

  return { isValid: true };
}

/**
 * Get AI service status and configuration
 */
export function getAIServiceStatus(): {
  enabled: boolean;
  implementation: 'placeholder' | 'openai';
  features: string[];
} {
  return {
    enabled: AI_ENABLED,
    implementation: 'placeholder', // Will be 'openai' after integration
    features: [
      'Create shapes (rectangles, circles)',
      'Basic color selection',
      'Delete shapes',
    ],
  };
}

