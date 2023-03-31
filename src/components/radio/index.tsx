import { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react';
import './index.css';
import classnames from 'classnames';
import { SvgIconEnum, SvgImg } from '../svg-img';
import { themeVal } from '@onlineclass/utils/tailwindcss';
import uuid from 'uuid';
const colors = themeVal('colors');
export interface RadioProps {
  label?: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  styleType?: 'brand' | 'white';
  name?: string;
  value?: string;
}
export const Radio: FC<React.PropsWithChildren<RadioProps>> = (props) => {
  const groupContext = useContext(RadioGroupContext);
  const { label, onChange, styleType = 'brand', name, value, checked, ...inputProps } = props;

  return (
    <label className={classnames('fcr-radio', `fcr-radio-${styleType}`)}>
      <span className="fcr-radio-input-wrapper">
        <input
          name={name}
          {...inputProps}
          checked={(groupContext?.value ?? null) === value || checked || false}
          onChange={(e) => {
            groupContext?.onChange?.(value);
            onChange?.(e.target.checked);
          }}
          type="radio"></input>
        <span className="fcr-radio-inner fcr-btn-click-effect">
          <SvgImg
            type={SvgIconEnum.FCR_CHECKBOX_CHECK}
            colors={{
              iconPrimary: styleType === 'brand' ? colors['white'] : colors['brand'][6],
            }}
            size={12}></SvgImg>
        </span>
      </span>
      <span className="fcr-radio-label">{label}</span>
    </label>
  );
};
interface RadioGroupProps {
  defaultValue?: any;
  name?: string;
  options?: RadioProps[];
  value?: any;
  onChange?: (value?: string) => void;
}
const RadioGroupContext = createContext<RadioGroupProps | null>(null);
export const RadioGroup: FC<React.PropsWithChildren<RadioGroupProps>> = (props) => {
  const { children, options, defaultValue } = props;
  const [value, setValue] = useState(defaultValue || props.value);
  useEffect(() => {
    props.value && setValue(props.value);
  }, [props.value]);
  const onRadioChange = (value?: string) => {
    if (!props.value) {
      setValue(value);
    }
    props.onChange?.(value);
  };
  return (
    <RadioGroupContext.Provider value={{ ...props, value, onChange: onRadioChange }}>
      {options
        ? options.map((props) => {
            return <Radio key={props.value || uuid()} {...props}></Radio>;
          })
        : children}
    </RadioGroupContext.Provider>
  );
};
