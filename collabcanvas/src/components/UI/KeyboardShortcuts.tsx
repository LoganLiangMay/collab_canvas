import React from 'react';
import { X, Command } from 'lucide-react';
import styles from './KeyboardShortcuts.module.css';

interface KeyboardShortcutsProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Shortcut {
  category: string;
  shortcuts: {
    action: string;
    keys: string[];
    description?: string;
  }[];
}

const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;

const SHORTCUTS: Shortcut[] = [
  {
    category: 'Editing',
    shortcuts: [
      {
        action: 'Copy',
        keys: isMac ? ['⌘', 'C'] : ['Ctrl', 'C'],
      },
      {
        action: 'Paste',
        keys: isMac ? ['⌘', 'V'] : ['Ctrl', 'V'],
      },
      {
        action: 'Duplicate',
        keys: isMac ? ['⌘', 'D'] : ['Ctrl', 'D'],
      },
      {
        action: 'Undo',
        keys: isMac ? ['⌘', 'Z'] : ['Ctrl', 'Z'],
      },
      {
        action: 'Redo',
        keys: isMac ? ['⌘', '⇧', 'Z'] : ['Ctrl', '⇧', 'Z'],
      },
      {
        action: 'Redo (Alternative)',
        keys: isMac ? ['⌘', 'Y'] : ['Ctrl', 'Y'],
      },
      {
        action: 'Delete Selected',
        keys: ['Delete'],
        description: 'or Backspace',
      },
    ],
  },
  {
    category: 'Layer Order',
    shortcuts: [
      {
        action: 'Bring to Front',
        keys: isMac ? ['⌘', ']'] : ['Ctrl', ']'],
      },
      {
        action: 'Send to Back',
        keys: isMac ? ['⌘', '['] : ['Ctrl', '['],
      },
      {
        action: 'Bring Forward',
        keys: isMac ? ['⌥', '⌘', ']'] : ['Alt', 'Ctrl', ']'],
        description: 'move up one layer',
      },
      {
        action: 'Send Backward',
        keys: isMac ? ['⌥', '⌘', '['] : ['Alt', 'Ctrl', '['],
        description: 'move down one layer',
      },
    ],
  },
  {
    category: 'Canvas',
    shortcuts: [
      {
        action: 'Pan Canvas',
        keys: ['Click & Drag'],
        description: 'on empty space',
      },
      {
        action: 'Zoom In/Out',
        keys: ['Scroll'],
        description: 'mouse wheel',
      },
      {
        action: 'Cancel Creation',
        keys: ['Esc'],
        description: 'while creating shape',
      },
    ],
  },
  {
    category: 'Text Editing',
    shortcuts: [
      {
        action: 'Save Text',
        keys: ['Enter'],
        description: 'while editing',
      },
      {
        action: 'Cancel Text Edit',
        keys: ['Esc'],
        description: 'while editing',
      },
      {
        action: 'New Line',
        keys: ['⇧', 'Enter'],
        description: 'in text box',
      },
    ],
  },
  {
    category: 'Selection',
    shortcuts: [
      {
        action: 'Select Shape',
        keys: ['Click'],
        description: 'on shape',
      },
      {
        action: 'Multi-Select',
        keys: ['⇧', 'Click'],
        description: 'add/remove from selection',
      },
      {
        action: 'Select All',
        keys: isMac ? ['⌘', 'A'] : ['Ctrl', 'A'],
      },
      {
        action: 'Deselect All',
        keys: ['Esc'],
      },
      {
        action: 'Box Select',
        keys: ['Drag'],
        description: 'in select mode',
      },
    ],
  },
];

export default function KeyboardShortcuts({ isOpen, onClose }: KeyboardShortcutsProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerTitle}>
            <Command size={24} strokeWidth={2} />
            <h2>Keyboard Shortcuts</h2>
          </div>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close shortcuts panel"
          >
            <X size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {SHORTCUTS.map((category) => (
            <div key={category.category} className={styles.category}>
              <h3 className={styles.categoryTitle}>{category.category}</h3>
              <div className={styles.shortcutsList}>
                {category.shortcuts.map((shortcut, index) => (
                  <div key={index} className={styles.shortcutItem}>
                    <div className={styles.actionLabel}>
                      {shortcut.action}
                      {shortcut.description && (
                        <span className={styles.description}>
                          {shortcut.description}
                        </span>
                      )}
                    </div>
                    <div className={styles.keys}>
                      {shortcut.keys.map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <kbd className={styles.key}>{key}</kbd>
                          {keyIndex < shortcut.keys.length - 1 && (
                            <span className={styles.plus}>+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <p className={styles.footerText}>
            Press <kbd className={styles.key}>?</kbd> anytime to show this panel
          </p>
        </div>
      </div>
    </div>
  );
}

