import { SvgImg, SvgIconEnum } from '@onlineclass/components/svg-img';
import classNames from 'classnames';
import { useState } from 'react';

export const BeautyFilter = () => {
  const backgroundList = [1, 2, 3, 4, 5];

  const [backgroundId, setBackgroundId] = useState<string>('');

  return (
    <div className="fcr-pretest-beauty-filter">
      <ul className="fcr-pretest-beauty-filter__list">
        {backgroundList.map((i, index) => {
          const backgroundListItemCls = classNames({
            'fcr-pretest-beauty-filter__list-item--active': `${i}` === backgroundId,
          });

          const handleClick = () => {
            setBackgroundId(`${i}`);
          };

          return (
            <li key={index.toString()} className={backgroundListItemCls}>
              <div
                className="fcr-pretest-beauty-filter__list-item-inner"
                onClick={handleClick}>
                  <div className='fcr-pretest-beauty-filter__list-item--enabled' />
                </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
