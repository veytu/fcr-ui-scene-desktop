import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { ToolTip } from '@onlineclass/components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
export const RaiseHands = () => {
  return (
    <ToolTip content={'RaiseHands'}>
      <ActionBarItem icon={SvgIconEnum.FCR_RAISEHANDS} text={'RaiseHands'}></ActionBarItem>
    </ToolTip>
  );
};
