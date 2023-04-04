import { SvgIconEnum } from '@components/svg-img';
import { ToolTip } from '@components/tooltip';
import { ActionBarItem } from '..';
import { observer } from 'mobx-react';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { themeVal } from '@ui-kit-utils/tailwindcss';
import classnames from 'classnames';
const colors = themeVal('colors');
export const Record = observer(() => {
  const {
    statusBarUIStore: { isRecordStarting, isRecordStoped },
    layoutUIStore: { addDialog },
    actionBarUIStore: { startRecording },
  } = useStore();
  const handleRecord = () => {
    if (isRecordStoped) {
      addDialog('confirm', {
        title: 'Recording Prompt',
        content: 'Are you sure you want to start recording?',
        cancelText: 'Cancel',
        okText: 'Record',
        onOk: startRecording,
      });
    }
  };
  const icon = isRecordStoped ? SvgIconEnum.FCR_RECORDING_ON : SvgIconEnum.FCR_RECORDING_STOP;
  const iconColor = isRecordStoped ? colors['icon-1'] : colors['red']['6'];
  return (
    <ToolTip content={'Recording'}>
      <ActionBarItem
        onClick={handleRecord}
        icon={{
          type: icon,
          colors: { iconPrimary: iconColor },
          className: classnames({ 'fcr-status-bar-record-starting': isRecordStarting }),
        }}
        text={'Recording'}></ActionBarItem>
    </ToolTip>
  );
});
