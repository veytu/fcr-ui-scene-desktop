import { LaunchOptions } from '..';

let _launchOptions: LaunchOptions | null = null;

export const setLaunchOptions = (launchOptions: LaunchOptions) => {
  _launchOptions = launchOptions;
};

export const getLaunchOptions = () => {
  return _launchOptions;
};
