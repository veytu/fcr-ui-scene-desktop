import React, { FC } from 'react';
import RcSlider from 'rc-slider';
import './index.css';
import 'rc-slider/assets/index.css';

type VerticalSliderProps = {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
};

export const VerticalSlider: FC<VerticalSliderProps> = ({
  min = 0,
  max = 100,
  defaultValue = 0,
  step = 1,
  onChange,
}) => {
  return (
    <div className="fcr-vertical-slider">
      <RcSlider
        vertical
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        onChange={onChange}
      />
    </div>
  );
};
