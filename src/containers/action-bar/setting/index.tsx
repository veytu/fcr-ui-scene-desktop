import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { ActionBarItem } from '..';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';

export const Setting = () => {
  const {
    deviceSettingUIStore: { setDeviceSettingDialogVisible },
  } = useStore();
  const actionClickHandler = (action: 'settings') => {
    return () => {
      switch (action) {
        case 'settings':
          setDeviceSettingDialogVisible(true);
          break;
      }
    };
  };
  return (
    <ToolTip content="Setting">
      <ActionBarItem
        icon={SvgIconEnum.FCR_SETTING}
        text={'Setting'}
        onClick={actionClickHandler('settings')}></ActionBarItem>
    </ToolTip>
  );
};
