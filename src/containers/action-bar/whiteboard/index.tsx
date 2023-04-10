import { SvgIconEnum } from '@components/svg-img';
import { ActionBarItem } from '..';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { Logger } from 'agora-common-libs/lib/annotation';
import { observer } from 'mobx-react';
export const Whiteboard = observer(() => {
  const {
    boardApi,
    actionBarUIStore: { isLocalScreenSharing },
  } = useStore();

  const handleClick = () => {
    if (boardApi.mounted) {
      Logger.info('disable');
      boardApi.disable();
    } else {
      Logger.info('enable');
      boardApi.enable();
    }
  };

  return (
    <ActionBarItem
      disabled={isLocalScreenSharing}
      icon={SvgIconEnum.FCR_WHITEBOARD}
      text={'Whiteboard'}
      onClick={handleClick}></ActionBarItem>
  );
});
