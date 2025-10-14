import { Component, type ReactNode, type ErrorInfo } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem',
          background: '#1e1e1e',
          color: 'white',
        }}>
          <div style={{
            maxWidth: '600px',
            textAlign: 'center',
          }}>
            <h1 style={{ 
              fontSize: '2rem', 
              marginBottom: '1rem',
              color: '#e74c3c',
            }}>
              Oops! Something went wrong
            </h1>
            
            <p style={{
              fontSize: '1.1rem',
              marginBottom: '2rem',
              color: '#bdc3c7',
            }}>
              The application encountered an unexpected error. Please try reloading the page.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <details style={{
                marginBottom: '2rem',
                padding: '1rem',
                background: 'rgba(231, 76, 60, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(231, 76, 60, 0.3)',
                textAlign: 'left',
              }}>
                <summary style={{ 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  marginBottom: '1rem',
                  color: '#e74c3c',
                }}>
                  Error Details (Development Mode)
                </summary>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                  color: '#ecf0f1',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  <strong>Error:</strong> {this.state.error.message}
                  {this.state.error.stack && (
                    <>
                      <br /><br />
                      <strong>Stack Trace:</strong>
                      <br />
                      {this.state.error.stack}
                    </>
                  )}
                  {this.state.errorInfo && (
                    <>
                      <br /><br />
                      <strong>Component Stack:</strong>
                      <br />
                      {this.state.errorInfo.componentStack}
                    </>
                  )}
                </div>
              </details>
            )}

            <button
              onClick={this.handleReload}
              style={{
                padding: '12px 24px',
                fontSize: '1rem',
                fontWeight: 'bold',
                background: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2980b9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#3498db';
              }}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;



