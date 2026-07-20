import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SiteProvider } from '../../context/SiteContext';
import { BrowserRouter } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

function createWrapper() {
  return function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <SiteProvider>{children}</SiteProvider>
      </BrowserRouter>
    );
  };
}

describe('useAuth hook', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('starts with isAuthenticated as false', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('login returns true on valid credentials', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success;
    await act(async () => {
      success = await result.current.login('admin@admin.com', 'admin123');
    });

    expect(success).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('login returns false on invalid credentials', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    let success;
    await act(async () => {
      success = await result.current.login('wrong@test.com', 'wrongpass');
    });

    expect(success).toBe(false);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('logout clears authentication state', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    await act(async () => {
      await result.current.login('admin@admin.com', 'admin123');
    });
    expect(result.current.isAuthenticated).toBe(true);

    // Logout
    await act(async () => {
      await result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('persists session across re-renders', async () => {
    const wrapper = createWrapper();
    const { result, rerender } = renderHook(() => useAuth(), { wrapper });

    // Login
    await act(async () => {
      await result.current.login('admin@admin.com', 'admin123');
    });

    // Re-render
    rerender();

    expect(result.current.isAuthenticated).toBe(true);
  });
});
