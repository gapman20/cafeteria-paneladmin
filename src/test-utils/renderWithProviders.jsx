import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SiteProvider } from '../context/SiteContext';

/**
 * Wraps a component with SiteProvider and BrowserRouter for testing.
 * @param {React.ReactNode} ui - Component to render
 * @param {object} [options] - Additional render options
 * @returns {import('@testing-library/react').RenderResult}
 */
export function renderWithProviders(ui, options = {}) {
  const Wrapper = ({ children }) => (
    <BrowserRouter>
      <SiteProvider>{children}</SiteProvider>
    </BrowserRouter>
  );

  return render(ui, { wrapper: Wrapper, ...options });
}

export default renderWithProviders;
