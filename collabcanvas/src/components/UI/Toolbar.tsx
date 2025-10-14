import Button from './Button';

interface ToolbarProps {
  onAddRectangle: () => void;
  onDeleteSelected?: () => void;
  selectedId: string | null;
  onStressTest?: () => void;
}

export default function Toolbar({ onAddRectangle, onDeleteSelected, selectedId, onStressTest }: ToolbarProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        zIndex: 1000,
        background: 'rgba(30, 30, 30, 0.95)',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        gap: '8px',
      }}
    >
      <Button onClick={onAddRectangle}>
        Add Rectangle
      </Button>
      
      {/* Delete Button - Only enabled when shape is selected */}
      {onDeleteSelected && (
        <Button 
          onClick={onDeleteSelected}
          disabled={!selectedId}
          style={{
            background: '#e74c3c',
          }}
        >
          Delete Selected
        </Button>
      )}
      
      {/* Stress Test Button - Development Only */}
      {import.meta.env.DEV && onStressTest && (
        <Button 
          onClick={onStressTest}
          style={{
            background: '#f39c12',
          }}
        >
          Stress Test (100 shapes)
        </Button>
      )}
    </div>
  );
}

