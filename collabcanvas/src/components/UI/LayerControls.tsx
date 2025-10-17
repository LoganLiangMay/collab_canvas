import { 
  ArrowUp, 
  ArrowDown, 
  ChevronsUp, 
  ChevronsDown 
} from 'lucide-react';
import styles from './LayerControls.module.css';

interface LayerControlsProps {
  onBringToFront: () => void;
  onSendToBack: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  selectedCount: number;
}

export default function LayerControls({ 
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  selectedCount 
}: LayerControlsProps) {
  // Only show if shapes are selected
  if (selectedCount === 0) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <h3 className={styles.title}>Layer Order</h3>
        <p className={styles.subtitle}>{selectedCount} {selectedCount === 1 ? 'shape' : 'shapes'}</p>
      </div>

      <div className={styles.content}>
        {/* Bring to Front / Send to Back */}
        <div className={styles.section}>
          <div className={styles.label}>Position</div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.button}
              onClick={onBringToFront}
              title="Bring to Front (⌘])"
              aria-label="Bring to front"
            >
              <ChevronsUp size={18} strokeWidth={2} />
              <span className={styles.buttonText}>To Front</span>
            </button>
            <button
              className={styles.button}
              onClick={onSendToBack}
              title="Send to Back (⌘[)"
              aria-label="Send to back"
            >
              <ChevronsDown size={18} strokeWidth={2} />
              <span className={styles.buttonText}>To Back</span>
            </button>
          </div>
        </div>

        {/* Move Up / Move Down */}
        <div className={styles.section}>
          <div className={styles.label}>Arrange</div>
          <div className={styles.buttonGroup}>
            <button
              className={styles.button}
              onClick={onBringForward}
              title="Bring Forward (⌥⌘])"
              aria-label="Bring forward"
            >
              <ArrowUp size={18} strokeWidth={2} />
              <span className={styles.buttonText}>Forward</span>
            </button>
            <button
              className={styles.button}
              onClick={onSendBackward}
              title="Send Backward (⌥⌘[)"
              aria-label="Send backward"
            >
              <ArrowDown size={18} strokeWidth={2} />
              <span className={styles.buttonText}>Backward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

