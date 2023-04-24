import './index.css';
import { observer } from 'mobx-react';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { StatusBarItemWrapper } from '..';
import { SvgIconEnum, SvgImg } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import classnames from 'classnames';
import { themeVal } from '@ui-kit-utils/tailwindcss';

export const RecordStatus = observer(() => {
  const {
    classroomStore: {
      recordingStore: { pauseRecording, resumeRecording },
      roomStore: { recordOnHold },
    },
    statusBarUIStore: { isRecording, isRecordStoped, isRecordStarting, isHost },
  } = useStore();
  const colors = themeVal('colors');
  const handleRecordStatus = () => {
    recordOnHold ? resumeRecording() : pauseRecording();
  };
  const text = isRecordStarting
    ? 'Preparing for recording, please wait...'
    : recordOnHold
    ? 'Paused'
    : 'Recording';
  const recordActive = isRecording && !recordOnHold;
  return !isRecordStoped ? (
    <StatusBarItemWrapper>
      <div className="fcr-status-bar-record">
        <div className="fcr-status-bar-record-status">
          <SvgImg
            className={classnames({ 'fcr-status-bar-record-starting': recordActive })}
            colors={{
              iconPrimary: recordActive ? colors['red']['6'] : colors['notsb-inverse'],
            }}
            type={SvgIconEnum.FCR_RECORDING_STOP}></SvgImg>
          <span>{text}</span>
        </div>
        {isHost && isRecording && (
          <ToolTip content={recordOnHold ? 'Click to start' : 'Click to pause'}>
            <div className="fcr-status-bar-record-action fcr-divider" onClick={handleRecordStatus}>
              <SvgImg
                type={
                  recordOnHold ? SvgIconEnum.FCR_RECORDING_PLAY : SvgIconEnum.FCR_STOP
                }></SvgImg>
            </div>
          </ToolTip>
        )}
      </div>
    </StatusBarItemWrapper>
  ) : null;
});
