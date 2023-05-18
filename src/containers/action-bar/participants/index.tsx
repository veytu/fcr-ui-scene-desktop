import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react-lite';
import { ActionBarItem } from '..';
import './index.css';
export const Participants = observer(() => {
  const {
    participantsUIStore: { setParticipantsDialogVisible },
    layoutUIStore: { addDialog, hasDialogOf, deleteDialog },
  } = useStore();
  return (
    <ToolTip content={'Participants'}>
      <ActionBarItem
        onClick={() => {
          if (!hasDialogOf('participants')) {
            addDialog('participants');
            setParticipantsDialogVisible(true);
          } else {
            setParticipantsDialogVisible(false);
          }
        }}
        icon={SvgIconEnum.FCR_PEOPLE}
        text={'Participants'}></ActionBarItem>
    </ToolTip>
  );
});
