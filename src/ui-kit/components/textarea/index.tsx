import classNames from 'classnames';
import React, { ChangeEvent, FC, useRef, useState } from 'react';
import isNumber from 'lodash/isNumber';
import './index.css';

export type TextAreaProps = {
  /**
   * 文本框中的值
   */
  /** @en
   * Value of the textarea
   */
  value?: string;
  /**
   * 限制最大文本输入字数
   */
  /** @en
   * Limit the max character count of the textarea
   */
  maxCount?: number;
  /**
   * 文本框的提示符
   */
  /** @en
   * Placeholder of the textarea
   */
  placeholder?: string;
  /**
   * 文本框是否可以垂直方向拖拽更改尺寸
   */
  /** @en
   * Whether the textarea can be resized vertically
   */
  resizable?: boolean;
  /**
   * 文本框是否禁用
   */
  /** @en
   * Whether the textarea is disabled
   */
  disabled?: boolean;
  /**
   * 值变更事件
   * @param value 变更值
   */
  /** @en
   * Change event of the textarea's value
   * @param value changed value
   */
  onChange?: (value: string) => void;
};

export const TextArea: FC<TextAreaProps> = ({
  value = '',
  placeholder,
  resizable,
  disabled,
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
    'fcr-textarea--disabled': disabled,
  });

  return (
    <div className={cls} onClick={handleClick}>
      <textarea
        ref={inputRef}
        disabled={disabled}
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
  /**
   * 文本框的标签，一般展示在文本框的头部，提示用户需要输入的内容
   */
  /** @en
   * The label of the textarea, usually displayed at the head of the textarea, prompting the user to enter the content
   */
  label?: string;
  /**
   * 文本框的提示符
   */
  /** @en
   * Placeholder of the textarea
   */
  placeholder?: string;
  /**
   * 值变更事件，只会在文本框失去焦点时触发
   * @param value 变更值
   */
  /** @en
   * Change event of the textarea's value, only fired when it lose focus
   * @param value changed value
   */
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
