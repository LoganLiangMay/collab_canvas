import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, ChevronDown, ChevronUp, X } from 'lucide-react';
import styles from './AIChatWindow.module.css';
import type { AIChatMessage } from '../../services/aiService';

interface AIChatWindowProps {
  onExecuteCommand: (command: string) => Promise<{ response: string }>;
  isProcessing: boolean;
  aiEnabled: boolean;
  conversationHistory: AIChatMessage[];
}

export default function AIChatWindow({ 
  onExecuteCommand, 
  isProcessing, 
  aiEnabled,
  conversationHistory,
}: AIChatWindowProps) {
  const [command, setCommand] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current && isExpanded) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversationHistory, isExpanded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim() || isProcessing) {
      return;
    }

    setError(null);

    // Add to command history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    const userCommand = command;
    setCommand(''); // Clear input immediately for better UX

    try {
      await onExecuteCommand(userCommand);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute command');
      // Restore command on error so user can retry
      setCommand(userCommand);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Navigate command history with arrow keys
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  if (!aiEnabled) {
    return (
      <div className={styles.aiWindowDisabled}>
        <Sparkles size={16} />
        <span>AI features require OpenAI API key</span>
        <div className={styles.setupHint}>
          Add VITE_OPENAI_API_KEY to your .env.local file
        </div>
      </div>
    );
  }

  // Minimized state - just a square icon
  if (isMinimized) {
    return (
      <button
        className={styles.minimizedIcon}
        onClick={() => setIsMinimized(false)}
        title="Open AI Assistant"
        aria-label="Open AI Assistant"
      >
        <Sparkles size={20} strokeWidth={2} />
        {conversationHistory.length > 0 && (
          <span className={styles.minimizedBadge}>{conversationHistory.length}</span>
        )}
      </button>
    );
  }

  return (
    <div className={`${styles.aiWindow} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      {/* Header / Toggle Bar */}
      <div className={styles.header}>
        <div className={styles.headerLeft} onClick={() => setIsExpanded(!isExpanded)}>
          <Sparkles size={16} />
          <span className={styles.title}>AI Assistant</span>
          <span className={styles.badge}>GPT-4</span>
          {conversationHistory.length > 0 && (
            <span className={styles.messageCount}>{conversationHistory.length} messages</span>
          )}
        </div>
        <div className={styles.headerButtons}>
          <button 
            type="button"
            className={styles.toggleButton}
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Collapse chat' : 'Expand chat'}
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
          <button 
            type="button"
            className={styles.minimizeButton}
            onClick={() => setIsMinimized(true)}
            title="Minimize to icon"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Chat History (shown when expanded) */}
      {isExpanded && (
        <div className={styles.chatContainer} ref={chatContainerRef}>
          {conversationHistory.length === 0 ? (
            <div className={styles.emptyState}>
              <Sparkles size={32} />
              <p>Start a conversation with the AI assistant!</p>
              <p className={styles.emptyHint}>
                Try commands like "create a login form" or "arrange shapes in a grid"
              </p>
            </div>
          ) : (
            <div className={styles.messages}>
              {conversationHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`${styles.message} ${styles[msg.role]}`}
                >
                  <div className={styles.messageHeader}>
                    <span className={styles.messageRole}>
                      {msg.role === 'user' ? 'You' : 'AI'}
                    </span>
                    <span className={styles.messageTime}>
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className={styles.messageContent}>
                    {msg.content}
                  </div>
                  {msg.executionResult && (
                    <div className={`${styles.executionResult} ${msg.executionResult.success ? styles.success : styles.error}`}>
                      <span className={styles.resultIcon}>
                        {msg.executionResult.success ? '✓' : '✗'}
                      </span>
                      <span className={styles.resultText}>
                        {msg.executionResult.shapesCreated && `${msg.executionResult.shapesCreated} shapes created`}
                        {msg.executionResult.shapesModified && `${msg.executionResult.shapesModified} shapes modified`}
                        {msg.executionResult.error && ` - ${msg.executionResult.error}`}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Input Form (always visible) */}
      <div className={styles.inputContainer}>
        {error && (
          <div className={styles.error}>
            <span>{error}</span>
            <button onClick={clearError} className={styles.errorClose}>
              <X size={14} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isProcessing ? "Processing..." : "Ask AI to create, move, or arrange shapes..."}
            className={styles.input}
            disabled={isProcessing}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isProcessing || !command.trim()}
            title="Send command (Enter)"
          >
            {isProcessing ? (
              <div className={styles.spinner} />
            ) : (
              <Send size={16} />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

