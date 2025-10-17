import { useEffect, useRef } from 'react';
import { 
  ChevronsUp, 
  ChevronsDown, 
  ArrowUp, 
  ArrowDown,
  Copy,
  Clipboard,
  Trash2
} from 'lucide-react';
import styles from './ContextMenu.module.css';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDuplicate?: () => void;
  onDelete: () => void;
  selectedCount: number;
}

export default function ContextMenu({
  x,
  y,
  onClose,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  onCopy,
  onPaste,
  onDuplicate,
  onDelete,
  selectedCount
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Add listeners with slight delay to prevent immediate close
    setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }, 0);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Adjust position if menu goes off screen
  useEffect(() => {
    if (menuRef.current) {
      const rect = menuRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let adjustedX = x;
      let adjustedY = y;

      // Adjust if going off right edge
      if (rect.right > viewportWidth) {
        adjustedX = viewportWidth - rect.width - 10;
      }

      // Adjust if going off bottom edge
      if (rect.bottom > viewportHeight) {
        adjustedY = viewportHeight - rect.height - 10;
      }

      menuRef.current.style.left = `${adjustedX}px`;
      menuRef.current.style.top = `${adjustedY}px`;
    }
  }, [x, y]);

  const handleAction = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <div 
      ref={menuRef}
      className={styles.menu}
      style={{ left: x, top: y }}
    >
      <div className={styles.header}>
        {selectedCount} {selectedCount === 1 ? 'Shape' : 'Shapes'} Selected
      </div>

      {/* Layer Operations */}
      <div className={styles.section}>
        <div className={styles.sectionLabel}>Layer Order</div>
        
        <button 
          className={styles.menuItem}
          onClick={() => handleAction(onBringToFront)}
        >
          <ChevronsUp size={16} strokeWidth={2} />
          <span>Bring to Front</span>
          <span className={styles.shortcut}>⌘]</span>
        </button>

        <button 
          className={styles.menuItem}
          onClick={() => handleAction(onBringForward)}
        >
          <ArrowUp size={16} strokeWidth={2} />
          <span>Bring Forward</span>
          <span className={styles.shortcut}>⌥⌘]</span>
        </button>

        <button 
          className={styles.menuItem}
          onClick={() => handleAction(onSendBackward)}
        >
          <ArrowDown size={16} strokeWidth={2} />
          <span>Send Backward</span>
          <span className={styles.shortcut}>⌥⌘[</span>
        </button>

        <button 
          className={styles.menuItem}
          onClick={() => handleAction(onSendToBack)}
        >
          <ChevronsDown size={16} strokeWidth={2} />
          <span>Send to Back</span>
          <span className={styles.shortcut}>⌘[</span>
        </button>
      </div>

      <div className={styles.divider} />

      {/* Clipboard Actions */}
      <div className={styles.section}>
        {onCopy && (
          <button 
            className={styles.menuItem}
            onClick={() => handleAction(onCopy)}
          >
            <Copy size={16} strokeWidth={2} />
            <span>Copy</span>
            <span className={styles.shortcut}>⌘C</span>
          </button>
        )}

        {onPaste && (
          <button 
            className={styles.menuItem}
            onClick={() => handleAction(onPaste)}
          >
            <Clipboard size={16} strokeWidth={2} />
            <span>Paste</span>
            <span className={styles.shortcut}>⌘V</span>
          </button>
        )}

        {onDuplicate && (
          <button 
            className={styles.menuItem}
            onClick={() => handleAction(onDuplicate)}
          >
            <Copy size={16} strokeWidth={2} />
            <span>Duplicate</span>
            <span className={styles.shortcut}>⌘D</span>
          </button>
        )}
      </div>

      <div className={styles.divider} />

      {/* Delete Action */}
      <div className={styles.section}>
        <button 
          className={`${styles.menuItem} ${styles.danger}`}
          onClick={() => handleAction(onDelete)}
        >
          <Trash2 size={16} strokeWidth={2} />
          <span>Delete</span>
          <span className={styles.shortcut}>⌫</span>
        </button>
      </div>
    </div>
  );
}

