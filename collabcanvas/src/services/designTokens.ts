/**
 * Design Tokens - Professional UI Design System
 * 
 * Defines consistent styling rules for form generation across different presets.
 * Used by the AI form generator to create visually cohesive layouts.
 */

export interface DesignTokenSet {
  font: string;
  colorPrimary: string;
  colorBackground: string;
  colorText: string;
  colorBorder: string;
  colorInputBg: string;
  colorPlaceholder: string;
  radius: number;
  spacing: number;
  shadowColor?: string;
  shadowBlur?: number;
}

/**
 * Design token presets for different form styles
 */
export const designTokens: Record<string, DesignTokenSet> = {
  minimal: {
    font: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    colorPrimary: '#007AFF',
    colorBackground: '#FFFFFF',
    colorText: '#000000',
    colorBorder: '#D1D5DB',
    colorInputBg: '#FFFFFF',
    colorPlaceholder: '#6B7280',
    radius: 12,
    spacing: 8,
  },
  
  neumorphic: {
    font: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    colorPrimary: '#667eea',
    colorBackground: '#F0F0F3',
    colorText: '#2D3748',
    colorBorder: '#D1D5DB',
    colorInputBg: '#F0F0F3',
    colorPlaceholder: '#9CA3AF',
    radius: 16,
    spacing: 8,
    shadowColor: '#000000',
    shadowBlur: 20,
  },
  
  glass: {
    font: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    colorPrimary: '#06B6D4',
    colorBackground: 'rgba(255, 255, 255, 0.1)',
    colorText: '#1F2937',
    colorBorder: 'rgba(255, 255, 255, 0.18)',
    colorInputBg: 'rgba(255, 255, 255, 0.05)',
    colorPlaceholder: '#6B7280',
    radius: 20,
    spacing: 8,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowBlur: 15,
  },
};

/**
 * Get design tokens for a specific style preset
 */
export function getDesignTokens(style: 'minimal' | 'neumorphic' | 'glass' = 'minimal'): DesignTokenSet {
  return designTokens[style] || designTokens.minimal;
}

/**
 * Calculate spacing based on 8px grid
 */
export function gridSpacing(multiplier: number, tokens: DesignTokenSet = designTokens.minimal): number {
  return tokens.spacing * multiplier;
}

/**
 * Form dimensions constants
 */
export const FORM_DIMENSIONS = {
  width: 400,
  inputHeight: 44,
  buttonHeight: 48,
  headerFontSize: 24,
  bodyFontSize: 14,
  labelFontSize: 12,
  minSpacing: 8,
  sectionSpacing: 24,
};

