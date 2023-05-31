import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { ActionBarItem } from '..';
import { observer } from 'mobx-react';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { useEffect, useState } from 'react';
import { DialogToolTip } from '@components/tooltip/dialog';
import classnames from 'classnames';
export const RaiseHands = observer(() => {
  const {
    statusBarUIStore: { isStudent },
  } = useStore();
  return isStudent ? (
    <StudentRaiseHands></StudentRaiseHands>
  ) : (
    <TeacherRaiseHands></TeacherRaiseHands>
  );
});
const StudentRaiseHands = observer(() => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [dialogTooltipVisible, setDialogTooltipVisible] = useState(false);
  const {
    actionBarUIStore: { isHandsUp, lowerHand, raiseHand },
  } = useStore();
  useEffect(() => {
    setDialogTooltipVisible(isHandsUp);
  }, [isHandsUp]);
  useEffect(() => {
    dialogTooltipVisible && setTooltipVisible(false);
  }, [dialogTooltipVisible]);
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
      content={'RaiseHands'}>
      <DialogToolTip
        overlayClassName="fcr-action-bar-raise-hand-dialog"
        onClose={() => setDialogTooltipVisible(false)}
        visible={dialogTooltipVisible}
        content={
          <span className="fcr-action-bar-raise-hand-content" onClick={() => lowerHand()}>
            <span>🙋</span> Lower hand
          </span>
        }>
        <ActionBarItem
          classNames={classnames({ 'fcr-action-bar-raise-hand-active': isHandsUp })}
          onClick={() => {
            isHandsUp ? lowerHand() : raiseHand();
          }}
          icon={SvgIconEnum.FCR_STUDENT_RASIEHAND}
          text={'RaiseHands'}></ActionBarItem>
      </DialogToolTip>
    </ToolTip>
  );
});
const TeacherRaiseHands = observer(() => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [dialogTooltipVisible, setDialogTooltipVisible] = useState(false);
  const {
    actionBarUIStore: { handsUpMap },
    participantsUIStore: { setParticipantsDialogVisible, participantsDialogVisible },
  } = useStore();
  useEffect(() => {
    if (handsUpMap.size > 0 && !participantsDialogVisible) {
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
      content={'RaiseHands'}>
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
        <ActionBarItem icon={SvgIconEnum.FCR_RAISEHANDS} text={'RaiseHands'}></ActionBarItem>
      </DialogToolTip>
    </ToolTip>
  );
});
