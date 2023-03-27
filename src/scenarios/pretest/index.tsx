import React, { useState } from 'react';
import pretestLogo from '@res/images/pretest-logo.png';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import './index.css';
import { useI18n } from 'agora-common-libs';
import { Button } from '@onlineclass/components/button';
import { ClickableIcon, PretestDeviceIcon } from '@onlineclass/components/svg-img/clickable-icon';
import { FashionTabs } from '@onlineclass/components/tabs';
import { VerticalSlider } from '@onlineclass/components/slider';
import { VirtualBackground } from './virtual-background';
import { BasicSettings } from './basic-settings';
import { BeautyFilter } from './beauty-filter';
export const Pretest = () => {
  const transI18n = useI18n();
  const [activeTab, setActiveTab] = useState('basic-settings');
  const handleActiveTab = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const tabItems = [
    { label: 'Basic Settings', key: 'basic-settings' },
    { label: 'Background', key: 'virtual-background' },
    { label: 'Beauty Filter', key: 'beauty-filter' },
  ];

  const tabContents = {
    'basic-settings': <BasicSettings />,
    'virtual-background': <VirtualBackground />,
    'beauty-filter': <BeautyFilter />,
  };

  return (
    <div className="fcr-pretest">
      {/* header */}
      <div className="fcr-pretest__header">
        <img className="fcr-pretest__logo" src={pretestLogo} />
        <button className="fcr-pretest__close-btn fcr-btn-click-effect">
          <SvgImg type={SvgIconEnum.FCR_CLOSE} />
        </button>
      </div>
      {/* center area */}
      <div className="fcr-pretest__center">
        <div className="fcr-pretest__video-portal">
          <div className="fcr-pretest__video-portal__header">
            <span>Are you ready to join?</span>
            <Button>Join</Button>
          </div>
          <div className="fcr-pretest__video-portal__video">
            <div className="fcr-pretest__video-portal__sidebar">
              <VerticalSlider />
              <ClickableIcon icon={SvgIconEnum.FCR_V2_LOUDER} size="small" />
            </div>
          </div>
          <div className="fcr-pretest__video-portal__toggles">
            <PretestDeviceIcon icon={SvgIconEnum.FCR_CAMERA} status="active" />
            <PretestDeviceIcon icon={SvgIconEnum.FCR_MUTECRASH} status="active" />
            <PretestDeviceIcon icon={SvgIconEnum.FCR_V2_LOUDER} status="active" />
            <PretestDeviceIcon
              status="idle"
              icon={SvgIconEnum.FCR_MIRRORIMAGE_LEFT}
              classNames="fcr-pretest__video-portal__toggles__mirror"
            />
          </div>
        </div>
        <div className="fcr-pretest__settings">
          <FashionTabs items={tabItems} activeKey={activeTab} onChange={handleActiveTab} />
          {tabContents[activeTab]}
        </div>
      </div>
    </div>
  );
};
