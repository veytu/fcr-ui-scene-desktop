import { SvgImg, SvgIconEnum } from '@onlineclass/components/svg-img';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { FC, PropsWithChildren } from 'react';
import { DeviceSettings } from '.';
import { Rnd } from 'react-rnd';

export const DeviceSettingsDialog: FC<PropsWithChildren<{ id: string }>> = ({ id }) => {
  const { layoutUIStore } = useStore();

  const handleClose = () => {
    layoutUIStore.deleteDialog(id);
  };

  return (
    // <Rnd enableResizing={false}>
      <div className="fcr-device-settings__dialog-wrapper">
        {/* header */}
        <div className="fcr-device-settings__header">
          <span>Setting</span>
          <div className="fcr-device-settings__close" onClick={handleClose}>
            <SvgImg
              type={SvgIconEnum.FCR_CLOSE}
              colors={{ iconPrimary: 'currentColor' }}
              size={20}
            />
          </div>
        </div>
        {/* body */}
        <div className="fcr-device-settings__body">
          <DeviceSettings />
        </div>
      </div>
    // </Rnd>
  );
};
