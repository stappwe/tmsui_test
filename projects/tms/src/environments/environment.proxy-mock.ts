// used by serve / when no configuration is provided on the build script
// run npm run build

export const environment = {
  production: false,
  version: '10.0.0',
  enableDevToolRedux: true,
  assets: './assets/i18n/',
  excelExportRowsLimit: 50000,
  oldTMSUrl: 'TMS/',
  webRestrictUrl: 'TMSWebRestrict/',
  apiBaseUrl: '/Twinning/api/',
  refreshAPI : 'user/keep-application-alive',
  ecasLogin : 'https://webgate.ec.europa.eu/cas/login',
  ecasLogout : 'https://webgate.ec.europa.eu/cas/logout',
  webfolderUrl: '/Twinning/',
  environmentLabel: 'MockUp',
  maxFileLength: 100000000,  // 100mb
  maxVideoLength: 2000000000 // 2GB
};
