import { ToastApi } from '@components/toast';
import { useStore } from './use-store';

export const useAuthorization = (userUuid: string) => {
  const {
    presentationUIStore: { isBoardWidgetActive },
    boardApi: { grantedUsers, grantPrivilege },
    statusBarUIStore: { isHost },
  } = useStore();
  const granted = grantedUsers.has(userUuid);
  const tooltip = granted ? 'UnAuthorization' : 'Authorization';
  const toggleAuthorization = () => {
    if (isHost) {
      if (!isBoardWidgetActive)
        return ToastApi.open({
          persist: true,
          duration: 15000,
          toastProps: {
            closable: true,
            type: 'error',
            content: 'Please open the whiteboard first and then authorize the access',
          },
        });
      grantPrivilege(userUuid, !granted);
    }
  };
  return { tooltip, toggleAuthorization, granted };
};
