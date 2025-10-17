import { Layers } from 'lucide-react';
import styles from './SelectionIndicator.module.css';

interface SelectionIndicatorProps {
  count: number;
}

export default function SelectionIndicator({ count }: SelectionIndicatorProps) {
  if (count === 0) return null;

  return (
    <div className={styles.indicator}>
      <Layers size={16} strokeWidth={2} />
      <span className={styles.count}>
        {count} {count === 1 ? 'shape' : 'shapes'} selected
      </span>
    </div>
  );
}

