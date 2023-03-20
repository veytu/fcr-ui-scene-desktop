import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import './index.css';

type SwitchProps = {
  /**
   *
   */
  /** @en
   *
   */
  defaultValue?: boolean;
  /**
   *
   */
  /** @en
   *
   */
  labels?: Record<'on' | 'off', string>;
  /**
   * 开关的值
   */
  /** @en
   * Value of the switch
   */
  value?: boolean;
  /**
   * 值变更事件
   * @param value 变更值
   */
  /** @en
   * Change event of the switch's value
   * @param value changed value
   */
  onChange?: (val: boolean) => void;
};

export const Switch: FC<SwitchProps> = ({ defaultValue, labels, value, onChange = () => {} }) => {
  const [toggle, setToggle] = useState(defaultValue);
  const cls = classNames('fcr-switch', {
    'fcr-switch--on': toggle,
    'fcr-switch--off': !toggle,
  });

  const handleClick = () => {
    setToggle(!toggle);
    onChange(!toggle);
  };

  useEffect(() => {
    setToggle(value);
  }, [value]);

  return (
    <div className={cls} onClick={handleClick}>
      <div className="fcr-switch__labels">
        <span>{labels?.on ?? 'ON'}</span>
        <span>{labels?.off ?? 'OFF'}</span>
      </div>
      <div className="fcr-switch__slider" />
    </div>
  );
};
