import { Popover } from '@onlineclass/components/popover';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { FC } from 'react';
import { ActionBarItemWithPopover, ActionBarItemWrapper } from '..';
import './index.css';
export const ToolBox = () => {
  return (
    <ActionBarItemWithPopover
      popoverProps={{
        overlayInnerStyle: { width: 'auto' },
        trigger: 'click',
        content: <ToolBoxPopoverContent></ToolBoxPopoverContent>,
      }}
      icon={SvgIconEnum.FCR_WHITEBOARD_TOOLBOX}
      text={'ToolBox'}></ActionBarItemWithPopover>
  );
};
const ToolBoxPopoverContent = () => {
  return (
    <div className="fcr-toolbox-popover-content">
      <div className="fcr-toolbox-popover-title">ToolBox</div>
      <div className="fcr-toolbox-popover-item-wrapper">
        <ToolBoxItem
          id={'timer'}
          icon={SvgIconEnum.FCR_V2_TIMER}
          label={'Timer'}
          active></ToolBoxItem>
        <ToolBoxItem id={'poll'} icon={SvgIconEnum.FCR_V2_VOTE} label={'Poll'} active></ToolBoxItem>
      </div>
    </div>
  );
};
interface ToolBoxItemProps {
  id: string;
  icon: SvgIconEnum;
  label: string;
  active: boolean;
}
const ToolBoxItem: FC<ToolBoxItemProps> = (props) => {
  const { icon, label, active } = props;
  return (
    <div className="fcr-toolbox-popover-item">
      <SvgImg type={icon} size={30}></SvgImg>
      <span className="fcr-toolbox-popover-item-label">{label}</span>
      {active && <div className="fcr-toolbox-popover-item-active"></div>}
    </div>
  );
};
