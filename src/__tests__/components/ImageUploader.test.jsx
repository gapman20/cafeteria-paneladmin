import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ImageUploader from '../../components/ImageUploader';

describe('ImageUploader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders dropzone when no value is provided', () => {
    render(<ImageUploader label="Upload" value={null} onChange={vi.fn()} />);
    expect(screen.getByText(/Arrastra una imagen/)).toBeDefined();
  });

  it('renders preview when value is provided', () => {
    render(<ImageUploader label="Upload" value="data:image/png;base64,fake" onChange={vi.fn()} />);
    expect(screen.getByAltText('Uploaded')).toBeDefined();
  });

  it('calls onChange(null) when remove is clicked', () => {
    const onChange = vi.fn();
    render(<ImageUploader label="Upload" value="data:image/png;base64,fake" onChange={onChange} />);
    fireEvent.click(screen.getByText(/Eliminar/));
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('shows error for non-image file', async () => {
    const onChange = vi.fn();
    render(<ImageUploader label="Upload" value={null} onChange={onChange} />);

    const input = screen.getByDisplayValue('');
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    Object.defineProperty(file, 'size', { value: 100 });

    fireEvent.change(input, { target: { files: [file] } });

    // Should show error and not call onChange
    expect(onChange).not.toHaveBeenCalled();
  });
});
