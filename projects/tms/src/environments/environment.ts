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
  // apiBaseUrl: 'http://localhost:3005/api/Twinning/api/',
  refreshAPI: 'user/keep-application-alive',
  ecasLogin : 'https://webgate.ec.europa.eu/cas/login',
  ecasLogout : 'https://webgate.ec.europa.eu/cas/logout',
  webfolderUrl: '',
  environmentLabel: '',
  maxFileLength: 100000000,  // 100mb
  maxVideoLength: 2000000000 // 2GB
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
