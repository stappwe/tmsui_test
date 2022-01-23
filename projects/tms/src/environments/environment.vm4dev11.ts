// used by serve / when no configuration is provided on the build script
// run npm run build

export const environment = {
  production: false,
  version: '10.0.0',
  enableDevToolRedux: true,
  assets: './assets/i18n/',
  excelExportRowsLimit: 50000,
  oldTMSUrl: 'http://near-vm4dev11.net1.cec.eu.int:7001/TMS/',
  webRestrictUrl: 'TMSWebRestrict/',
  apiBaseUrl: '/Twinning/api/',
  refreshAPI: 'user/keep-application-alive',
  ecasLogin: 'https://webgate.ec.europa.eu/cas/login',
  ecasLogout : 'https://webgate.ec.europa.eu/cas/logout',
  webfolderUrl: '/Twinning/',
  environmentLabel: 'vm4dev11',
  maxFileLength: 100000000,  // 100mb
  maxVideoLength: 2000000000 // 2GB
};
