import React, { useState } from 'react';
import { BeautySlider } from '../device-pretest/beauty-slider';
import { MirrorToggle } from '../device-pretest/mirror-toggle';
import { LocalVideoPlayer } from '../video-player';
import { FashionTabs } from '@components/tabs';
import { VirtualBackground } from '../device-pretest/virtual-background';
import { BeautyFilter } from '../device-pretest/beauty-filter';
import { CameraSelect } from '../device-pretest/device-select';

const tabContents = {
  'virtual-background': <VirtualBackground />,
  'beauty-filter': <BeautyFilter />,
};

type TabKeyType = keyof typeof tabContents;

export const VideoSettings = () => {
  const [activeTab, setActiveTab] = useState<TabKeyType>('virtual-background');
  const handleActiveTab = (tabKey: string) => {
    setActiveTab(tabKey as TabKeyType);
  };

  const tabItems = [
    { label: 'Background', key: 'virtual-background' },
    { label: 'Beauty Filter', key: 'beauty-filter' },
  ];

  return (
    <div className="fcr-device-settings__video">
      <div className="fcr-device-settings__video-preview-title">
        <span>Effect Preview</span>
        <MirrorToggle placement="setting" />
      </div>
      <div className="fcr-device-settings__video-preview">
        <LocalVideoPlayer />
        <div className="fcr-device-settings__video-preview__sidebar">
          <BeautySlider />
        </div>
        <div className="fcr-device-settings__video-preview__device-select">
          <CameraSelect />
        </div>
      </div>
      <div className="fcr-device-settings__video-tabs">
        <FashionTabs items={tabItems} activeKey={activeTab} onChange={handleActiveTab} />
        {tabContents[activeTab]}
      </div>
    </div>
  );
};
