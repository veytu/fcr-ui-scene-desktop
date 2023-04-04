import { SvgIconEnum } from '@components/svg-img';
import { ActionBarItem } from '..';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { Logger } from 'agora-common-libs/lib/annotation';
export const Whiteboard = () => {
  const { boardApi } = useStore();

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
      icon={SvgIconEnum.FCR_WHITEBOARD}
      text={'Whiteboard'}
      onClick={handleClick}></ActionBarItem>
  );
};
