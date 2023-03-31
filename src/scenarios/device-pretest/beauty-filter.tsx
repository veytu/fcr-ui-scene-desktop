import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import classNames from 'classnames';
import { observer } from 'mobx-react';

export const BeautyFilter = observer(() => {
  const { deviceSettingUIStore } = useStore();

  const {
    activeBeautyType,
    setBeautyType,
    beautyBlushValue,
    beautyBrighteningValue,
    beautySmoothValue,
  } = deviceSettingUIStore;

  return (
    <div className="fcr-pretest-beauty-filter">
      <ul className="fcr-pretest-beauty-filter__list">
        {[
          {
            type: 'smooth' as const,
            icon: SvgIconEnum.FCR_SMOOTH,
            label: 'Smooth',
            enabled: !!beautySmoothValue,
          },
          {
            type: 'brightening' as const,
            icon: SvgIconEnum.FCR_BEAUTY_RETOUCH,
            label: 'Brightening',
            enabled: !!beautyBrighteningValue,
          },
          {
            type: 'blush' as const,
            icon: SvgIconEnum.FCR_BEAUTY_BLUSH,
            label: 'Blush',
            enabled: !!beautyBlushValue,
          },
        ].map(({ type, icon, label, enabled }, index) => {
          const isActive = type === activeBeautyType;
          const backgroundListItemCls = classNames({
            'fcr-pretest-beauty-filter__list-item--active': isActive,
          });

          const innerCls = classNames('fcr-pretest-beauty-filter__list-item-inner', {
            'fcr-pretest-beauty-filter__list-item-inner--enabled': enabled,
          });

          const handleClick = () => {
            setBeautyType(type);
          };

          return (
            <li key={index.toString()} className={backgroundListItemCls}>
              <div className={innerCls} onClick={handleClick}>
                <SvgImg type={icon} size={48} />
              </div>
              <span className="fcr-pretest-beauty-filter__list-item-label">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
