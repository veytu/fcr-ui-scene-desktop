import { observer } from 'mobx-react';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { SvgImg } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
export const StatusBarWidgetSlot = observer(() => {
  const { eduToolApi } = useStore();
  const handleClick = (widgetId: string) => () => {
    eduToolApi.setWidgetMinimized(false, widgetId);
  };
  return (
    <div className="fcr-status-bar-widget-slot">
      {eduToolApi.minimizedWidgetIcons.map(({ icon, widgetId, tooltip }, index) => (
        <ToolTip key={widgetId} content={tooltip}>
          <div className="fcr-minimized-widget-icon" key={index.toString()}>
            <SvgImg type={icon} size={20} onClick={handleClick(widgetId)} />
          </div>
        </ToolTip>
      ))}
    </div>
  );
});
