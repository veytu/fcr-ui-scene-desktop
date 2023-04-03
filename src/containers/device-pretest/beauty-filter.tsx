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
    isBeautyFilterEnabled,
    closeBeautyFilter,
  } = deviceSettingUIStore;

  const beautyTypeList = [
    {
      type: 'smooth' as const,
      icon: SvgIconEnum.FCR_SMOOTH,
      label: 'Smooth',
      enabled: isBeautyFilterEnabled && !!beautySmoothValue,
    },
    {
      type: 'brightening' as const,
      icon: SvgIconEnum.FCR_BEAUTY_RETOUCH,
      label: 'Brightening',
      enabled: isBeautyFilterEnabled && !!beautyBrighteningValue,
    },
    {
      type: 'blush' as const,
      icon: SvgIconEnum.FCR_BEAUTY_BLUSH,
      label: 'Blush',
      enabled: isBeautyFilterEnabled && !!beautyBlushValue,
    },
  ];

  const noneButtonCls = classNames({
    'fcr-pretest-beauty-filter__list-item--active': !isBeautyFilterEnabled,
  });

  return (
    <div className="fcr-pretest-beauty-filter">
      <ul className="fcr-pretest-beauty-filter__list">
        <li className={noneButtonCls}>
          <div className="fcr-pretest-beauty-filter__list-item-inner" onClick={closeBeautyFilter}>
            <SvgImg
              className="fcr-pretest-beauty-filter__list-item-status-icon"
              type={SvgIconEnum.FCR_SETTING_NONE}
              size={40}
              colors={{ iconPrimary: 'currentColor' }}
            />
          </div>
          <span className="fcr-pretest-beauty-filter__list-item-label">None</span>
        </li>

        {beautyTypeList.map(({ type, icon, label, enabled }, index) => {
          const isActive = isBeautyFilterEnabled && type === activeBeautyType;
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
                <SvgImg
                  className="fcr-pretest-beauty-filter__list-item-status-icon"
                  type={icon}
                  size={48}
                  colors={{ iconPrimary: 'currentColor' }}
                />
              </div>
              <span className="fcr-pretest-beauty-filter__list-item-label">{label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
