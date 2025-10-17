import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import styles from './ExportModal.module.css';

interface ExportModalProps {
  onClose: () => void;
  onExportPNG: () => void;
  onExportSVG: () => void;
}

export default function ExportModal({ 
  onClose, 
  onExportPNG, 
  onExportSVG 
}: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<'png' | 'svg'>('png');

  const handleExport = () => {
    if (selectedFormat === 'png') {
      onExportPNG();
    } else {
      onExportSVG();
    }
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Export Canvas</h2>
          <button 
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <p className={styles.description}>
            Export your canvas as an image file. All visible shapes will be included.
          </p>

          {/* Format Selection */}
          <div className={styles.section}>
            <label className={styles.label}>Format</label>
            <div className={styles.formatOptions}>
              <button
                className={`${styles.formatButton} ${selectedFormat === 'png' ? styles.active : ''}`}
                onClick={() => setSelectedFormat('png')}
              >
                <div className={styles.formatIcon}>PNG</div>
                <div className={styles.formatDescription}>
                  Raster image, best for sharing
                </div>
              </button>
              <button
                className={`${styles.formatButton} ${selectedFormat === 'svg' ? styles.active : ''}`}
                onClick={() => setSelectedFormat('svg')}
              >
                <div className={styles.formatIcon}>SVG</div>
                <div className={styles.formatDescription}>
                  Vector image, scalable quality
                </div>
              </button>
            </div>
          </div>

          {/* Info */}
          <div className={styles.infoBox}>
            <strong>Note:</strong> The export will include all shapes currently on the canvas with their current positions, colors, and transformations.
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button 
            className={styles.cancelButton}
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={styles.exportButton}
            onClick={handleExport}
          >
            <Download size={18} strokeWidth={2} />
            <span>Export {selectedFormat.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

