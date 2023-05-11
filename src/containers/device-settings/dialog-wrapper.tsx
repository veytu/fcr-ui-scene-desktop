import { SvgImg, SvgIconEnum } from '@components/svg-img';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { FC, PropsWithChildren, useState } from 'react';
import { DeviceSettings } from '.';
import { Rnd } from 'react-rnd';
import { BaseDialog } from '@components/dialog';

export const DeviceSettingsDialog: FC<PropsWithChildren<{ id: string }>> = ({ id }) => {
  const [visible, setVisible] = useState(true);
  const { layoutUIStore } = useStore();

  const handleClose = () => {
    layoutUIStore.deleteDialog(id);
  };

  return (
    // <Rnd enableResizing={false}>
    <BaseDialog
      wrapClassName="fcr-device-settings__dialog"
      visible={visible}
      afterClose={handleClose}
      maskClosable={false}
      closable={false}>
      <div className="fcr-device-settings__dialog-wrapper">
        {/* header */}
        <div className="fcr-device-settings__header">
          <span>Setting</span>
          <div className="fcr-device-settings__close" onClick={() => setVisible(false)}>
            <SvgImg
              type={SvgIconEnum.FCR_CLOSE}
              colors={{ iconPrimary: 'currentColor' }}
              size={16}
            />
          </div>
        </div>
        {/* body */}
        <div className="fcr-device-settings__body">
          <DeviceSettings />
        </div>
      </div>
    </BaseDialog>

    // </Rnd>
  );
};
