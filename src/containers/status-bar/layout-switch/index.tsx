import { Radio } from '@onlineclass/components/radio';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { Layout } from '@onlineclass/uistores/type';
import classnames from 'classnames';
import './index.css';
import { observer } from 'mobx-react';
import { useStore } from '@onlineclass/utils/hooks';

export const LayoutSwitch = () => {
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
const layoutMap = {
  [Layout.ListOnTop]: {
    label: 'List on top',
    icon: SvgIconEnum.FCR_LIST_ON_TOP_BIG,
  },
  [Layout.ListOnRight]: {
    label: 'List on right',
    icon: SvgIconEnum.FCR_LIST_ON_RIGHT_BIG,
  },
  [Layout.Grid]: {
    label: 'Grid',
    icon: SvgIconEnum.FCR_GRID_BIG,
  },
};

const LayoutCard = observer(({ layout }: { layout: Layout }) => {
  const {
    layoutUIStore: { layout: currentLayout, setLayout },
  } = useStore();
  const { label, icon } = layoutMap[layout];
  const active = currentLayout === layout;
  return (
    <div
      onClick={() => setLayout(layout)}
      className={classnames('fcr-layout-switch-card', { 'fcr-layout-switch-card-active': active })}>
      <div className="fcr-layout-switch-card-checkbox">
        <Radio label={label} checked={active}></Radio>
      </div>
      <div className="fcr-layout-switch-card-icon">
        <SvgImg style={{ width: 100, height: 56 }} type={icon}></SvgImg>
      </div>
    </div>
  );
});
