import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SiteProvider, useSite } from '../../context/SiteContext';
import { BrowserRouter } from 'react-router-dom';

function createWrapper() {
  return function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <SiteProvider>{children}</SiteProvider>
      </BrowserRouter>
    );
  };
}

describe('SiteContext integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides default content on first render', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSite(), { wrapper });
    expect(result.current.content.siteName).toBe('Café Aromático');
  });

  it('updateContent modifies content via dot-path', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSite(), { wrapper });

    act(() => {
      result.current.updateContent('home.title', 'New Title');
    });

    expect(result.current.content.home.title).toBe('New Title');
  });

  it('updateImage sets image by key', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSite(), { wrapper });

    act(() => {
      result.current.updateImage('logo', 'data:image/png;base64,fake');
    });

    expect(result.current.images.logo).toBe('data:image/png;base64,fake');
  });

  it('removeImage clears image by key', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSite(), { wrapper });

    act(() => {
      result.current.updateImage('logo', 'data:image/png;base64,fake');
    });
    expect(result.current.images.logo).toBeTruthy();

    act(() => {
      result.current.removeImage('logo');
    });
    expect(result.current.images.logo).toBeNull();
  });

  it('addMessage creates inbox entry', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSite(), { wrapper });

    act(() => {
      result.current.addMessage({ name: 'Test', email: 'test@test.com', message: 'Hi' });
    });

    expect(result.current.inbox).toHaveLength(1);
    expect(result.current.inbox[0].name).toBe('Test');
  });

  it('markMessageRead updates read status', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSite(), { wrapper });

    act(() => {
      result.current.addMessage({ name: 'Test', email: 'test@test.com', message: 'Hi' });
    });

    const msgId = result.current.inbox[0].id;

    act(() => {
      result.current.markMessageRead(msgId);
    });

    expect(result.current.inbox[0].read).toBe(true);
  });

  it('deleteMessage removes inbox entry', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSite(), { wrapper });

    act(() => {
      result.current.addMessage({ name: 'Test', email: 'test@test.com', message: 'Hi' });
    });

    const msgId = result.current.inbox[0].id;

    act(() => {
      result.current.deleteMessage(msgId);
    });

    expect(result.current.inbox).toHaveLength(0);
  });
});
