import { FC, ReactNode } from 'react';
import './index.css';
import classnames from 'classnames';
import { SvgIconEnum, SvgImg } from '../svg-img';
import { themeVal } from '@onlineclass/utils/tailwindcss';
const colors = themeVal('colors');
export interface RadioProps {
  label?: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  styleType?: 'brand' | 'white';
}
export const Radio: FC<RadioProps> = (props) => {
  const { label, onChange, styleType = 'brand', ...inputProps } = props;
  return (
    <label className={classnames('fcr-radio', `fcr-radio-${styleType}`)}>
      <span className="fcr-radio-input-wrapper">
        <input
          {...inputProps}
          onChange={(e) => {
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
