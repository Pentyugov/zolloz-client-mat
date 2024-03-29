// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  API_URL : 'http://localhost:8080/api',
  WS_URL: 'http://localhost:8080/ws',
  uploadCarePublicKey: '0023b247fac8f6e0fb7e',

  // API_URL : 'https://zolloz.herokuapp.com/api',
  // WS_URL: 'https://zolloz.herokuapp.com/ws'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
