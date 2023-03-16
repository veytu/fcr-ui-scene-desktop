import classNames from 'classnames';
import React, { ChangeEvent, FC, useRef, useState } from 'react';
import isNumber from 'lodash/isNumber';
import './index.css';

export type TextAreaProps = {
  value: string;
  maxCount?: number;
  placeholder?: string;
  resizable?: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

export const TextArea: FC<TextAreaProps> = ({
  value,
  placeholder,
  resizable,
  readOnly,
  maxCount,
  onChange = () => {},
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (isNumber(maxCount) && e.target.value.length > maxCount) {
      return;
    }
    onChange(e.target.value);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const cls = classNames('fcr-textarea', {
    'fcr-textarea--focused': focused,
    'fcr-textarea--non-resizable': !resizable,
  });

  return (
    <div className={cls} onClick={handleClick}>
      <textarea
        ref={inputRef}
        readOnly={readOnly}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        onChange={handleChange}
      />
      <div className="fcr-textarea-divider" />
      {isNumber(maxCount) && (
        <span className="fcr-textarea-wc">
          {(value ?? '').length} / {maxCount}
        </span>
      )}
    </div>
  );
};

type TextAreaBorderLessProps = {
  maxCount?: number;
  cols?: number;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
};
export const TextAreaBorderLess: FC<TextAreaBorderLessProps> = ({
  placeholder,
  onChange = () => {},
  label,
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);
  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    onChange(inputRef.current?.innerHTML ?? '');
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const cls = classNames('fcr-textarea fcr-textarea-borderless', {
    'fcr-textarea--focused': focused,
  });

  return (
    <div className={cls} onClick={handleClick}>
      <span className="fcr-textarea-label">{label}</span>
      <div
        className="fcr-textarea__inner-editor"
        ref={inputRef}
        placeholder={placeholder}
        suppressContentEditableWarning={true}
        contentEditable={true}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
    </div>
  );
};
