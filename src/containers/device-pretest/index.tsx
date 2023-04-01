import React, { useEffect, useState } from 'react';
import pretestLogo from '@res/images/pretest-logo.png';
import { SvgIconEnum, SvgImg } from '@onlineclass/components/svg-img';
import './index.css';
import { observer } from 'mobx-react';
import { useI18n } from 'agora-common-libs';
import { FashionTabs } from '@onlineclass/components/tabs';
import { VirtualBackground } from './virtual-background';
import { BasicSettings } from './basic-settings';
import { BeautyFilter } from './beauty-filter';
import { VideoPortal } from './video-portal';
import { useStore } from '@onlineclass/utils/hooks/use-store';

const tabContents = {
  'basic-settings': <BasicSettings />,
  'virtual-background': <VirtualBackground />,
  'beauty-filter': <BeautyFilter />,
};

type TabKeyType = keyof typeof tabContents;

export const DevicePretest = observer(() => {
  const transI18n = useI18n();
  const { deviceSettingUIStore } = useStore();
  const [activeTab, setActiveTab] = useState<TabKeyType>('basic-settings');
  const handleActiveTab = (tabKey: string) => {
    setActiveTab(tabKey as TabKeyType);
  };

  const tabItems = [
    { label: 'Basic Settings', key: 'basic-settings' },
    { label: 'Background', key: 'virtual-background' },
    { label: 'Beauty Filter', key: 'beauty-filter' },
  ];

  useEffect(() => {
    deviceSettingUIStore.startRecordingDeviceTest();
    return () => {
      deviceSettingUIStore.stopRecordingDeviceTest();
    };
  }, []);

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
        <VideoPortal />
        <div className="fcr-pretest__settings">
          <FashionTabs items={tabItems} activeKey={activeTab} onChange={handleActiveTab} />
          {tabContents[activeTab]}
        </div>
      </div>
    </div>
  );
});
