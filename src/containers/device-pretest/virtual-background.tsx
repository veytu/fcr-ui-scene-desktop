import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { useStore } from '@onlineclass/utils/hooks/use-store';

export const VirtualBackground = observer(() => {
  const { deviceSettingUIStore } = useStore();

  const { activeBackgroundUrl, setVirtualBackground, virtualBackgroundList } = deviceSettingUIStore;

  return (
    <div className="fcr-pretest-virtual-background">
      <ul className="fcr-pretest-virtual-background__list">
        {virtualBackgroundList.map(({ url, type }, index) => {
          const isActive = url === activeBackgroundUrl;

          const backgroundListItemCls = classNames({
            'fcr-pretest-virtual-background__list-item--active': isActive,
          });

          const handleClick = () => {
            setVirtualBackground({ url, type });
          };

          return (
            <li key={index.toString()} className={backgroundListItemCls}>
              <div
                className="fcr-pretest-virtual-background__list-item-inner"
                onClick={handleClick}>
                {type === 'video' ? (
                  <video autoPlay loop muted>
                    <source src={url} type="video/mp4" />
                  </video>
                ) : (
                  <img src={url} />
                )}

                {isActive && (
                  <div className="fcr-pretest-virtual-background__check">
                    <SvgImg type={SvgIconEnum.FCR_CHECKBOX_CHECK} />
                  </div>
                )}
                {type === 'video' && (
                  <div className="fcr-pretest-virtual-background__badge">
                    <SvgImg type={SvgIconEnum.FCR_CAMERA3} size={20} />
                  </div>
                )}

                {/* <div className="fcr-pretest-virtual-background__delete">
                  <SvgImg type={SvgIconEnum.FCR_DELETE3} />
                </div> */}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
});
