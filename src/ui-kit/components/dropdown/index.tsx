import { useClickAnywhere } from '@onlineclass/ui-kit/hooks';
import classNames from 'classnames';
import React, { FC, useMemo, useState } from 'react';
import { SvgIconEnum, SvgImg } from '../svg-img';
import './index.css';

export type DropdownProps = {
  value?: string;
  placeholder?: string;
  options?: { text: string; value: string }[];
  onChange?: (value: string) => void;
};

export const Dropdown: FC<DropdownProps> = ({
  placeholder,
  options,
  value,
  onChange = () => {},
}) => {
  const [focused, setFocused] = useState(false);
  const cls = classNames('fcr-dropdown', {
    'fcr-dropdown--focused': focused,
  });
  const selectedCls = classNames('fcr-dropdown__selected');

  const handleClick = () => {
    setFocused(!focused);
  };

  const optionsCls = classNames('fcr-dropdown__options', {
    'fcr-dropdown__options--invisible': !focused,
  });

  const ref = useClickAnywhere(() => {
    setFocused(false);
  });

  const selectedText = useMemo(
    () => options?.find(({ value: ov }) => value === ov)?.text ?? placeholder,
    [value, options, placeholder],
  );

  return (
    <div className={cls} onClick={handleClick} ref={ref}>
      <div className={selectedCls}>
        <span>{selectedText}</span>
        <SvgImg className="fcr-dropdown__icon" type={SvgIconEnum.FCR_DROPDOWN} />
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
