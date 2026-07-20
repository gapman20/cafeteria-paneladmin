import React from 'react';

/**
 * ErrorBoundary - Catches JavaScript errors in child components
 * and displays a fallback UI with retry logic.
 *
 * Props:
 *   maxRetries {number}  Max retry attempts (default 3)
 *   onError    {fn}      Optional callback when error is caught
 *
 * Usage:
 * <ErrorBoundary maxRetries={3}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState(prev => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  render() {
    const maxRetries = this.props.maxRetries || 3;
    const { retryCount } = this.state;

    if (this.state.hasError) {
      const canRetry = retryCount < maxRetries;

      return (
        <div style={{
          padding: '2rem',
          margin: '2rem',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>
            Algo salió mal
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            {this.state.error?.message || 'Error inesperado'}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginBottom: '1.5rem', opacity: 0.7 }}>
            {canRetry
              ? `Reintentos: ${retryCount}/${maxRetries}`
              : 'Se agotaron los intentos de reintento.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {canRetry ? (
              <button
                onClick={this.handleRetry}
                style={{
                  padding: '10px 24px',
                  background: 'var(--accent-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Reintentar
              </button>
            ) : (
              <p style={{ color: '#ef4444', fontWeight: '600', marginBottom: '1rem' }}>
                Contactar al administrador para resolver este problema.
              </p>
            )}
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '10px 24px',
                background: 'transparent',
                color: 'var(--text-secondary)',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Recargar
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
