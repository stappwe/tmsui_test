import { EuiAppConfig } from '@eui/core';
import { GLOBAL } from './global';
import { MODULES } from './modules';

// ---> DON'T REMOVE
/// ---build-replace
export const APP_INFOS = '%VER% - %DATE_TIME%';
/// ---end-build-replace
// <--- END DON'T REMOVE

export const appConfig: EuiAppConfig = {
  global: GLOBAL,
  modules: MODULES,
  appInfos: APP_INFOS
};
