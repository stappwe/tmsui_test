// activated by running :
// npm run build -- --configuration=dev
// OR
// npm run build-dev

export const environment = {
  production: true,
  version: '10.0.0',
  enableDevToolRedux: true,
  assets: './assets/i18n/',
  excelExportRowsLimit : 50000,
  oldTMSUrl: 'TMS/',
  webRestrictUrl: 'TMSWebRestrict/',
  apiBaseUrl: '/backend/Twinning/api/',
  refreshAPI: 'user/keep-application-alive',
  ecasLogin : 'https://webgate.ec.europa.eu/cas/login',
  webfolderUrl: 'https://webgate.acceptance.ec.europa.eu/Twinning/',
  ecasLogout : 'https://webgate.ec.europa.eu/cas/logout',
  environmentLabel: 'MockUp',
  maxFileLength: 100000000,  // 100mb
  maxVideoLength: 2000000000 // 2GB
};
