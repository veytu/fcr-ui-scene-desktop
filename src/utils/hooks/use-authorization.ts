import { ToastApi } from '@components/toast';
import { useStore } from './use-store';
import { useI18n } from 'agora-common-libs';
import { isH5 } from '@ui-scene/containers/participants';

export const useAuthorization = (userUuid: string) => {
  const {
    presentationUIStore: { isBoardWidgetActive },
    boardApi: { grantedUsers, grantPrivilege },
    statusBarUIStore: { isHost },
    participantsUIStore: {
      participantTableList
    },
  } = useStore();
  const transI18n = useI18n();
  const granted = grantedUsers.has(userUuid);
  const tooltip = granted
    ? transI18n('fcr_user_button_unauthorization')
    : transI18n('fcr_user_button_authorization');
  const toggleAuthorization = () => {
    if (isHost) {
      if (!isBoardWidgetActive)
        return ToastApi.open({
          persist: true,
          duration: 15000,
          toastProps: {
            closable: true,
            type: 'error',
            content: transI18n('fcr_room_tips_authorize_open_whiteboard'),
          },
        });
      const user = participantTableList.filter((participant) => {
        return participant.user.userUuid === userUuid
      })
      if (isH5(user[0]?.user))
        return ToastApi.open({
          persist: true,
          duration: 15000,
          toastProps: {
            closable: true,
            type: 'error',
            content: transI18n('fcr_participants_tips_device_mobile_web_not_support'),
          },
        });
      grantPrivilege(userUuid, !granted);
    }
  };
  return { tooltip, toggleAuthorization, granted };
};
