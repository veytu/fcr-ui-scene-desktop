import classNames from 'classnames';
import React, { ChangeEvent, FC, useRef, useState } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';

export type InputProps = {
  /**
   * 输入框的提示符
   */
  /** @en
   * Placeholder of the input box
   */
  placeholder?: string;
  /**
   * 输入框中的值
   */
  /** @en
   * value of the input box
   */
  value: string;
  /**
   * 输入框的标签，一般展示在输入框的头部，提示用户需要输入的内容
   */
  /** @en
   * The label of the input box, usually displayed at the head of the input box, prompting the user to enter the content
   */
  label?: string;
  /**
   * 输入框是否只读
   */
  /** @en
   * Whether the input box is read only
   */
  readOnly?: boolean;
  /**
   * 输入框前置图标，仅在 variant = rounded 时生效
   */
  /** @en
   * Input box front icon, takes effect only if variant = rounded
   */
  iconPrefix?: SvgIconEnum;
  /**
   * 输入框前缀文字，仅在 variant = border-less 时生效
   */
  /** @en
   * Input box prefix text, takes effect only if variant = border-less
   */
  textPrefix?: string;
  /**
   * 输入框的尺寸：
   * medium - 中等(default)
   * large - 大
   */
  /** @en
   * Size of the input box:
   * medium
   * large
   */
  size?: 'large' | 'medium';
  /**
   * 输入框的风格变体，目前支持：
   * 带边框圆角输入框（默认）
   * 底部线条极简输入框 - border-less
   */
  /** @en
   * Style variations of the input box, currently supported:
   * Rounded input box with border - rounded (default)
   * Bottom line minimalist input box - border-less
   */
  variant?: 'rounded' | 'border-less';
  /**
   * 值变更事件
   * @param value 变更值
   */
  /** @en
   * change event of the input's value
   * @param value changed value
   */
  onChange?: (value: string) => void;
};

export const Input: FC<InputProps> = ({
  placeholder,
  value,
  readOnly,
  iconPrefix,
  size = 'medium',
  variant,
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

  const isBorerLess = variant === 'border-less';

  const cls = classNames('fcr-input', {
    'fcr-input--focused': focused,
    'fcr-input-l': size === 'large',
    'fcr-input-m': size === 'medium',
    'fcr-input-borderless': isBorerLess,
  });

  const iconWrapCls = classNames('fcr-input-icon-wrap', {
    'fcr-input-icon-wrap--invisible': readOnly || !focused,
  });
  const iconCls = classNames('fcr-input-icon', {});

  const labelCls = classNames('fcr-input-label', {});

  return (
    <React.Fragment>
      {label && !isBorerLess && <label className={labelCls}>{label}</label>}
      <div className={cls} onClick={handleClick}>
        {iconPrefix && (
          <SvgImg style={{ marginRight: 10, marginLeft: 10 }} size={24} type={iconPrefix} />
        )}
        <input
          ref={inputRef}
          readOnly={readOnly}
          placeholder={placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
          onChange={handleChange}
        />
        {!isBorerLess && (
          <div className={iconWrapCls} onMouseDown={handleClear}>
            <SvgImg className={iconCls} type={SvgIconEnum.FCR_CLOSE} size={20} />
          </div>
        )}
      </div>
    </React.Fragment>
  );
};
