import { useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useStore } from '@ui-scene/utils/hooks/use-store';
import { Checkbox } from '@components/checkbox';
import { HorizontalSlider } from '@components/slider';
import { useI18n } from 'agora-common-libs';
import { Avatar } from '@components/avatar';
import { Dropdown } from '@components/dropdown';
import { Switch } from '@components/switch';
import {AgoraWidgetController} from 'agora-edu-core';

// import { AgoraExtensionWidgetEvent } from '../events';


export const SubtitlesSettings = observer(() => {
  const transI18n = useI18n();
  const { deviceSettingUIStore,getters } = useStore();
  const [sourceLanguageId, setSourceLanguageId] = useState(localStorage.getItem(getters.roomUuid+'_sourceLan') || 'zh-CN');
  const [translateLanguageId, setTranslateLanguageId] = useState(localStorage.getItem(getters.roomUuid+'_targetLan') || 'zh-CN');
  const [horizontalValue, setHorizontalValue] = useState<number>(Number(localStorage.getItem(getters.roomUuid+'_textSize')) || 14);
  const[isAiDenoiserEnabled,setIsAiDenoiserEnabled] = useState("true" === localStorage.getItem(getters.roomUuid+'_showDoubleLan') || false)
  const { eduToolApi } = useStore();
  const {
    startAudioRecordingPreview,
    stopAudioRecordingPreview,
  } = deviceSettingUIStore;
  // fcr_device_label_language_allshow
  // 
  const toggleAiDenoiser = ()=>{
    // eduToolApi.ChangeRttShowDoubleLan(!isAiDenoiserEnabled);
    setIsAiDenoiserEnabled(!isAiDenoiserEnabled)
    eduToolApi.sendWidgetChangeRttShowDoubleLan('rttbox',true)
    eduToolApi.sendWidgetChangeRttShowDoubleLan('rtt',true)
    
  }
  // 修改字号
  const handleHorizontalChange = (value: number) => {
    setHorizontalValue(value);
    localStorage.setItem(getters.roomUuid+'_sourceLan', value.toString());
    eduToolApi.sendWidgetChangeRttTextSize('rttbox',true)
    eduToolApi.sendWidgetChangeRttTextSize('rtt',true)
    
  };
  useEffect(() => {
    startAudioRecordingPreview();
    return stopAudioRecordingPreview;
  }, [startAudioRecordingPreview, stopAudioRecordingPreview]);

  // const languageList = [
  //   { text: '不翻译', value: '' },
  //   { text: '中文', value: 'zh-CN' }, 
  //   { text: '英文', value: 'en-US' },
  //   { text: '日语', value: 'ja-JP' },
  // ];
  const sourceLanguageList = [
    { text: transI18n('fcr_subtitles_option_translation_display_chinese'), value: 'zh-CN' }, 
    { text: transI18n('fcr_subtitles_option_translation_display_english'), value: 'en-US' },
    { text: transI18n('fcr_subtitles_option_translation_display_japanese'), value: 'ja-JP' },
  ];
  const targetLanguageList = [
    { text: transI18n('fcr_device_label_no_translate'), value: '' },
    { text: transI18n('fcr_subtitles_option_translation_display_chinese'), value: 'zh-CN' }, 
    { text: transI18n('fcr_subtitles_option_translation_display_english'), value: 'en-US' },
    { text: transI18n('fcr_subtitles_option_translation_display_japanese'), value: 'ja-JP' },
  ];

  // 设置翻译语言
  const handleTranslateLanguageChange = (languageId: string) => {
    setTranslateLanguageId(languageId);
    localStorage.setItem(getters.roomUuid+'_targetLan', languageId);
    eduToolApi.sendWidgetChangeRttTargetLan('rttbox',true)
    eduToolApi.sendWidgetChangeRttTargetLan('rtt',true)
  };

  // 设置声源语言
  const handleSourceLanguageChange = (languageId: string) => {
    setSourceLanguageId(languageId);
    localStorage.setItem(getters.roomUuid+'_sourceLan', languageId);
    eduToolApi.sendWidgetChangeRttSourceLant('rttbox',true)
    eduToolApi.sendWidgetChangeRttSourceLant('rtt',true)
  };

  return (
    <div className="fcr-device-settings__audio">
      <div className="fcr-device-settings__microphone">
        <div className="fcr-device-settings__label">
          <span>{transI18n('fcr_device_label_source_language')}</span>
        </div>
        <span className='fcr-device-settings__label-detail'>{transI18n('fcr_device_label_translate_language_detail')}</span>
        <Dropdown
          options={sourceLanguageList}
          onChange={handleSourceLanguageChange}
          value={sourceLanguageId}
          disabled={sourceLanguageList.length === 0}
        />
      </div>
      <div className="fcr-device-settings__microphone fcr-device-settings__microphone" style={{padding:'14px 20px'}}>
        <div className="fcr-device-settings__label fcr-device-settings-subtitle__label" style={{lineHeight:'normal',paddingLeft:'0'}}>
          <span>{transI18n('fcr_device_label_translate_language')}</span>
          {/*  onChange={handleAllMute} value={allMuted} */}
          <Switch></Switch>
        </div>
        <span className='fcr-device-settings__label-detail'>{transI18n('fcr_device_label_translate_language_detail')}</span>
        <br></br>
        <Dropdown
          options={targetLanguageList}
          onChange={handleTranslateLanguageChange}
          value={translateLanguageId}
          disabled={targetLanguageList.length === 0}
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
