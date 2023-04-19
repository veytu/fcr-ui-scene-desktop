import { observer } from 'mobx-react';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { SvgImg } from '@components/svg-img';
export const StatusBarWidgetSlot = observer(() => {
  const { eduToolApi } = useStore();
  const handleClick = (widgetId: string) => () => {
    eduToolApi.setWidgetMinimized(false, widgetId);
  };
  return (
    <div className="fcr-status-bar-widget-slot">
      {eduToolApi.minimizedWidgetIcons.map(({ icon, widgetId }, index) => (
        <div className="fcr-minimized-widget-icon" key={index.toString()}>
          <SvgImg type={icon} size={24} onClick={handleClick(widgetId)} />
        </div>
      ))}
    </div>
  );
});
