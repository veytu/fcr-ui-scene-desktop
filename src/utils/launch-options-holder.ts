import { Logger } from 'agora-common-libs';
import { LaunchOptions } from '..';

let _launchOptions: LaunchOptions | null = null;

export const setLaunchOptions = (launchOptions: LaunchOptions) => {
  _launchOptions = launchOptions;
};

export const getLaunchOptions = () => {
  if (!_launchOptions) {
    Logger.warn();
    throw new Error(
      'you should call setLaunchOptions to set a launch option before you use getLaunchOptions',
    );
  }

  return _launchOptions;
};
