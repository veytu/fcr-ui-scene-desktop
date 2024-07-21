import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { useStore } from '@ui-scene/utils/hooks/use-store';
import { FC, useEffect, useState } from 'react';
import { ActionBarItemWithPopover } from '..';
import { observer } from 'mobx-react';
import './index.css';
import { useI18n } from 'agora-common-libs';
import { ToolTip } from '@components/tooltip';
import { useZIndex } from '@ui-scene/utils/hooks/use-z-index';
// import 
export const ToolBox = observer(() => {
  const {
    actionBarUIStore: { openChatDialog, setPrivateChat },
    layoutUIStore: { setHasPopoverShowed },
  } = useStore();
  const transI18n = useI18n();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const {  eduToolApi } = useStore();
  
  return (
    <>
      <ToolTip
        visible={tooltipVisible}
        onVisibleChange={(visible: boolean) => {
          if (popoverVisible) {
            setTooltipVisible(false);
            return;
          }
          setTooltipVisible(visible);
        }}
        content={transI18n('fcr_room_button_toolbox')}>
        <div>
          <ActionBarItemWithPopover
            popoverProps={{
              visible: popoverVisible,
              onVisibleChange(visible) {
                setPopoverVisible(visible);
                if (visible) {
                  setTooltipVisible(false);
                  setHasPopoverShowed(true);
                } else {
                  setHasPopoverShowed(false);
                }
              },
              overlayInnerStyle: { width: 'auto' },
              trigger: 'click',
              content: (
                <ToolBoxPopoverContent
                  onClick={() => setPopoverVisible(false)}></ToolBoxPopoverContent>
              ),
            }}
            icon={SvgIconEnum.FCR_WHITEBOARD_TOOLBOX}
            text={transI18n('fcr_room_button_toolbox')}></ActionBarItemWithPopover>
        </div>
      </ToolTip>
    </>
  );
});
const ToolBoxPopoverContent = observer(({ onClick }: { onClick: () => void }) => {
  const {
    getters,
    eduToolApi: { registeredCabinetToolItems },
  } = useStore();
  const transI18n = useI18n();
  const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);
  const handleWidgetIdChange = (id: string) => {
    setActiveWidgetId(id); // 更新状态
  };
  const isWidgetActive = (widgetId: string) => {
    if (widgetId === 'breakout') {
      return getters.isBreakoutActive;
    }
    if (widgetId === 'rtt') {
      return activeWidgetId === widgetId
    }
    return getters.activeWidgetIds.includes(widgetId);
  };
  return (
    <div className="fcr-toolbox-popover-content">
      <div className="fcr-toolbox-popover-title">{transI18n('fcr_room_button_toolbox')}</div>
      <div className="fcr-toolbox-popover-item-wrapper">
        {registeredCabinetToolItems.map(({ id, iconType, name }) => (
          <ToolBoxItem
            key={id}
            id={id}
            icon={iconType}
            label={name}
            onClick={onClick}
            onWidgetIdChange={(id: string)=>{
              setActiveWidgetId(id); // 更新状态
            }}
            active={isWidgetActive(id)}
            dropupActive={id == "rtt" || id == "rttbox"}
          />
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
  dropupActive: boolean;
  onClick: () => void;
  onWidgetIdChange: (id: string) => void;
}
const ToolBoxItem: FC<ToolBoxItemProps> = observer((props) => {
  const { icon, label, active, dropupActive, id, onClick, onWidgetIdChange } = props;
  const { widgetUIStore, eduToolApi, breakoutUIStore } = useStore();
  const { updateZIndex } = useZIndex(id);
  const [activeWidgetId, setActiveWidgetId] = useState(null);
  useEffect(() => {
    if (id == 'rtt') {
      widgetUIStore.createWidget(id);
      eduToolApi.setWidgetVisible(id, false);
      eduToolApi.sendWidgetVisibleIsShowTool(id, true);
    }
  }, []);
  const handleClick = () => {
    if (eduToolApi.isWidgetMinimized(id)) {
      eduToolApi.setMinimizedState({
        minimized: false,
        widgetId: id,
        minimizedProperties: {
          minimizedCollapsed:
            widgetUIStore.widgetInstanceList.find((w) => w.widgetId === id)?.minimizedProperties
              ?.minimizedCollapsed || false,
        },
      }); 
    } else {
      updateZIndex();
      onWidgetIdChange(id)
      if (id === 'breakout') {
        breakoutUIStore.setDialogVisible(true);
      } else if (id == 'rtt') {
        eduToolApi.setWidgetVisible('rtt', true);
        eduToolApi.sendWidgetVisibleIsShowRtt(id, true);
      } else {
        if(id=="rttbox"){
          eduToolApi.sendWidgetRttboxShow(id, true); 
        }
        widgetUIStore.createWidget(id);
      }
    }
    onClick();
  };
  // 点击设置小三角
  const handleSettingClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  }
  return (
    <div className="fcr-toolbox-popover-item" onClick={handleClick}>
      <SvgImg type={icon} size={30}></SvgImg>
      <span className="fcr-toolbox-popover-item-label">{label}</span>
     {dropupActive&&<div className='fcr-toolbox-popover-item-dropbox' onClick={()=>handleSettingClick}>
        {/* <SvgImg className='fcr_dropup' type={SvgIconEnum.FCR_DROPUP5} size={30}></SvgImg> */}
      </div>}
      {active && <div className="fcr-toolbox-popover-item-active"></div>}
    </div>
  );
});
