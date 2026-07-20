import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../../components/ErrorBoundary';

// Component that throws on render
function ThrowingComponent({ shouldThrow = true }) {
  if (shouldThrow) throw new Error('Test error');
  return <div>Child rendered</div>;
}

function NonThrowingComponent() {
  return <div>Normal content</div>;
}

describe('ErrorBoundary', () => {
  // Suppress console.error for expected test errors
  const originalError = console.error;
  beforeEach(() => {
    console.error = vi.fn();
    return () => { console.error = originalError; };
  });

  it('renders children normally when no error', () => {
    render(
      <ErrorBoundary>
        <NonThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Normal content')).toBeDefined();
  });

  it('catches child errors and shows fallback UI', () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText('Algo salió mal')).toBeDefined();
    expect(screen.getByText('Test error')).toBeDefined();
  });

  it('shows retry button that resets error state', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Algo salió mal')).toBeDefined();

    // Fix the child so retry succeeds
    rerender(
      <ErrorBoundary>
        <ThrowingComponent shouldThrow={false} />
      </ErrorBoundary>
    );

    // Click retry
    const retryBtn = screen.getByText('Reintentar');
    fireEvent.click(retryBtn);

    // After retry, children should render
    expect(screen.getByText('Child rendered')).toBeDefined();
  });

  it('replaces retry with permanent fallback after max retries', () => {
    const { rerender } = render(
      <ErrorBoundary maxRetries={2}>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    // Retry twice
    for (let i = 0; i < 2; i++) {
      const retryBtn = screen.getByText('Reintentar');
      fireEvent.click(retryBtn);
      // Re-render with error still throwing
      rerender(
        <ErrorBoundary maxRetries={2}>
          <ThrowingComponent />
        </ErrorBoundary>
      );
    }

    // After max retries, retry button should be gone
    expect(screen.queryByText('Reintentar')).toBeNull();
    // Permanent fallback message should appear
    expect(screen.getByText(/Contactar al administrador/)).toBeDefined();
  });
});
