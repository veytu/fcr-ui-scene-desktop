import { useStore } from '@onlineclass/utils/hooks/use-store';
import { FC } from 'react';
import { DeviceSettings } from '.';
import { GlobalDialog } from '@components/dialog/global-dialog';
import { observer } from 'mobx-react';

export const DeviceSettingsDialog: FC = observer(() => {
  const {
    deviceSettingUIStore: { deviceSettingDialogVisible, setDeviceSettingDialogVisible },
  } = useStore();

  return (
    <GlobalDialog
      visible={deviceSettingDialogVisible}
      onClose={() => {
        setDeviceSettingDialogVisible(false);
      }}>
      <DeviceSettings></DeviceSettings>
    </GlobalDialog>
  );
});
