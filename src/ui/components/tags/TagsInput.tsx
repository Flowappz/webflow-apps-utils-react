import './TagsInput.css';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';

import { TimesIcon } from '../../icons';
import Loader from '../Loader';
import { Tooltip } from '../tooltip';
import type { TagsInputProps } from './types';

// Reads src values from pasted markup via a detached (inert) DOMParser doc; only safe http(s)/relative schemes are kept.
function extractSrcUrlsFromHtmlMarkup(markup: string): string[] {
  if (!markup.trim()) return [];

  const doc = new DOMParser().parseFromString(markup, 'text/html');
  const urls: string[] = [];

  for (const el of doc.querySelectorAll('script[src], iframe[src], img[src]')) {
    const src = el.getAttribute('src')?.trim();
    if (src && isSafeSrcUrl(src)) urls.push(src);
  }

  return urls;
}

// Allows http(s) and relative/protocol-relative srcs; rejects javascript:/data:/etc.
function isSafeSrcUrl(src: string): boolean {
  if (src.startsWith('//') || src.startsWith('/') || src.startsWith('./') || src.startsWith('../'))
    return true;

  const schemeMatch = src.match(/^([a-z][a-z0-9+.-]*):/i);
  if (!schemeMatch) return true; // no scheme → treat as relative

  const scheme = schemeMatch[1].toLowerCase();
  return scheme === 'http' || scheme === 'https';
}

