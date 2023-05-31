import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react-lite';
import { ActionBarItem } from '..';
import './index.css';
export const Participants = observer(() => {
  const {
    participantsUIStore: { participantsDialogVisible, toggleParticipantsDialogVisible },
  } = useStore();
  return (
    <ToolTip content={participantsDialogVisible ? 'Close participants' : 'Open participants'}>
      <ActionBarItem
        onClick={toggleParticipantsDialogVisible}
        icon={SvgIconEnum.FCR_PEOPLE}
        text={'Participants'}></ActionBarItem>
    </ToolTip>
  );
});
