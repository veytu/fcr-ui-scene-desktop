import { Radio } from '@onlineclass/components/radio';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import classnames from 'classnames';
import { useState } from 'react';
import './index.css';

const layoutMap = {
  top: {
    label: 'List on top',
    icon: SvgIconEnum.FCR_LIST_ON_TOP_BIG,
  },
  right: {
    label: 'List on right',
    icon: SvgIconEnum.FCR_LIST_ON_RIGHT_BIG,
  },
  grid: {
    label: 'Grid',
    icon: SvgIconEnum.FCR_GRID_BIG,
  },
};

export const LayoutSwitch = () => {
  const [layout, setLayout] = useState('top');
  return (
    <div className="fcr-layout-switch">
      <div className="fcr-layout-switch-speaker-view">
        <div className="fcr-layout-switch-title">Speaker View</div>
        <div className="fcr-layout-switch-view-wrap">
          <LayoutCard
            active={layout === 'top'}
            {...layoutMap.top}
            onClick={() => {
              setLayout('top');
            }}></LayoutCard>
          <LayoutCard
            active={layout === 'right'}
            {...layoutMap.right}
            onClick={() => {
              setLayout('right');
            }}></LayoutCard>
        </div>
      </div>
      <div className="fcr-layout-switch-grid">
        <div className="fcr-layout-switch-title">Grid</div>
        <div className="fcr-layout-switch-view-wrap">
          <LayoutCard
            active={layout === 'grid'}
            {...layoutMap.grid}
            onClick={() => {
              setLayout('grid');
            }}></LayoutCard>
        </div>
      </div>
    </div>
  );
};

const LayoutCard = ({
  label,
  active,
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  icon: SvgIconEnum;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={classnames('fcr-layout-switch-card', { 'fcr-layout-switch-card-active': active })}>
      <div className="fcr-layout-switch-card-checkbox">
        <Radio label={label} checked={active}></Radio>
      </div>
      <div className="fcr-layout-switch-card-icon">
        <SvgImg style={{ width: 100, height: 56 }} type={icon}></SvgImg>
      </div>
    </div>
  );
};
