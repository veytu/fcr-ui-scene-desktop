import classNames from 'classnames';
import React, { ChangeEvent, FC, useRef, useState } from 'react';
import './index.css';

export type TextAreaProps = {
  placeholder?: string;
  value: string;
  readOnly?: boolean;
  onChange?: (value: string) => void;
};

export const TextArea: FC<TextAreaProps> = ({
  placeholder,
  value,
  readOnly,
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
    onChange(e.target.value);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const cls = classNames('fcr-textarea', {
    'fcr-textarea--focused': focused,
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
    </div>
  );
};
