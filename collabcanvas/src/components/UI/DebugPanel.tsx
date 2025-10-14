import { useState } from 'react';
import { errorLogger } from '../../utils/errorLogger';

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'errors' | 'warnings'>('all');

  const logs = selectedTab === 'all' 
    ? errorLogger.getLogs()
    : selectedTab === 'errors'
    ? errorLogger.getLogsBySeverity('error')
    : errorLogger.getLogsBySeverity('warning');

  const recentLogs = errorLogger.getRecentLogs(10); // Last 10 minutes
  const errorCount = errorLogger.getLogsBySeverity('error').length;
  const warningCount = errorLogger.getLogsBySeverity('warning').length;

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  const handleExportLogs = () => {
    const logsJson = errorLogger.exportLogs();
    const blob = new Blob([logsJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `error-logs-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearLogs = () => {
    if (confirm('Are you sure you want to clear all logs?')) {
      errorLogger.clearLogs();
      setIsOpen(false);
      setTimeout(() => setIsOpen(true), 0); // Force re-render
    }
  };

  if (!import.meta.env.DEV) {
    return null; // Only show in development
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '50px',
          left: '16px',
          zIndex: 2000,
          background: errorCount > 0 ? '#e74c3c' : warningCount > 0 ? '#f39c12' : '#2ecc71',
          color: '#fff',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          cursor: 'pointer',
          fontSize: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
        }}
        title={`Debug Panel (${errorCount} errors, ${warningCount} warnings)`}
      >
        🐛
      </button>

      {/* Debug Panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '100px',
            left: '16px',
            width: '600px',
            maxHeight: '500px',
            background: 'rgba(30, 30, 30, 0.98)',
            border: '1px solid #444',
            borderRadius: '8px',
            zIndex: 2000,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #444',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3 style={{ margin: 0, color: '#fff', fontSize: '16px' }}>
              Debug Panel
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleExportLogs}
                style={{
                  background: '#3498db',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Export
              </button>
              <button
                onClick={handleClearLogs}
                style={{
                  background: '#e74c3c',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Clear
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'transparent',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '0 4px',
                }}
              >
                ×
              </button>
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #444',
              display: 'flex',
              gap: '16px',
              fontSize: '14px',
            }}
          >
            <div style={{ color: '#e74c3c' }}>
              ❌ {errorCount} Errors
            </div>
            <div style={{ color: '#f39c12' }}>
              ⚠️ {warningCount} Warnings
            </div>
            <div style={{ color: '#3498db' }}>
              📊 {recentLogs.length} in last 10min
            </div>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid #444',
              padding: '0 16px',
            }}
          >
            {(['all', 'errors', 'warnings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                style={{
                  background: selectedTab === tab ? '#3498db' : 'transparent',
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  textTransform: 'capitalize',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Logs */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px 16px',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          >
            {logs.length === 0 ? (
              <div style={{ color: '#888', textAlign: 'center', padding: '20px' }}>
                No logs to display
              </div>
            ) : (
              logs.map((log, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: '12px',
                    padding: '8px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '4px',
                    borderLeft: `3px solid ${
                      log.severity === 'error'
                        ? '#e74c3c'
                        : log.severity === 'warning'
                        ? '#f39c12'
                        : '#3498db'
                    }`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: '4px',
                    }}
                  >
                    <span
                      style={{
                        color:
                          log.severity === 'error'
                            ? '#e74c3c'
                            : log.severity === 'warning'
                            ? '#f39c12'
                            : '#3498db',
                        fontWeight: 'bold',
                      }}
                    >
                      {log.severity.toUpperCase()}
                    </span>
                    <span style={{ color: '#888' }}>
                      {formatTimestamp(log.timestamp)}
                    </span>
                  </div>
                  <div style={{ color: '#fff', marginBottom: '4px' }}>
                    {log.message}
                  </div>
                  {log.code && (
                    <div style={{ color: '#f39c12' }}>Code: {log.code}</div>
                  )}
                  {log.context && (
                    <details style={{ marginTop: '4px' }}>
                      <summary
                        style={{
                          color: '#888',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}
                      >
                        View context
                      </summary>
                      <pre
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '10px',
                          color: '#bdc3c7',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {JSON.stringify(log.context, null, 2)}
                      </pre>
                    </details>
                  )}
                  {log.stack && (
                    <details style={{ marginTop: '4px' }}>
                      <summary
                        style={{
                          color: '#888',
                          cursor: 'pointer',
                          fontSize: '11px',
                        }}
                      >
                        View stack trace
                      </summary>
                      <pre
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '10px',
                          color: '#e74c3c',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {log.stack}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}


