import { useClickAnywhere } from '@onlineclass/ui-kit/hooks';
import classNames from 'classnames';
import React, { FC, useMemo, useState } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';

export type DropdownProps = {
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  options?: { text: string; value: string }[];
  size?: 'large' | 'medium' | 'small';
  onChange?: (value: string) => void;
};

export const Dropdown: FC<DropdownProps> = ({
  placeholder,
  options,
  defaultValue,
  value,
  size = 'medium',
  onChange = () => {},
}) => {
  const [focused, setFocused] = useState(false);
  const cls = classNames('fcr-dropdown', {
    'fcr-dropdown--focused': focused,
    'fcr-dropdown-l': size === 'large',
    'fcr-dropdown-m': size === 'medium',
    'fcr-dropdown-s': size === 'small',
  });

  const handleClick = () => {
    setFocused(!focused);
  };

  const optionsCls = classNames('fcr-dropdown__options', {
    'fcr-dropdown__options--invisible': !focused,
  });

  const ref = useClickAnywhere(() => {
    setFocused(false);
  });

  const { isUnselected, selectedText } = useMemo(() => {
    const selectedOption = options?.find(({ value: ov }) => value === ov);

    return { selectedText: selectedOption?.text ?? placeholder, isUnselected: !selectedOption };
  }, [value, options, placeholder]);

  const selectedCls = classNames('fcr-dropdown__selected', {
    'fcr-dropdown__selected--unselected': isUnselected,
  });

  return (
    <div className={cls} onClick={handleClick} ref={ref}>
      <div className={selectedCls}>
        <span className="">{selectedText}</span>
        <SvgImg className="fcr-dropdown__icon" type={SvgIconEnum.FCR_DROPDOWN} size={24} />
      </div>
      {/* options */}
      <ul className={optionsCls}>
        {options?.map(({ text, value: ov }) => {
          const optionCls = classNames('fcr-dropdown__option', {
            'fcr-dropdown__option--active': value === ov,
          });

          const handleClick = () => {
            if (value !== ov) {
              onChange(ov);
            }
          };

          return (
            <li key={ov} className={optionCls} onClick={handleClick}>
              {text}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
