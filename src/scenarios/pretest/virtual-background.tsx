import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import classNames from 'classnames';
import { useState } from 'react';

export const VirtualBackground = () => {
  const backgroundList = [1, 2, 3, 4, 5];

  const [backgroundId, setBackgroundId] = useState<string>('');

  return (
    <div className="fcr-pretest-virtual-background">
      <ul className="fcr-pretest-virtual-background__list">
        {backgroundList.map((i, index) => {
          const backgroundListItemCls = classNames({
            'fcr-pretest-virtual-background__list-item--active': `${i}` === backgroundId,
          });

          const handleClick = () => {
            setBackgroundId(`${i}`);
          };

          return (
            <li key={index.toString()} className={backgroundListItemCls}>
              <div
                className="fcr-pretest-virtual-background__list-item-inner"
                onClick={handleClick}>
                <div className="fcr-pretest-virtual-background__check">
                  <SvgImg type={SvgIconEnum.FCR_BACKGROUND2} />
                </div>
                <div className="fcr-pretest-virtual-background__badge">
                  <SvgImg type={SvgIconEnum.FCR_RECORDING_PLAY} />
                </div>
                <div className="fcr-pretest-virtual-background__delete">
                  <SvgImg type={SvgIconEnum.FCR_DELETE3} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
