import { SvgIconEnum, SvgImg } from '@onlineclass/ui-kit/components/svg-img';
import { FC } from 'react';
import classnames from 'classnames';
import { FcrToolTip } from '@onlineclass/ui-kit/components/tooltip';
export const FcrStatusBar = () => {
  return (
    <div className="fcr-status-bar">
      <div className="fcr-status-bar-left">
        <div>
          <SvgImg type={SvgIconEnum.FCR_BTN_LOADING} size={32}></SvgImg>
        </div>
      </div>
      <div className="fcr-status-bar-right"></div>
    </div>
  );
};

const FcrStatusBarItemWrapper: FC = (props) => {
  const { children } = props;
  return <div className="fcr-status-bar-item-wrapper">{children}</div>;
};
const FcrStatusBarInfo: FC = () => {
  return (
    <FcrStatusBarItemWrapper>
      <FcrToolTip>
        <div className="fcr-status-bar-info-network">
          <SvgImg type={SvgIconEnum.FCR_V2_SIGNAL_GOOD}></SvgImg>
        </div>
      </FcrToolTip>

      <div className={classnames('fcr-status-bar-info-id', 'fcr-divider')}>
        <span>ID:</span>
        <span>234 223 223</span>
      </div>
      <div className="fcr-status-bar-info-share"></div>
    </FcrStatusBarItemWrapper>
  );
};
