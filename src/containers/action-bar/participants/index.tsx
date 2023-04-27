import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react-lite';
import { ActionBarItem } from '..';
import './index.css';
export const Participants = observer(() => {
  const {
    participantsUIStore: {},
    layoutUIStore: { addDialog, hasDialogOf },
  } = useStore();
  return (
    <ToolTip content={'Participants'}>
      <ActionBarItem
        onClick={() => {
          if (!hasDialogOf('participants')) addDialog('participants');
        }}
        icon={SvgIconEnum.FCR_PEOPLE}
        text={'Participants'}></ActionBarItem>
    </ToolTip>
  );
});
