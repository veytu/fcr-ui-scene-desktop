import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
import { observer } from 'mobx-react';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { Popover } from '@components/popover';
import { Button } from '@components/button';
import { useEffect } from 'react';
import { ClassState } from 'agora-edu-core';
export const Leave = observer(() => {
  const {
    actionBarUIStore: { setShowLeaveOption },
  } = useStore();
  return (
    <ToolTip content="Leave">
      <ActionBarItem
        onClick={() => setShowLeaveOption(true)}
        icon={SvgIconEnum.FCR_QUIT2}
        text={'Leave'}></ActionBarItem>
    </ToolTip>
  );
});
export const LeaveCheck = observer(() => {
  const {
    actionBarUIStore: { setShowLeaveOption },
    layoutUIStore: { setHasPopoverShowed },
  } = useStore();
  useEffect(() => {
    setHasPopoverShowed(true);
    return () => {
      setHasPopoverShowed(false);
    };
  }, []);
  return (
    <Popover
      placement="topRight"
      visible
      overlayInnerStyle={{ width: 289 }}
      content={<LeavePopoverContent></LeavePopoverContent>}>
      <div className="fcr-action-bar-cancel-leave">
        <Button onClick={() => setShowLeaveOption(false)} size="M" styleType="gray">
          Cancel
        </Button>
      </div>
    </Popover>
  );
});
const LeavePopoverContent = observer(() => {
  const {
    actionBarUIStore: { showEndClassButton, leaveClassroom },
    classroomStore: {
      roomStore: { updateClassState },
    },
  } = useStore();
  return (
    <div className="fcr-action-bar-leave-popover">
      <div className="fcr-action-bar-leave-popover-text">
        Are you sure you want to end your classroom？
      </div>
      <div className="fcr-action-bar-leave-popover-btns">
        {showEndClassButton && (
          <Button
            onClick={() => updateClassState(ClassState.close)}
            block
            size="M"
            styleType="danger">
            End the Classroom
          </Button>
        )}

        <Button
          block
          onClick={leaveClassroom}
          size="M"
          type={showEndClassButton ? 'secondary' : 'primary'}
          styleType="danger">
          Leave the Classroom
        </Button>
      </div>
    </div>
  );
});
