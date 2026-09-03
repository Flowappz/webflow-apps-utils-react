import { act, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../icons', () => ({
  DeleteIcon: () => <svg data-testid="delete-icon" />,
  FileUploadIcon: () => <svg data-testid="upload-icon" />,
  RefreshIcon: () => <svg data-testid="refresh-icon" />,
}));

vi.mock('../button', () => ({
  Button: ({ text, onclick }: { text?: string; onclick?: () => void }) => (
    <button type="button" onClick={onclick}>
      {text}
    </button>
  ),
}));

vi.mock('../text', () => ({
  Text: ({ label }: { label?: string }) => <span>{label}</span>,
}));

import { ImageUpload, type ImageUploadHandle } from './ImageUpload';

const defaultProps = {
  buttonText: 'Upload image',
  acceptedTypes: ['image/png', 'image/jpeg'],
  maxFileSize: 1024,
  invalidFileTypeMessage: 'Invalid file type',
  invalidFileSizeMessage: 'File too large',
};

const makeFile = (name: string, type: string, size: number): File => {
  const file = new File(['x'.repeat(Math.min(size, 8))], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

const getFileInput = (container: HTMLElement) =>
  container.querySelector('input[type="file"]') as HTMLInputElement;

describe('ImageUpload', () => {
  beforeEach(() => {
    // jsdom does not implement object URLs
    globalThis.URL.createObjectURL = vi.fn(() => 'blob:preview-url');
    globalThis.URL.revokeObjectURL = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the upload button and optional label', () => {
    render(<ImageUpload {...defaultProps} label="Hero image" required />);

    expect(screen.getByText('Upload image')).toBeInTheDocument();
    expect(screen.getByText('Hero image')).toBeInTheDocument();
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('emits a change event with the file for a valid upload', () => {
    const onchange = vi.fn();
    const { container } = render(<ImageUpload {...defaultProps} onchange={onchange} showPreview />);

    const file = makeFile('photo.png', 'image/png', 100);
    fireEvent.change(getFileInput(container), { target: { files: [file] } });

    expect(onchange).toHaveBeenCalledWith({ file, error: null });
    // Preview + action buttons appear
    expect(container.querySelector('.file-preview')).toBeInTheDocument();
    expect(screen.getByText('Replace')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('rejects an invalid file type', () => {
    const onchange = vi.fn();
    const { container } = render(<ImageUpload {...defaultProps} onchange={onchange} />);

    const file = makeFile('doc.pdf', 'application/pdf', 100);
    fireEvent.change(getFileInput(container), { target: { files: [file] } });

    expect(onchange).toHaveBeenCalledWith({ file: null, error: 'Invalid file type' });
    expect(screen.getByText('Invalid file type')).toBeInTheDocument();
  });

  it('rejects a file that is too large', () => {
    const onchange = vi.fn();
    const { container } = render(<ImageUpload {...defaultProps} onchange={onchange} />);

    const file = makeFile('big.png', 'image/png', 999999);
    fireEvent.change(getFileInput(container), { target: { files: [file] } });

    expect(onchange).toHaveBeenCalledWith({ file: null, error: 'File too large' });
    expect(screen.getByText('File too large')).toBeInTheDocument();
  });

  it('shows an external error message', () => {
    render(<ImageUpload {...defaultProps} error="Upload failed" />);
    expect(screen.getByText('Upload failed')).toBeInTheDocument();
  });

  it('resets via the imperative handle', () => {
    const onchange = vi.fn();
    const ref = createRef<ImageUploadHandle>();
    const { container } = render(<ImageUpload {...defaultProps} onchange={onchange} ref={ref} />);

    const file = makeFile('photo.png', 'image/png', 100);
    fireEvent.change(getFileInput(container), { target: { files: [file] } });
    expect(screen.getByText('Delete')).toBeInTheDocument();

    act(() => {
      ref.current?.reset();
    });

    expect(onchange).toHaveBeenLastCalledWith({ file: null, error: null });
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
});
