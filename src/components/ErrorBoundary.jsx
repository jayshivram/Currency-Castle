import React from 'react'

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('App crashed:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0A0F1D',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '16px',
          fontFamily: 'Inter, sans-serif',
          color: '#e2e8f0',
          padding: '32px',
        }}>
          <div style={{ fontSize: '48px' }}>⚠️</div>
          <h2 style={{ color: '#f87171', margin: 0 }}>Something went wrong</h2>
          <pre style={{
            background: 'rgba(248,113,113,0.1)',
            border: '1px solid rgba(248,113,113,0.3)',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '12px',
            color: '#fca5a5',
            maxWidth: '700px',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #0891b2)',
              color: '#0A0F1D',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Reload Page
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
