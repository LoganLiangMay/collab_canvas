import { useState } from 'react';
import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignStartVertical,
  AlignCenterVertical, 
  AlignEndVertical,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  Maximize2,
  ArrowUp, 
  ArrowDown, 
  ChevronsUp, 
  ChevronsDown 
} from 'lucide-react';
import styles from './ShapeStylePanel.module.css';
import type { Shape } from '../../types/shape.types';

interface ShapeStylePanelProps {
  selectedShape: Shape | null;
  selectedCount: number;
  onColorChange: (color: string) => void;
  onStrokeColorChange?: (color: string) => void;
  onTextColorChange?: (color: string) => void;
  onOpacityChange?: (opacity: number) => void;
  // Alignment props
  onAlign?: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute?: (direction: 'horizontal' | 'vertical') => void;
  onCenterCanvas?: () => void;
  // Layer control props
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
}

export default function ShapeStylePanel({
  selectedShape,
  selectedCount,
  onColorChange,
  onStrokeColorChange,
  onTextColorChange,
  onOpacityChange,
  onAlign,
  onDistribute,
  onCenterCanvas,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
}: ShapeStylePanelProps) {
  const [fillColor, setFillColor] = useState(selectedShape?.fill || '#3498db');
  const [strokeColor, setStrokeColor] = useState(selectedShape?.stroke || '#ffffff');
  const [textColor, setTextColor] = useState('#ffffff');
  const [opacity, setOpacity] = useState((selectedShape?.opacity ?? 1) * 100); // 0-100 for slider

  if (!selectedShape) {
    return null;
  }

  const handleFillColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setFillColor(newColor);
    onColorChange(newColor);
  };

  const handleStrokeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setStrokeColor(newColor);
    if (onStrokeColorChange) {
      onStrokeColorChange(newColor);
    }
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setTextColor(newColor);
    if (onTextColorChange) {
      onTextColorChange(newColor);
    }
  };

  const handleOpacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newOpacity = Number(e.target.value);
    setOpacity(newOpacity);
    if (onOpacityChange) {
      onOpacityChange(newOpacity / 100); // Convert 0-100 to 0-1
    }
  };

  // Preset colors for quick selection
  const presetColors = [
    '#3498db', // Blue
    '#e74c3c', // Red
    '#2ecc71', // Green
    '#f39c12', // Orange
    '#9b59b6', // Purple
    '#1abc9c', // Turquoise
    '#34495e', // Dark Gray
    '#ecf0f1', // Light Gray
    '#ffffff', // White
    '#000000', // Black
  ];

  const getShapeTypeLabel = () => {
    switch (selectedShape.type) {
      case 'rectangle':
        return 'Rectangle';
      case 'circle':
        return 'Circle';
      case 'text':
        return 'Text Box';
      case 'line':
        return 'Line';
      default:
        return 'Shape';
    }
  };

  const showFillColor = selectedShape.type === 'rectangle' || selectedShape.type === 'circle';
  const showStrokeColor = selectedShape.type === 'line';
  const showTextColor = selectedShape.type === 'text';

  return (
    <div className={styles.panel}>
      <div className={styles.content}>
        {/* Fill Color for Rectangles and Circles */}
        {showFillColor && (
          <div className={styles.section}>
            <label className={styles.label}>Fill Color</label>
            <div className={styles.colorControl}>
              <input
                type="color"
                value={fillColor}
                onChange={handleFillColorChange}
                className={styles.colorInput}
              />
              <span className={styles.colorValue}>{fillColor.toUpperCase()}</span>
            </div>
            
            {/* Preset Colors */}
            <div className={styles.presets}>
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={styles.presetButton}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setFillColor(color);
                    onColorChange(color);
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Stroke Color for Lines */}
        {showStrokeColor && (
          <div className={styles.section}>
            <label className={styles.label}>Line Color</label>
            <div className={styles.colorControl}>
              <input
                type="color"
                value={strokeColor}
                onChange={handleStrokeColorChange}
                className={styles.colorInput}
              />
              <span className={styles.colorValue}>{strokeColor.toUpperCase()}</span>
            </div>
            
            {/* Preset Colors */}
            <div className={styles.presets}>
              {presetColors.map((color) => (
                <button
                  key={color}
                  className={styles.presetButton}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setStrokeColor(color);
                    if (onStrokeColorChange) {
                      onStrokeColorChange(color);
                    }
                  }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}

        {/* Text Color for Text Boxes */}
        {showTextColor && (
          <>
            <div className={styles.section}>
              <label className={styles.label}>Fill Color</label>
              <div className={styles.colorControl}>
                <input
                  type="color"
                  value={fillColor}
                  onChange={handleFillColorChange}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{fillColor.toUpperCase()}</span>
              </div>
              
              {/* Preset Colors */}
              <div className={styles.presets}>
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className={styles.presetButton}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setFillColor(color);
                      onColorChange(color);
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            <div className={styles.section}>
              <label className={styles.label}>Text Color</label>
              <div className={styles.colorControl}>
                <input
                  type="color"
                  value={textColor}
                  onChange={handleTextColorChange}
                  className={styles.colorInput}
                />
                <span className={styles.colorValue}>{textColor.toUpperCase()}</span>
              </div>
              
              {/* Preset Colors */}
              <div className={styles.presets}>
                {presetColors.map((color) => (
                  <button
                    key={color}
                    className={styles.presetButton}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setTextColor(color);
                      if (onTextColorChange) {
                        onTextColorChange(color);
                      }
                    }}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {/* Opacity Control - available for all shapes */}
        <div className={styles.section}>
          <label className={styles.label}>Opacity</label>
          <div className={styles.opacityControl}>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={handleOpacityChange}
              className={styles.opacitySlider}
            />
            <span className={styles.opacityValue}>{Math.round(opacity)}%</span>
          </div>
        </div>

        {/* Alignment Tools - show if 2+ shapes selected */}
        {selectedCount >= 2 && onAlign && onDistribute && onCenterCanvas && (
          <>
            <div className={styles.divider}></div>
            <div className={styles.sectionGroup}>
              <h4 className={styles.sectionTitle}>Alignment</h4>
              
              {/* Horizontal Alignment */}
              <div className={styles.section}>
                <div className={styles.label}>Horizontal</div>
                <div className={styles.alignmentButtons}>
                  <button
                    className={styles.iconButton}
                    onClick={() => onAlign('left')}
                    title="Align Left"
                    aria-label="Align left"
                  >
                    <AlignLeft size={18} strokeWidth={2} />
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={() => onAlign('center')}
                    title="Align Center"
                    aria-label="Align center horizontally"
                  >
                    <AlignCenter size={18} strokeWidth={2} />
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={() => onAlign('right')}
                    title="Align Right"
                    aria-label="Align right"
                  >
                    <AlignRight size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Vertical Alignment */}
              <div className={styles.section}>
                <div className={styles.label}>Vertical</div>
                <div className={styles.alignmentButtons}>
                  <button
                    className={styles.iconButton}
                    onClick={() => onAlign('top')}
                    title="Align Top"
                    aria-label="Align top"
                  >
                    <AlignStartVertical size={18} strokeWidth={2} />
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={() => onAlign('middle')}
                    title="Align Middle"
                    aria-label="Align middle vertically"
                  >
                    <AlignCenterVertical size={18} strokeWidth={2} />
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={() => onAlign('bottom')}
                    title="Align Bottom"
                    aria-label="Align bottom"
                  >
                    <AlignEndVertical size={18} strokeWidth={2} />
                  </button>
                </div>
              </div>

              {/* Distribution */}
              <div className={styles.section}>
                <div className={styles.label}>Distribute</div>
                <div className={styles.alignmentButtons}>
                  <button
                    className={styles.iconButton}
                    onClick={() => onDistribute('horizontal')}
                    title="Distribute Horizontally"
                    aria-label="Distribute horizontally"
                  >
                    <AlignHorizontalSpaceAround size={18} strokeWidth={2} />
                    <span className={styles.buttonTextSmall}>H</span>
                  </button>
                  <button
                    className={styles.iconButton}
                    onClick={() => onDistribute('vertical')}
                    title="Distribute Vertically"
                    aria-label="Distribute vertically"
                  >
                    <AlignVerticalSpaceAround size={18} strokeWidth={2} />
                    <span className={styles.buttonTextSmall}>V</span>
                  </button>
                </div>
              </div>

              {/* Center on Canvas */}
              <div className={styles.section}>
                <button
                  className={styles.fullWidthButton}
                  onClick={onCenterCanvas}
                  title="Center on Canvas"
                  aria-label="Center on canvas"
                >
                  <Maximize2 size={18} strokeWidth={2} />
                  <span>Center on Canvas</span>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Layer Controls - show if shapes selected */}
        {selectedCount >= 1 && onBringToFront && onSendToBack && onBringForward && onSendBackward && (
          <>
            <div className={styles.divider}></div>
            <div className={styles.sectionGroup}>
              <h4 className={styles.sectionTitle}>Layer Order</h4>
              
              {/* Bring to Front / Send to Back */}
              <div className={styles.section}>
                <div className={styles.label}>Position</div>
                <div className={styles.layerButtons}>
                  <button
                    className={styles.layerButton}
                    onClick={onBringToFront}
                    title="Bring to Front (⌘])"
                    aria-label="Bring to front"
                  >
                    <ChevronsUp size={18} strokeWidth={2} />
                    <span>To Front</span>
                  </button>
                  <button
                    className={styles.layerButton}
                    onClick={onSendToBack}
                    title="Send to Back (⌘[)"
                    aria-label="Send to back"
                  >
                    <ChevronsDown size={18} strokeWidth={2} />
                    <span>To Back</span>
                  </button>
                </div>
              </div>

              {/* Move Up / Move Down */}
              <div className={styles.section}>
                <div className={styles.label}>Arrange</div>
                <div className={styles.layerButtons}>
                  <button
                    className={styles.layerButton}
                    onClick={onBringForward}
                    title="Bring Forward (⌥⌘])"
                    aria-label="Bring forward"
                  >
                    <ArrowUp size={18} strokeWidth={2} />
                    <span>Forward</span>
                  </button>
                  <button
                    className={styles.layerButton}
                    onClick={onSendBackward}
                    title="Send Backward (⌥⌘[)"
                    aria-label="Send backward"
                  >
                    <ArrowDown size={18} strokeWidth={2} />
                    <span>Backward</span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

