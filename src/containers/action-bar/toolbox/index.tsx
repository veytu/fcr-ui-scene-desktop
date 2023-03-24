import { Popover } from '@onlineclass/components/popover';
import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ActionBarItemWithPopover, ActionBarItemWrapper } from '..';
import './index.css';
export const ToolBox = () => {
  return (
    <ActionBarItemWithPopover
      popoverProps={{ trigger: 'click' }}
      icon={SvgIconEnum.FCR_WHITEBOARD_TOOLBOX}
      text={'ToolBox'}></ActionBarItemWithPopover>
  );
};
