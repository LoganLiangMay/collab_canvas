import { 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignStartVertical,
  AlignCenterVertical, 
  AlignEndVertical,
  AlignHorizontalSpaceAround,
  AlignVerticalSpaceAround,
  Maximize2
} from 'lucide-react';
import styles from './AlignmentTools.module.css';

interface AlignmentToolsProps {
  onAlign: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  onDistribute: (direction: 'horizontal' | 'vertical') => void;
  onCenterCanvas: () => void;
  selectedCount: number;
}

export default function AlignmentTools({ 
  onAlign, 
  onDistribute, 
  onCenterCanvas,
  selectedCount 
}: AlignmentToolsProps) {
  // Only show if 2+ shapes selected
  if (selectedCount < 2) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Alignment</h3>
        <p className={styles.subtitle}>{selectedCount} shapes selected</p>
      </div>

      <div className={styles.content}>
        {/* Horizontal Alignment */}
        <div className={styles.section}>
          <div className={styles.label}>Horizontal</div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.button}
              onClick={() => onAlign('left')}
              title="Align Left"
              aria-label="Align left"
            >
              <AlignLeft size={18} strokeWidth={2} />
            </button>
            <button
              className={styles.button}
              onClick={() => onAlign('center')}
              title="Align Center"
              aria-label="Align center horizontally"
            >
              <AlignCenter size={18} strokeWidth={2} />
            </button>
            <button
              className={styles.button}
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
          <div className={styles.buttonGroup}>
            <button
              className={styles.button}
              onClick={() => onAlign('top')}
              title="Align Top"
              aria-label="Align top"
            >
              <AlignStartVertical size={18} strokeWidth={2} />
            </button>
            <button
              className={styles.button}
              onClick={() => onAlign('middle')}
              title="Align Middle"
              aria-label="Align middle vertically"
            >
              <AlignCenterVertical size={18} strokeWidth={2} />
            </button>
            <button
              className={styles.button}
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
          <div className={styles.buttonGroup}>
            <button
              className={styles.button}
              onClick={() => onDistribute('horizontal')}
              title="Distribute Horizontally"
              aria-label="Distribute horizontally"
            >
              <AlignHorizontalSpaceAround size={18} strokeWidth={2} />
              <span className={styles.buttonText}>H</span>
            </button>
            <button
              className={styles.button}
              onClick={() => onDistribute('vertical')}
              title="Distribute Vertically"
              aria-label="Distribute vertically"
            >
              <AlignVerticalSpaceAround size={18} strokeWidth={2} />
              <span className={styles.buttonText}>V</span>
            </button>
          </div>
        </div>

        {/* Center on Canvas */}
        <div className={styles.section}>
          <button
            className={`${styles.button} ${styles.fullWidth}`}
            onClick={onCenterCanvas}
            title="Center on Canvas"
            aria-label="Center on canvas"
          >
            <Maximize2 size={18} strokeWidth={2} />
            <span className={styles.buttonText}>Center on Canvas</span>
          </button>
        </div>
      </div>
    </div>
  );
}

