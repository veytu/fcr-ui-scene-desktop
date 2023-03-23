import { FC, ReactNode } from 'react';
import './index.css';
export interface CheckboxProps {
  label?: ReactNode;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
export const Checkbox: FC<CheckboxProps> = (props) => {
  const { label, onChange, ...inputProps } = props;
  return (
    <label className="fcr-checkbox">
      <input {...inputProps} onChange={(e) => onChange?.(e.target.checked)} type="checkbox"></input>
      <span>{label}</span>
    </label>
  );
};
