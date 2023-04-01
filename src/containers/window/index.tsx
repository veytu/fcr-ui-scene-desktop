import { useStore } from '@onlineclass/utils/hooks/use-store';
import { generateShortUserName } from '@onlineclass/utils/short-name';
import { EduUserStruct } from 'agora-edu-core';
import { observer } from 'mobx-react';
import { FC } from 'react';
import './index.css';
interface UserWindowProps {
  user: EduUserStruct;
}
export const UserWindow: FC<UserWindowProps> = observer((props) => {
  const { user } = props;
  const {
    streamUIStore: { userCameraStreamByUserUuid },
  } = useStore();
  const stream = userCameraStreamByUserUuid(user.userUuid);
  return (
    <div className="fcr-user-window-wrap">
      <UserPlaceHolder user={user}></UserPlaceHolder>
      <StreamWindow></StreamWindow>
      <UserInteract></UserInteract>
    </div>
  );
});

const UserPlaceHolder: FC<UserWindowProps> = (props) => {
  return (
    <div className={'fcr-user-window-placeholder'}>
      {generateShortUserName(props.user.userName)}
    </div>
  );
};
const StreamWindow = () => {
  return <div></div>;
};
const UserInteract = () => {
  return <div></div>;
};
