import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { FC } from 'react';
import { ActionBarItemWithPopover } from '..';
import { observer } from 'mobx-react';
import './index.css';
import { PredefinedWidgetTrack } from 'agora-common-libs/lib/widget/helper';
export const ToolBox = observer(() => {
  const {
    layoutUIStore: { setHasPopoverShowed },
  } = useStore();
  return (
    <ActionBarItemWithPopover
      popoverProps={{
        onVisibleChange(visible) {
          if (visible) {
            setHasPopoverShowed(true);
          } else {
            setHasPopoverShowed(false);
          }
        },
        overlayInnerStyle: { width: 'auto' },
        trigger: 'click',
        content: <ToolBoxPopoverContent></ToolBoxPopoverContent>,
      }}
      icon={SvgIconEnum.FCR_WHITEBOARD_TOOLBOX}
      text={'ToolBox'}></ActionBarItemWithPopover>
  );
});
const ToolBoxPopoverContent = observer(() => {
  const { getters } = useStore();
  const isWidgetActive = (widgetId: string) => getters.activeWidgetIds.includes(widgetId);
  return (
    <div className="fcr-toolbox-popover-content">
      <div className="fcr-toolbox-popover-title">ToolBox</div>
      <div className="fcr-toolbox-popover-item-wrapper">
        {[
          { label: 'Timer', id: 'timer', icon: SvgIconEnum.FCR_V2_TIMER },
          { label: 'Poll', id: 'poll', icon: SvgIconEnum.FCR_V2_VOTE },
        ].map(({ id, icon, label }) => (
          <ToolBoxItem key={id} id={id} icon={icon} label={label} active={isWidgetActive(id)} />
        ))}
      </div>
    </div>
  );
});
interface ToolBoxItemProps {
  id: string;
  icon: SvgIconEnum;
  label: string;
  active: boolean;
}
const ToolBoxItem: FC<ToolBoxItemProps> = observer((props) => {
  const { icon, label, active, id } = props;
  const { widgetUIStore, eduToolApi } = useStore();

  const handleClick = () => {
    if (eduToolApi.isWidgetMinimized(id)) {
      eduToolApi.setWidgetMinimized(false, id);
    } else {
      widgetUIStore.createWidget(id, {
        trackProperties: PredefinedWidgetTrack.TrackCentered,
      });
    }
  };

  return (
    <div className="fcr-toolbox-popover-item" onClick={handleClick}>
      <SvgImg type={icon} size={30}></SvgImg>
      <span className="fcr-toolbox-popover-item-label">{label}</span>
      {active && <div className="fcr-toolbox-popover-item-active"></div>}
    </div>
  );
});
