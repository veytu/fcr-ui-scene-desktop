import { FC, PropsWithChildren, ReactNode, useEffect, useRef, useState } from 'react';
import classnames from 'classnames';
import './index.css';
import { observer } from 'mobx-react';
import { getConfig } from '@ui-scene/utils/launch-options-holder';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { formatRoomID } from '@ui-scene/utils';
import { isNumber } from 'lodash';
import { useStore } from '@ui-scene/ai-people/utils/hooks/use-store';
import { NetStateInfo } from '@ui-scene/ai-people/types';
import { ToolTip } from '@components/tooltip';
import { transI18n } from 'agora-common-libs';
import fscreen from 'fscreen';
import { Leave } from './leave';
import { ClassDuration } from './class-duration';

export const StatusBar = observer(() => {
  const ref = useRef<HTMLSpanElement | null>(null);
  //当前网络状态
  const { rtcStore: { netQuality } } = useStore();
  const [netStateInfo, setNetStateInfo] = useState<NetStateInfo>(netQuality)
  useEffect(() => { setNetStateInfo(netQuality) }, [netQuality])
  //全屏处理
  const [fullscreen, setFullscreen] = useState(false);
  const toggleFullscreen = () => {
    if (fullscreen) {
      fscreen.exitFullscreen();
    } else {
      fscreen.requestFullscreen(document.body);
    }
  };
  const handleFullscreenChanged = () => {
    if (fscreen.fullscreenElement) {
      setFullscreen(true);
    } else {
      setFullscreen(false);
    }
  };
  useEffect(() => {
    fscreen.addEventListener('fullscreenchange', handleFullscreenChanged);
    () => fscreen.removeEventListener('fullscreenchange', handleFullscreenChanged);
  }, []);

  //@ts-ignore 当前房间信息
  const { sessionInfo: { roomUuid,roomName } } = window.EduClassroomConfig

  const { logo } = getConfig();

  //获取tip提示样式
  const getTipTop = (tipTopContent: string,children: ReactNode) => {
    return <ToolTip placement="bottom" content={tipTopContent} trigger="hover" showArrow={true}
      overlayInnerStyle={{ background: 'white', color: '#000', fontFamily: 'PingFang HK', fontSize: '12px', fontWeight: 400, textAlign: 'left' }}
      arrowContent={<SvgImg type={SvgIconEnum.FCR_TOOLTIP_ARROW} colors={{ iconPrimary: 'white', iconSecondary: 'white' }} size={16}></SvgImg>}>
      {children}
    </ToolTip>
  }

  return (
    <div className={classnames('fcr-ai-people-status-bar')}>
      <div className='container-left'>
        <>
          {logo && <div className="fcr-status-bar-logo"><img src={logo as string}></img></div>}
          <div className="container-info">
            {
              getTipTop(netStateInfo.text,
                <div className="fcr-ai-people-status-bar-net-state">
                  <SvgImg type={netStateInfo.icon} size={24}></SvgImg>
                </div>)
            }
            {
              getTipTop(transI18n("fcr_ai_people_tip_room_id"),
                <div className={classnames('fcr-ai-people-status-bar-id-info', 'fcr-divider')}>
                  <span>ID:</span>
                  <span ref={ref} data-clipboard-text={roomUuid}>
                    {isNumber(roomUuid) ? formatRoomID(roomUuid.toString()) : roomUuid}
                  </span>
                </div>)
            }
          </div>
        </>
      </div>
      <div className="fcr-ai-people-status-bar-name">{roomName}</div>
      <div className='container-right'>
        {getTipTop(transI18n('fcr_ai_people_tip_time'), <ClassDuration></ClassDuration>)}
        {getTipTop(fullscreen
          ? transI18n('fcr_room_tips_exit_full_screen')
          : transI18n('fcr_room_tips_full_screen'),
          <div onClick={toggleFullscreen} className="fcr-ai-people-status-bar-full-info">
            <SvgImg
              size={24}
              type={
                fullscreen ? SvgIconEnum.FCR_WINDOW_SMALLER : SvgIconEnum.FCR_WINDOW_BIGGER
              }></SvgImg>
          </div>)}
          <Leave></Leave>
      </div>

      {/* <div className='container'>

        <div className="fcr-status-bar-left">
          <>
            {logo && <div className="fcr-status-bar-logo"><img src={logo as string}></img></div>}
            <StatusBarInfo />
          </>
        </div>
        <StatusBarRoomName></StatusBarRoomName>
        <div className="fcr-status-bar-right">
          <ClassDuration></ClassDuration>
          <FullscreenButton></FullscreenButton>
          <Leave></Leave>
        </div>
      </div> */}
    </div>
  );
});

export const StatusBarItemWrapper: FC<PropsWithChildren<any>> = (props) => {
  const { children, ...others } = props;
  return (
    <div {...others} className="fcr-status-bar-item-wrapper">
      {children}
    </div>
  );
};
