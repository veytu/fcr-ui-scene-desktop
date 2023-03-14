import classNames from 'classnames';
import React, { ChangeEvent, FC, useRef, useState } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';

export type Props = {
  placeholder?: string;
  value: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: () => void;
  onKeyUp?: () => void;
  options?: { text: string; value: string }[];
  readOnly?: boolean;
};

export const Input: FC<Props> = ({
  placeholder,
  value,
  onChange = () => {},
  readOnly,
  onBlur,
  onKeyDown,
  onKeyUp,
}) => {
  const [focused, setFocused] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const iconCls = classNames('fcr-input-icon', {});

  const cls = classNames('fcr-input', {
    'fcr-input--focused': focused,
  });

  const iconWrapCls = classNames('fcr-input-icon-wrap', {
    'fcr-input-icon-wrap--invisible': readOnly || !focused,
  });

  return (
    <div className={cls} onClick={handleClick}>
      <input
        ref={inputRef}
        readOnly={readOnly}
        placeholder={placeholder}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
      />
      <div className={iconWrapCls} onMouseDown={handleClear}>
        <SvgImg
          className={iconCls}
          type={SvgIconEnum.FCR_CLOSE}
          size={20}
          style={{ top: 14, right: 10 }}
        />
      </div>
    </div>
  );
};
