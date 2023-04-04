import { Radio } from '@components/radio';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { Layout } from '@onlineclass/uistores/type';
import classnames from 'classnames';
import './index.css';
import { observer } from 'mobx-react';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { StatusBarItemWrapper } from '..';
import { PopoverWithTooltip } from '@components/popover';

export const LayoutSwitchPopover = () => {
  return (
    <div className="fcr-layout-switch">
      <div className="fcr-layout-switch-speaker-view">
        <div className="fcr-layout-switch-title">Speaker View</div>
        <div className="fcr-layout-switch-view-wrap">
          <LayoutCard layout={Layout.ListOnTop}></LayoutCard>
          <LayoutCard layout={Layout.ListOnRight}></LayoutCard>
        </div>
      </div>
      <div className="fcr-layout-switch-grid">
        <div className="fcr-layout-switch-title">Grid</div>
        <div className="fcr-layout-switch-view-wrap">
          <LayoutCard layout={Layout.Grid}></LayoutCard>
        </div>
      </div>
    </div>
  );
};
export const layoutMap = {
  [Layout.ListOnTop]: {
    label: 'List on top',
    bigIcon: SvgIconEnum.FCR_LIST_ON_TOP_BIG,
    smallIcon: SvgIconEnum.FCR_TOPWINDOWS,
  },
  [Layout.ListOnRight]: {
    label: 'List on right',
    bigIcon: SvgIconEnum.FCR_LIST_ON_RIGHT_BIG,
    smallIcon: SvgIconEnum.FCR_RIGHTWINDOWS,
  },
  [Layout.Grid]: {
    label: 'Grid',
    bigIcon: SvgIconEnum.FCR_GRID_BIG,
    smallIcon: SvgIconEnum.FCR_FOURWINDOWS,
  },
};

const LayoutCard = observer(({ layout }: { layout: Layout }) => {
  const {
    layoutUIStore: { layout: currentLayout, setLayout },
  } = useStore();
  const { label, bigIcon } = layoutMap[layout];
  const active = currentLayout === layout;
  return (
    <div
      onClick={() => setLayout(layout)}
      className={classnames('fcr-layout-switch-card', { 'fcr-layout-switch-card-active': active })}>
      <div className="fcr-layout-switch-card-checkbox">
        <Radio label={label} checked={active}></Radio>
      </div>
      <div className="fcr-layout-switch-card-icon">
        <SvgImg style={{ width: 100, height: 56 }} type={bigIcon}></SvgImg>
      </div>
    </div>
  );
});
export const LayoutSwitch = observer(() => {
  const {
    layoutUIStore: { layout: currentLayout, setHasPopoverShowed },
  } = useStore();
  return (
    <StatusBarItemWrapper>
      <PopoverWithTooltip
        popoverProps={{
          onVisibleChange(visible) {
            if (visible) {
              setHasPopoverShowed(true);
            } else {
              setHasPopoverShowed(false);
            }
          },
          placement: 'bottomLeft',
          overlayInnerStyle: { width: 'auto' },
          content: <LayoutSwitchPopover></LayoutSwitchPopover>,
        }}
        toolTipProps={{ content: 'Switch Layout' }}>
        <div className="fcr-status-bar-layout">
          <SvgImg type={layoutMap[currentLayout].smallIcon}></SvgImg>
          <span>Layout</span>
          <SvgImg type={SvgIconEnum.FCR_DROPDOWN} size={20}></SvgImg>
        </div>
      </PopoverWithTooltip>
    </StatusBarItemWrapper>
  );
});
