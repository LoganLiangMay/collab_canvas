/**
 * Form Layout Types
 * 
 * TypeScript definitions for AI-generated form structures.
 * These types define the JSON schema that OpenAI returns when generating forms.
 */

export type ComponentType = 'Container' | 'Text' | 'Input' | 'Button' | 'Checkbox' | 'Shape';

export type TextVariant = 'header' | 'body' | 'caption' | 'label';
export type ButtonStyle = 'primary' | 'secondary' | 'ghost';
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel';

export interface ComponentProps {
  value?: string;
  label?: string;
  placeholder?: string;
  variant?: TextVariant;
  style?: ButtonStyle;
  type?: InputType;
  required?: boolean;
  width?: number;
  height?: number;
}

export interface FormComponent {
  type: ComponentType;
  props: ComponentProps;
  children?: FormComponent[];
}

export type FormLayout = 'centered' | 'left' | 'right';
export type StylePreset = 'minimal' | 'neumorphic' | 'glass';

export interface FormDefinition {
  type: 'Form';
  layout: FormLayout;
  style?: StylePreset;
  components: FormComponent[];
}

/**
 * Internal representation for canvas rendering
 */
export interface CanvasFormComponent {
  id: string;
  type: ComponentType;
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  fill?: string;
  stroke?: string;
  textColor?: string;
  zIndex?: number; // Stacking order (0 = back, higher = front)
  props: ComponentProps;
}

