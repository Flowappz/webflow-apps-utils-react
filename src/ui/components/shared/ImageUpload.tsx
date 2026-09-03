import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

import { DeleteIcon, FileUploadIcon, RefreshIcon } from '../../icons';
import { Button } from '../button';
import { Text } from '../text';

import './ImageUpload.css';

export type FileChangeEvent = {
  file: File | null;
  error: string | null;
};

export interface ImageUploadProps {
  id?: string;
  name?: string;
  label?: string;
  invalidFileTypeMessage: string;
  required?: boolean;
  showPreview?: boolean;
  error?: string;
  buttonText: string;
  acceptedTypes: string[];
  maxFileSize: number;
  invalidFileSizeMessage: string;
  /** Fired when the selected file changes (Svelte `on:change` equivalent). */
  onchange?: (event: FileChangeEvent) => void;
}

export interface ImageUploadHandle {
  /** Clears the file input (Svelte's exported `reset` method). */
  reset: () => void;
}

export const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(
  (
    {
      id: idProp,
      name = 'image',
      label = '',
      invalidFileTypeMessage,
      required = false,
      showPreview = false,
      error = '',
      buttonText,
      acceptedTypes,
      maxFileSize,
      invalidFileSizeMessage,
      onchange,
    },
    ref
  ) => {
    const [generatedId] = useState(() => crypto.randomUUID());
    const id = idProp ?? generatedId;

    const input = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [showImage, setShowImage] = useState(false);
    const [localError, setLocalError] = useState('');
    const previewUrlRef = useRef('');
    previewUrlRef.current = previewUrl;

    /**
     * Validate the file type and size
     */
    const validateFile = (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return invalidFileTypeMessage;
      }
      if (file.size > maxFileSize) {
        return invalidFileSizeMessage;
      }
      return null;
    };

    /**
     * Handle the file change event
     */
    const handleChange = (): void => {
      const file = input.current?.files?.[0];
      setLocalError('');

      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
        setPreviewUrl('');
      }
      setShowImage(false);

      if (!file) {
        onchange?.({ file: null, error: null });
        return;
      }

      const validationError = validateFile(file);
      if (validationError) {
        setLocalError(validationError);
        if (input.current) input.current.value = '';
        onchange?.({ file: null, error: validationError });
        return;
      }

      // Create preview
      setPreviewUrl(URL.createObjectURL(file));
      setShowImage(true);

      onchange?.({ file, error: null });
    };

    /**
     * Trigger the file input
     */
    const triggerFileInput = () => {
      input.current?.click();
    };

    /**
     * Delete the file input
     */
    const reset = () => {
      if (input.current) input.current.value = '';
      setPreviewUrl('');
      setShowImage(false);
      onchange?.({ file: null, error: null });
    };

    useImperativeHandle(ref, () => ({ reset }));

    useEffect(() => {
      return () => {
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
        }
      };
    }, []);

    return (
      <div className="image-upload">
        {label && (
          <label htmlFor={id} className="label">
            <Text label={label} />
            {required && <span className="required">*</span>}
          </label>
        )}

        <div className={`upload-container${previewUrl ? ' hidden' : ''}`}>
          <input
            id={id}
            name={name}
            required={required}
            accept=".jpg,.jpeg,.png"
            ref={input}
            onChange={handleChange}
            type="file"
            className="file-input"
          />

          <Button text={buttonText} onclick={triggerFileInput} icon={FileUploadIcon} />
        </div>

        {showImage && previewUrl && showPreview && (
          <div className="preview-container">
            <div className="file-preview" style={{ backgroundImage: `url(${previewUrl})` }}></div>
          </div>
        )}
        {previewUrl && (
          <div className="action-buttons">
            <Button text="Replace" variant="secondary" onclick={triggerFileInput} icon={RefreshIcon} />
            <Button text="Delete" variant="secondary" onclick={reset} icon={DeleteIcon} />
          </div>
        )}

        {(error || localError) && <Text label={error || localError} fontColor="var(--redText)" />}
      </div>
    );
  }
);

ImageUpload.displayName = 'ImageUpload';

export default ImageUpload;
