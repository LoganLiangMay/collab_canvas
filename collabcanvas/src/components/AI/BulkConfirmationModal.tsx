/**
 * Bulk Confirmation Modal
 * Confirms with user before creating 100+ shapes
 */

import React from 'react';
import './BulkConfirmationModal.module.css';

interface BulkConfirmationModalProps {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BulkConfirmationModal({ count, onConfirm, onCancel }: BulkConfirmationModalProps) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>Create {count} shapes?</h3>
        <p>
          This will create <strong>{count} shapes</strong> on the canvas. 
          {count >= 500 && ' This may take a few seconds.'}
        </p>
        <div className="modal-actions">
          <button onClick={onCancel} className="button-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="button-primary">
            Create {count} Shapes
          </button>
        </div>
      </div>
    </div>
  );
}

