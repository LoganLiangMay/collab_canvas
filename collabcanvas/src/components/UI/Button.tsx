import type { ReactNode, CSSProperties } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  style?: CSSProperties;
}

export default function Button({ children, onClick, disabled = false, style = {} }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '8px 16px',
        backgroundColor: disabled ? '#95a5a6' : (style.background as string || '#3498db'),
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 0.2s',
        ...style,
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          const currentBg = style.background || '#3498db';
          e.currentTarget.style.backgroundColor = currentBg === '#f39c12' ? '#e67e22' : '#2980b9';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.currentTarget.style.backgroundColor = (style.background as string || '#3498db');
        }
      }}
    >
      {children}
    </button>
  );
}

