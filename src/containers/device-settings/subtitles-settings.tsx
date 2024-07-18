import React, { useEffect, useState } from 'react';
import { VolumeIndicator } from '@components/volume';
import { observer } from 'mobx-react';
import { useStore } from '@ui-scene/utils/hooks/use-store';
import { Checkbox } from '@components/checkbox';
import { HorizontalSlider } from '@components/slider';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { useI18n } from 'agora-common-libs';
import { Avatar } from '@components/avatar';
import { Dropdown } from '@components/dropdown';
import { Switch } from '@components/switch';

export const SubtitlesSettings = observer(() => {
  const transI18n = useI18n();
  const { deviceSettingUIStore } = useStore();
  const [sourceLanguageId, setSourceLanguageId] = useState(localStorage.getItem("sourceLanguageId") || 'zh-CN');
  const [translateLanguageId, setTranslateLanguageId] = useState(localStorage.getItem("translatelanguageId") || 'zh-CN');
  const [horizontalValue, setHorizontalValue] = useState<number>(Number(localStorage.getItem("subtitleFontSize")) || 14);
  const {
    localRecordingTestVolume,
    localPlaybackTestVolume,
    toggleAiDenoiser,
    startAudioRecordingPreview,
    stopAudioRecordingPreview,
    isAiDenoiserEnabled,
  } = deviceSettingUIStore;

  const handleHorizontalChange = (value: number) => {
    setHorizontalValue(value);
    localStorage.setItem("subtitleFontSize", value.toString());
    
  };

  useEffect(() => {
    startAudioRecordingPreview();
    return stopAudioRecordingPreview;
  }, [startAudioRecordingPreview, stopAudioRecordingPreview]);

  const languageList = [
    { text: '不翻译', value: '' },
    { text: '中文(简体)', value: 'zh-CN' }, 
    { text: '英文', value: 'en-US' },
    { text: '日语', value: 'ja-JP' },
  ];

  // 设置翻译语言
  const handleTranslateLanguageChange = (languageId: string) => {
    setTranslateLanguageId(languageId);
    localStorage.setItem("translatelanguageId", languageId);
  };

  // 设置声源语言
  const handleSourceLanguageChange = (languageId: string) => {
    setSourceLanguageId(languageId);
    localStorage.setItem("sourceLanguageId", languageId);
  };

  return (
    <div className="fcr-device-settings__audio">
      <div className="fcr-device-settings__microphone">
        <div className="fcr-device-settings__label">
          <span>{transI18n('fcr_device_label_source_language')}</span>
        </div>
        <span className='fcr-device-settings__label-detail'>{transI18n('fcr_device_label_translate_language_detail')}</span>
        <Dropdown
          options={languageList}
          onChange={handleSourceLanguageChange}
          value={sourceLanguageId}
          disabled={languageList.length === 0}
        />
      </div>
      <div className="fcr-device-settings__microphone">
        <div className="fcr-device-settings__label">
          <span>{transI18n('fcr_device_label_translate_language')}</span>
          {/*  onChange={handleAllMute} value={allMuted} */}
          <Switch></Switch>
        </div>
        <span className='fcr-device-settings__label-detail'>{transI18n('fcr_device_label_translate_language_detail')}</span>
        <br></br>
        <Dropdown
          options={languageList}
          onChange={handleTranslateLanguageChange}
          value={translateLanguageId}
          disabled={languageList.length === 0}
        />
        <br></br>
        <Checkbox
          checked={isAiDenoiserEnabled}
          size="small"
          label={transI18n('fcr_device_label_language_allshow')}
          onChange={toggleAiDenoiser}
        />
      </div>
      <div className="fcr-device-settings__microphone">
        <div className="fcr-device-settings__label">
          <span>{transI18n('fcr_device_label_subtitle_font_size')}</span>
        </div>
        <div className="slider-container">
          <HorizontalSlider
            min={14}
            max={20}
            defaultValue={50}
            value={horizontalValue}
            onChange={handleHorizontalChange}
          />
          <div className="fcr-rtt-widget-text">
            <Avatar textSize={14} size={30} nickName="T"></Avatar>
            <div>         
              <div className="fcr-rtt-widget-name">Tony:</div>
              <div className="fcr-rtt-widget-transcribe" style={{ fontSize: horizontalValue + "px" }}>
                this is subtitles
              </div>
              <div className="fcr-rtt-widget-translate" style={{ fontSize: horizontalValue + "px" }}>this is 翻译。</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
