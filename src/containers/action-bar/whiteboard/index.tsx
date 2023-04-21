import { SvgIconEnum } from '@components/svg-img';
import { ActionBarItem } from '..';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { Logger } from 'agora-common-libs/lib/annotation';
import { observer } from 'mobx-react';
import { themeVal } from '@ui-kit-utils/tailwindcss';
const colors = themeVal('colors');
export const Whiteboard = observer(() => {
  const {
    boardApi,
    actionBarUIStore: { isLocalScreenSharing },
    presentationUIStore: { isBoardWidgetActive },
  } = useStore();

  const handleClick = () => {
    if (isBoardWidgetActive) {
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
      icon={{
        type: isBoardWidgetActive ? SvgIconEnum.FCR_WHITEBOARD_ON : SvgIconEnum.FCR_WHITEBOARD,
        colors: { iconPrimary: isBoardWidgetActive ? colors['red'][6] : colors['icon-1'] },
      }}
      text={
        <span
          style={{
            color: isBoardWidgetActive ? colors['red'][6] : colors['text-1'],
          }}>
          Whiteboard
        </span>
      }
      onClick={handleClick}></ActionBarItem>
  );
});
