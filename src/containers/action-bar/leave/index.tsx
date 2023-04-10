import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
import { observer } from 'mobx-react';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { Popover } from '@components/popover';
import { Button } from '@components/button';
import { useEffect } from 'react';
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
    <Popover placement="topRight" visible content={<LeavePopoverContent></LeavePopoverContent>}>
      <div onClick={() => setShowLeaveOption(false)} className="fcr-action-bar-cancel-leave">
        Cancel
      </div>
    </Popover>
  );
});
const LeavePopoverContent = observer(() => {
  const {
    actionBarUIStore: { showEndClassButton },
  } = useStore();
  return (
    <div className="fcr-action-bar-leave-popover">
      <div className="fcr-action-bar-leave-popover-text">
        Are you sure you want to end your room？
      </div>
      <div className="fcr-action-bar-leave-popover-btns">
        {showEndClassButton && (
          <Button block size="L" styleType="danger">
            End the Room
          </Button>
        )}

        <Button block size="L" type="secondary" styleType="danger">
          Leave the Room
        </Button>
      </div>
    </div>
  );
});
