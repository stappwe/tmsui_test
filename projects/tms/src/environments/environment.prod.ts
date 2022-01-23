// activated by running :
// npm run build -- --configuration=production
// OR
// npm run build-prod

export const environment = {
  production: true,
  version: '10.0.0',
  enableDevToolRedux: false,
  assets: './assets/i18n/',
  excelExportRowsLimit: 50000,
  oldTMSUrl: 'TMS/',
  webRestrictUrl: 'TMSWebRestrict/',
  apiBaseUrl: '/Twinning/api/',
  refreshAPI : 'user/keep-application-alive',
  ecasLogin : 'https://webgate.ec.europa.eu/cas/login',
  ecasLogout : 'https://webgate.ec.europa.eu/cas/logout',
  webfolderUrl: '/Twinning/',
  modules: {
    // CORE
    core: {
      api: {
        base: '',
      },
    },
  },
  environmentLabel: '',
  maxFileLength: 100000000,  // 100mb
  maxVideoLength: 2000000000 // 2GB
};
