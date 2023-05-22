import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { ActionBarItem } from '..';
import './index.css';
export const Chat = observer(() => {
  const {
    chatApi: { chatDialogVisible },
    actionBarUIStore: { openChatDialog, closeChatDialog },
  } = useStore();
  return (
    <div>
      <div id="fcr-chatroom-slot"></div>
      <ToolTip content={chatDialogVisible ? 'Close chat' : 'Open chat'}>
        <ActionBarItem
          onClick={() => (chatDialogVisible ? closeChatDialog() : openChatDialog())}
          icon={SvgIconEnum.FCR_CHAT2}
          text={'Chat'}></ActionBarItem>
      </ToolTip>
    </div>
  );
});
