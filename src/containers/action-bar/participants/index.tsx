import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react-lite';
import { ActionBarItem } from '..';
import './index.css';
import { DialogToolTip } from '@components/tooltip/dialog';
import { useEffect, useState } from 'react';
export const Participants = observer(() => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [dialogTooltipVisible, setDialogTooltipVisible] = useState(false);
  const {
    actionBarUIStore: { handsUpMap },
    participantsUIStore: {
      participantsDialogVisible,
      toggleParticipantsDialogVisible,
      setParticipantsDialogVisible,
      isHost,
    },
  } = useStore();
  useEffect(() => {
    if (handsUpMap.size > 0 && !participantsDialogVisible && isHost) {
      setDialogTooltipVisible(true);
    } else {
      setDialogTooltipVisible(false);
    }
  }, [handsUpMap.size, participantsDialogVisible]);

  return (
    <ToolTip
      visible={tooltipVisible}
      onVisibleChange={(visible) => {
        if (dialogTooltipVisible) {
          setTooltipVisible(false);
        } else {
          setTooltipVisible(visible);
        }
      }}
      content={participantsDialogVisible ? 'Close participants' : 'Open participants'}>
      <DialogToolTip
        closeable={false}
        overlayClassName="fcr-action-bar-raise-hand-dialog"
        content={
          <span
            className="fcr-action-bar-raise-hand-content"
            onClick={() => {
              setParticipantsDialogVisible(true);
              setDialogTooltipVisible(false);
            }}>
            <span>🙋</span> {handsUpMap.size} people raised hand, please click to view.
          </span>
        }
        visible={dialogTooltipVisible}>
        <ActionBarItem
          onClick={toggleParticipantsDialogVisible}
          icon={SvgIconEnum.FCR_PEOPLE}
          text={'Participants'}></ActionBarItem>
      </DialogToolTip>
    </ToolTip>
  );
});
