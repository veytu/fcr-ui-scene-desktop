import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { FC } from 'react';
import classnames from 'classnames';
import { ToolTip } from '@onlineclass/components/tooltip';
import { DoubleDeckPopover } from '@onlineclass/components/popover';

export const StatusBar = () => {
  return (
    <div className="fcr-status-bar">
      <div className="fcr-status-bar-left">
        <div>
          <SvgImg type={SvgIconEnum.FCR_BTN_LOADING} size={32}></SvgImg>
        </div>
        <FcrStatusBarInfo />
      </div>
      <div className="fcr-status-bar-right"></div>
    </div>
  );
};

const StatusBarItemWrapper: FC = (props) => {
  const { children } = props;
  return <div className="fcr-status-bar-item-wrapper">{children}</div>;
};
const FcrStatusBarInfo: FC = () => {
  return (
    <StatusBarItemWrapper>
      <DoubleDeckPopover trigger="click">
        <ToolTip trigger="hover" content="Show Network Details">
          <div className="fcr-status-bar-info-network">
            <SvgImg type={SvgIconEnum.FCR_V2_SIGNAL_GOOD}></SvgImg>
          </div>
        </ToolTip>
      </DoubleDeckPopover>

      <div className={classnames('fcr-status-bar-info-id', 'fcr-divider')}>
        <span>ID:</span>
        <span>234 223 223</span>
      </div>
      <div className="fcr-status-bar-info-share"></div>
    </StatusBarItemWrapper>
  );
};
