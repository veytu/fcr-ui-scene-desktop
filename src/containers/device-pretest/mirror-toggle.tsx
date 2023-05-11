import { SvgIconEnum } from '@components/svg-img';
import { PretestDeviceIcon } from '@components/svg-img/clickable-icon';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { useMemo } from 'react';

export const MirrorToggle = observer(({ placement }: { placement: 'setting' | 'pretest' }) => {
  const { deviceSettingUIStore } = useStore();
  const mirrorIconProps = useMemo(() => {
    const enabled = deviceSettingUIStore.isLocalMirrorEnabled;
    return enabled
      ? {
          icon: SvgIconEnum.FCR_MIRRORIMAGE_LEFT,
        }
      : {
          icon: SvgIconEnum.FCR_MIRRORIMAGE_RIGHT,
        };
  }, [deviceSettingUIStore.isLocalMirrorEnabled]);
  const isCameraDeviceEnabled = deviceSettingUIStore.isCameraDeviceEnabled;
  return (
    <PretestDeviceIcon
      size={placement === 'pretest' ? 'large' : 'small'}
      classNames="fcr-pretest__video-portal__toggles__mirror"
      status={isCameraDeviceEnabled ? 'idle' : 'disabled'}
      tooltip={isCameraDeviceEnabled ? 'Mirror' : 'Mirror, please turn on the camera first'}
      onClick={deviceSettingUIStore.toggleLocalMirror}
      {...mirrorIconProps}
    />
  );
});
