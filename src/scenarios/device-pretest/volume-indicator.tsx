import classNames from 'classnames';
import range from 'lodash/range';
import React, { FC } from 'react';

export const VolumeIndicator: FC<{ value: number }> = ({ value }) => {
  const step = 8;
  const power = value * 8;

  return (
    <div className="fcr-volume-indicator">
      {range(0, step).map((i) => {
        const pointCls = classNames('fcr-volume-indicator__point', {
          'fcr-volume-indicator__point--active': i <= power,
        });
        return <div key={i.toString()} className={pointCls} />;
      })}
    </div>
  );
};
