import { SvgIconEnum } from '@components/svg-img';
import { ActionBarItem } from '..';
import './index.css';
import { useStore } from '@onlineclass/utils/hooks/use-store';
import { observer } from 'mobx-react';
import { themeVal } from '@ui-kit-utils/tailwindcss';
import { ToolTip } from '@components/tooltip';
const colors = themeVal('colors');
export const Cloud = observer(() => {
  const {
    cloudUIStore: { setCloudDialogVisible },
  } = useStore();

  const handleClick = () => {
    setCloudDialogVisible(true);
  };

  return (
    <ToolTip content={'Open Cloud'}>
      <ActionBarItem
        icon={{
          type: SvgIconEnum.FCR_WHITEBOARD_CLOUD,
        }}
        text={
          <span
            style={{
              color: colors['text-2'],
            }}>
            Cloud
          </span>
        }
        onClick={handleClick}></ActionBarItem>
    </ToolTip>
  );
});
