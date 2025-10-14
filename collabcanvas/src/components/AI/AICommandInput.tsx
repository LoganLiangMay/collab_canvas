import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import styles from './AICommandInput.module.css';

interface AICommandInputProps {
  onExecuteCommand: (command: string) => Promise<void>;
  isProcessing: boolean;
  aiEnabled: boolean;
}

export default function AICommandInput({ onExecuteCommand, isProcessing, aiEnabled }: AICommandInputProps) {
  const [command, setCommand] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim() || isProcessing) {
      return;
    }

    setError(null);

    try {
      await onExecuteCommand(command);
      setCommand(''); // Clear input on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute command');
    }
  };

  if (!aiEnabled) {
    return (
      <div className={styles.aiInputDisabled}>
        <Sparkles size={16} />
        <span>AI features require OpenAI API key</span>
      </div>
    );
  }

  return (
    <div className={styles.aiInput}>
      <div className={styles.header}>
        <Sparkles size={16} />
        <span className={styles.title}>AI Assistant</span>
        <span className={styles.badge}>Beta</span>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Try: 'create red circle' or 'create blue rectangle'"
          className={styles.input}
          disabled={isProcessing}
        />
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isProcessing || !command.trim()}
          title="Send command"
        >
          <Send size={16} />
        </button>
      </form>

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      {isProcessing && (
        <div className={styles.processing}>
          Processing command...
        </div>
      )}

      <div className={styles.examples}>
        <div className={styles.examplesTitle}>Example commands:</div>
        <div className={styles.examplesList}>
          <code onClick={() => setCommand('create red circle')}>create red circle</code>
          <code onClick={() => setCommand('create blue rectangle')}>create blue rectangle</code>
          <code onClick={() => setCommand('create green circle')}>create green circle</code>
        </div>
      </div>
    </div>
  );
}

