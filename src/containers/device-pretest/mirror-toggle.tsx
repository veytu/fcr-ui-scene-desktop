import { SvgIconEnum } from '@onlineclass/components/svg-img';
import { PretestDeviceIcon } from '@onlineclass/components/svg-img/clickable-icon';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { useMemo } from 'react';

export const MirrorToggle = observer(() => {
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

  return (
    <PretestDeviceIcon
      classNames="fcr-pretest__video-portal__toggles__mirror"
      status="idle"
      tooltip="Mirror"
      onClick={deviceSettingUIStore.toggleLocalMirror}
      {...mirrorIconProps}
    />
  );
});
