import { Checkbox } from '@onlineclass/components/checkbox';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import classnames from 'classnames';
import { useState } from 'react';
import './index.css';

const layoutMap = {
  top: {
    label: 'List on top',
    icon: SvgIconEnum.FCR_TOPWINDOWS,
  },
  right: {
    label: 'List on right',
    icon: SvgIconEnum.FCR_RIGHTWINDOWS,
  },
  grid: {
    label: 'Grid',
    icon: SvgIconEnum.FCR_FOURWINDOWS,
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
        <Checkbox label={label} checked={active}></Checkbox>
      </div>
      <div className="fcr-layout-switch-card-icon">
        <SvgImg style={{ width: 100, height: 56 }} type={icon}></SvgImg>
      </div>
    </div>
  );
};
