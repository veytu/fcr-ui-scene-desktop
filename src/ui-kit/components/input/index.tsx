import classNames from 'classnames';
import React, { ChangeEvent, FC, useRef, useState } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';

export type InputProps = {
  placeholder?: string;
  value: string;
  label?: string;
  readOnly?: boolean;
  iconPrefix?: SvgIconEnum;
  textPrefix?: string;
  size?: 'large' | 'medium';
  borderLess?: boolean;
  onChange?: (value: string) => void;
};

export const Input: FC<InputProps> = ({
  placeholder,
  value,
  readOnly,
  iconPrefix,
  size = 'medium',
  borderLess,
  label,
  onChange = () => {},
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
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

  const cls = classNames('fcr-input', {
    'fcr-input--focused': focused,
    'fcr-input-l': size === 'large',
    'fcr-input-m': size === 'medium',
    'fcr-input-borderless': borderLess,
  });

  const iconWrapCls = classNames('fcr-input-icon-wrap', {
    'fcr-input-icon-wrap--invisible': readOnly || !focused,
  });
  const iconCls = classNames('fcr-input-icon', {});

  const labelCls = classNames('fcr-input-label', {});

  return (
    <React.Fragment>
      {label && !borderLess && <label className={labelCls}>{label}</label>}
      <div className={cls} onClick={handleClick}>
        {iconPrefix && <SvgImg style={{ marginRight: 10, marginLeft: 10 }} size={24} type={iconPrefix} />}
        <input
          ref={inputRef}
          readOnly={readOnly}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChange={handleChange}
        />
        {!borderLess && (
          <div className={iconWrapCls} onMouseDown={handleClear}>
            <SvgImg className={iconCls} type={SvgIconEnum.FCR_CLOSE} size={20} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