export const TagsInput = ({
  value: valueProp,
  placeholder = 'Add tag...',
  id = 'tags-input',
  disabled = false,
  loading = false,
  invalid = false,
  readonly = false,
  alert = null,
  maxTags = null,
  minTags = null,
  maxTagLength = null,
  separatorKeys = ['Enter', ','],
  allowDuplicates = false,
  validateTag,
  trimTags = true,
  parseSrcFromHtmlPaste = false,
  showRemoveIcon = false,
  expandOnClick = false,
  width = '100%',
  height = 'auto',
  className = '',
  onValueChange,
  onTagAdd,
  onTagRemove,
  onInvalidTag,
  onfocus,
  onblur,
  onkeydown,
  onpaste: onPasteFromParent,
  children,
  ...restProps
}: TagsInputProps) => {
  // `value` was `$bindable` in the source — controlled prop with internal state fallback
  const [value, setValue] = useState<string[]>(valueProp ?? []);

  // Re-sync internal state when the `value` prop changes
  useEffect(() => {
    if (valueProp !== undefined) setValue(valueProp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueProp]);

  // Component state
  const inputElement = useRef<HTMLInputElement | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [expandedTags, setExpandedTags] = useState<Set<number>>(() => new Set());

  // Derived states
  const isDisabled = disabled || loading;
  const canAddMore = maxTags === null || value.length < maxTags;
  const showPlaceholder = value.length === 0 && !inputValue;
  const hasAlert = alert?.message;

  // Validation state
  const isMinTagsInvalid = (() => {
    if (minTags === null) return false;
    return value.length < minTags;
  })();

  // Derived alert state for styling
  const alertType = alert?.type || null;
  const isErrorAlert = alertType === 'error' || alertType === 'warning';
  const isSuccessAlert = alertType === 'success';

  // CSS classes
  const wrapperClasses = `
		tags-input-wrapper
		${isDisabled ? 'disabled' : ''}
		${readonly ? 'readonly' : ''}
		${invalid || isErrorAlert || isMinTagsInvalid ? 'invalid' : ''}
		${isSuccessAlert ? 'success' : ''}
		${isFocused ? 'focused' : ''}
		${loading ? 'loading' : ''}
		${showRemoveIcon ? 'show-remove-icon' : ''}
		${className}
	`
    .trim()
    .replace(/\s+/g, ' ');

  /**
   * Collapses all expanded tags
   */
  const collapseAllTags = () => {
    setExpandedTags(new Set());
  };

  /**
   * Toggles the expanded state of a tag
   */
  const toggleTagExpand = (index: number) => {
    if (!expandOnClick) return;

    setExpandedTags((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  /**
   * Checks if a tag is expanded
   */
  const isTagExpanded = (index: number): boolean => {
    return expandedTags.has(index);
  };

  /**
   * Focus the input element
   */
  const focusInput = () => {
    if (inputElement.current && !readonly && !isDisabled) {
      inputElement.current.focus();
    }
  };

  /**
   * Validates a tag before adding
   */
  const validateTagValue = (tag: string): { valid: boolean; reason?: string } => {
    const trimmedTag = trimTags ? tag.trim() : tag;

    if (!trimmedTag) {
      return { valid: false, reason: 'Tag cannot be empty' };
    }

    if (maxTagLength !== null && trimmedTag.length > maxTagLength) {
      return { valid: false, reason: `Tag exceeds maximum length of ${maxTagLength}` };
    }

    if (!allowDuplicates && valueRef.current.includes(trimmedTag)) {
      return { valid: false, reason: 'Duplicate tag' };
    }

    if (maxTags !== null && valueRef.current.length >= maxTags) {
      return { valid: false, reason: `Maximum of ${maxTags} tags allowed` };
    }

    if (validateTag) {
      const customValidation = validateTag(trimmedTag);
      if (customValidation === false) {
        return { valid: false, reason: 'Invalid tag' };
      }
      if (typeof customValidation === 'string') {
        return { valid: false, reason: customValidation };
      }
    }

    return { valid: true };
  };

  // Ref mirror so multi-add operations (paste, comma-separated input) see fresh values
  const valueRef = useRef(value);
  valueRef.current = value;

  /**
   * Adds a new tag
   */
  const addTag = (rawTag: string) => {
    if (readonly || isDisabled) return;

    const tag = trimTags ? rawTag.trim() : rawTag;
    const validation = validateTagValue(tag);

    if (!validation.valid) {
      onInvalidTag?.(tag, validation.reason || 'Invalid tag');
      return false;
    }

    setInputValue('');
    const next = [...valueRef.current, tag];
    valueRef.current = next;
    setValue(next);

    onTagAdd?.(tag);
    onValueChange?.(next);

    return true;
  };

  /**
   * Removes a tag at the specified index
   */
  const removeTag = (index: number) => {
    if (readonly || isDisabled) return;

    const removedTag = valueRef.current[index];
    const next = valueRef.current.filter((_, i) => i !== index);
    valueRef.current = next;
    setValue(next);

    onTagRemove?.(removedTag, index);
    onValueChange?.(next);

    // Focus back to input after removal
    focusInput();
  };

  /**
   * Handles input changes
   */
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const target = event.target;
    const newValue = target.value;

    // Check if a separator key was typed (e.g., comma)
    for (const separator of separatorKeys) {
      if (separator.length === 1 && newValue.includes(separator)) {
        const parts = newValue.split(separator);
        for (let i = 0; i < parts.length - 1; i++) {
          if (parts[i].trim()) {
            addTag(parts[i]);
          }
        }
        setInputValue(parts[parts.length - 1]);
        return;
      }
    }

    setInputValue(newValue);
  };

  /**
   * Handles keydown events
   */
  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Check for separator keys (e.g., Enter)
    if (separatorKeys.includes(event.key)) {
      event.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue);
      }
      return;
    }

    // Handle Backspace to remove last tag when input is empty
    if (event.key === 'Backspace' && inputValue === '' && value.length > 0) {
      removeTag(value.length - 1);
      return;
    }

    // Handle Tab to add tag if there's input
    if (event.key === 'Tab' && inputValue.trim()) {
      event.preventDefault();
      addTag(inputValue);
      return;
    }

    onkeydown?.(event.nativeEvent);
  };

  /**
   * Handles focus events
   */
  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onfocus?.(event.nativeEvent);
  };

  /**
   * Handles blur events
   */
  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);

    // Add any remaining input as a tag on blur
    if (inputValue.trim()) {
      addTag(inputValue);
    }

    onblur?.(event.nativeEvent);
  };

  /**
   * Paste: optionally turn script/iframe/img `src` markup into tags
   */
  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (!parseSrcFromHtmlPaste || readonly || isDisabled) {
      onPasteFromParent?.(event.nativeEvent);
      return;
    }

    const html = event.clipboardData?.getData('text/html') ?? '';
    const plain = event.clipboardData?.getData('text/plain') ?? '';
    const markup = html.trim().length > 0 ? html : plain;
    const urls = extractSrcUrlsFromHtmlMarkup(markup);

    if (urls.length === 0) {
      onPasteFromParent?.(event.nativeEvent);
      return;
    }

    event.preventDefault();
    setInputValue('');

    for (const url of urls) {
      addTag(url);
    }
  };

  /**
   * Handles wrapper click to focus input and collapse expanded tags
   */
  const handleWrapperClick = () => {
    // Collapse all expanded tags when clicking on the wrapper area
    if (expandOnClick && expandedTags.size > 0) {
      collapseAllTags();
    }
    focusInput();
  };

  /**
   * Gets the tooltip background color based on alert type
   */
  const getTooltipColor = (tooltipAlertType: string) => {
    switch (tooltipAlertType) {
      case 'error':
        return 'var(--redBackground)';
      case 'warning':
        return 'var(--orangeBackground)';
      case 'success':
        return 'var(--greenBackground)';
      case 'info':
      default:
        return 'var(--actionPrimaryBackground)';
    }
  };

  const tagsInputContent = (
    <div
      className={wrapperClasses}
      style={{ width, minHeight: height }}
      role="group"
      aria-labelledby={`${id}-label`}
      onClick={handleWrapperClick}
      onKeyDown={(e) => e.key === 'Enter' && handleWrapperClick()}
    >
      <div className="tags-input-content">
        {value.map((tag, index) => (
          <span
            key={`${index}-${tag}`}
            className={`tag ${expandOnClick ? 'expandable' : ''} ${
              isTagExpanded(index) ? 'expanded' : ''
            }`}
            role="listitem"
            onClick={(e) => {
              if (expandOnClick) {
                e.stopPropagation();
                toggleTagExpand(index);
              }
            }}
            onKeyDown={(e) => {
              if (expandOnClick && e.key === 'Enter') {
                e.stopPropagation();
                toggleTagExpand(index);
              }
            }}
            tabIndex={expandOnClick ? 0 : undefined}
          >
            <span className="tag-text">{tag}</span>
            {!readonly && !isDisabled && (
              <button
                type="button"
                className="tag-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                aria-label={`Remove tag ${tag}`}
                tabIndex={-1}
              >
                <TimesIcon />
              </button>
            )}
          </span>
        ))}

        {!readonly && (
          <input
            ref={inputElement}
            id={id}
            type="text"
            className="tags-input-field"
            placeholder={showPlaceholder ? placeholder : ''}
            value={inputValue}
            disabled={isDisabled || !canAddMore}
            {...restProps}
            onChange={handleInput}
            onKeyDown={handleKeydown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onPaste={handlePaste}
            aria-label="Add new tag"
          />
        )}

        {loading && (
          <div className="tags-input-loader">
            <Loader size={14} color="var(--text2)" />
          </div>
        )}
      </div>

      {children}
    </div>
  );

  return (
    <Tooltip
      message={hasAlert ? alert?.message || '' : ''}
      placement="top"
      listener="hover"
      listenerout="hover"
      showArrow={true}
      hidden={!hasAlert}
      disabled={!hasAlert || !alert?.message}
      fontColor="var(--actionPrimaryText)"
      width="max-content"
      padding="6px"
      bgColor={getTooltipColor(alert?.type || 'info')}
      className="tags-input-tooltip"
      target={tagsInputContent}
    />
  );
};

export default TagsInput;
