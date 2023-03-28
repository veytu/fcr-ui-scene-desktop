import { Popover } from '@onlineclass/components/popover';
import { Radio } from '@onlineclass/components/radio';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import { ToolTip } from '@onlineclass/components/tooltip';
import { AgoraDeviceInfo } from 'agora-edu-core';
import { FC, useState } from 'react';
import { ActionBarItemWrapper } from '..';
import './index.css';

export const MicrophoenDevice: FC = () => {
  const [mute, setMute] = useState(false);
  const toggleMute = () => {
    setMute(!mute);
  };
  const icon = mute ? SvgIconEnum.FCR_NOMUTE : SvgIconEnum.FCR_MUTE;
  const text = mute ? 'unmute' : 'Microphoen';
  return (
    <ToolTip content={'Microphoen'}>
      <ActionBarItemWrapper>
        <div className="fcr-action-bar-device" onClick={toggleMute}>
          <div className="fcr-action-bar-device-inner">
            <SvgImg type={icon} size={36}></SvgImg>
            <div className="fcr-action-bar-device-text">{text}</div>
          </div>
          <Popover content={<DeviceListPopoverContent></DeviceListPopoverContent>} trigger="click">
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
    </ToolTip>
  );
};
export const CameraDevice: FC = () => {
  const [mute, setMute] = useState(false);
  const toggleMute = () => {
    setMute(!mute);
  };
  const icon = mute ? SvgIconEnum.FCR_CAMERAOFF : SvgIconEnum.FCR_CAMERA;
  const text = mute ? 'unmute' : 'Camera';
  return (
    <ToolTip content={'CameraDev'}>
      <ActionBarItemWrapper>
        <div className="fcr-action-bar-device" onClick={toggleMute}>
          <div className="fcr-action-bar-device-inner">
            <SvgImg type={icon} size={36}></SvgImg>
            <div className="fcr-action-bar-device-text">{text}</div>
          </div>
          <Popover content={<DeviceListPopoverContent></DeviceListPopoverContent>} trigger="click">
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
    </ToolTip>
  );
};

const DeviceListPopoverContent = () => {
  return (
    <div
      className="fcr-device-popover-content"
      onClick={(e) => {
        e.stopPropagation();
      }}>
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
