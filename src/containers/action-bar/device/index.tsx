import { Popover } from '@onlineclass/components/popover';
import { Radio } from '@onlineclass/components/radio';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { AgoraDeviceInfo } from 'agora-edu-core';
import { FC, useState } from 'react';
import { ActionBarItemWrapper } from '..';
import './index.css';
interface ActionBarDeviceProps {
  deviceList: AgoraDeviceInfo[];
  muteIcon: SvgIconEnum;
  unmuteIcon: SvgIconEnum;
  muteText: string;
  unmuteText: string;
  onDeviceChanged?: (device: AgoraDeviceInfo) => void;
}
const ActionBarDevice: FC<ActionBarDeviceProps> = (props) => {
  const { deviceList, muteIcon, unmuteIcon, muteText, unmuteText, onDeviceChanged } = props;
  const [mute, setMute] = useState(false);
  const toggleMute = () => {
    setMute(!mute);
  };
  return (
    <ActionBarItemWrapper>
      <div className="fcr-action-bar-device" onClick={toggleMute}>
        <div className="fcr-action-bar-device-inner">
          <SvgImg type={mute ? muteIcon : unmuteIcon} size={36}></SvgImg>
          <div className="fcr-action-bar-device-text">{mute ? muteText : unmuteText}</div>
        </div>
        <Popover
          getTooltipContainer={() => document.body}
          content={<DeviceListPopoverContent></DeviceListPopoverContent>}
          trigger="click">
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="fcr-action-bar-device-extra">
            <SvgImg type={SvgIconEnum.FCR_DROPUP4}></SvgImg>
          </div>
        </Popover>
      </div>
    </ActionBarItemWrapper>
  );
};

const DeviceListPopoverContent = () => {
  return (
    <div className="fcr-device-popover-content">
      <div className="fcr-device-popover-content-device-list">
        <div className="fcr-device-popover-content-device">
          <div className="fcr-device-popover-content-device-label">Local Camera</div>
          <div className="fcr-device-popover-content-device-options">
            <div>
              <Radio name="aaa" label={'选择一选择一选择一...'}></Radio>
            </div>

            <div>
              <Radio name="aaa" label={'选择一选择一选择一...'}></Radio>
            </div>
          </div>
        </div>
        <div className="fcr-device-popover-content-device">
          <div className="fcr-device-popover-content-device-label">Local Camera</div>
          <div className="fcr-device-popover-content-device-options">
            <div>
              <Radio name="bbb" label={'选择一选择一选择一...'}></Radio>
            </div>

            <div>
              <Radio name="bbb" label={'选择一选择一选择一...'}></Radio>
            </div>
          </div>
        </div>
      </div>
      <div className="fcr-device-popover-content-more">
        <SvgImg type={SvgIconEnum.FCR_SETTING} size={32}></SvgImg>
        <span>More Setting</span>
      </div>
    </div>
  );
};

export const MicrophoenDevice = () => {
  return (
    <ActionBarDevice
      deviceList={[]}
      muteIcon={SvgIconEnum.FCR_NOMUTE}
      unmuteIcon={SvgIconEnum.FCR_MUTE}
      muteText={'unmute'}
      unmuteText={'Microphone'}></ActionBarDevice>
  );
};
export const CameraDevice = () => {
  return (
    <ActionBarDevice
      deviceList={[]}
      muteIcon={SvgIconEnum.FCR_CAMERAOFF}
      unmuteIcon={SvgIconEnum.FCR_CAMERA}
      muteText={'unmute'}
      unmuteText={'Camera'}></ActionBarDevice>
  );
};
