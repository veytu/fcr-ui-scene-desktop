import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { ActionBarItem } from '..';
import './index.css';
export const Chat = observer(() => {
  const {
    actionBarUIStore: { openChatDialog },
  } = useStore();
  return (
    <div>
      <div id="fcr-chatroom-slot"></div>
      <ToolTip content="Chat">
        <ActionBarItem
          onClick={openChatDialog}
          icon={SvgIconEnum.FCR_CHAT2}
          text={'Chat'}></ActionBarItem>
      </ToolTip>
    </div>
  );
});
