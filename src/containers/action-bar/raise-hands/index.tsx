import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
export const RaiseHands = () => {
  return (
    <ToolTip content={'RaiseHands'}>
      <ActionBarItem icon={SvgIconEnum.FCR_RAISEHANDS} text={'RaiseHands'}></ActionBarItem>
    </ToolTip>
  );
};
