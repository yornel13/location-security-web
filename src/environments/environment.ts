// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  BASIC_URL: 'http://icsseseguridad.com/location-security/public',
  firebase: {
    apiKey: 'AIzaSyAo1TwJI_rVFArz9GO4QdFsKy5NVpZDRNA',
    authDomain: 'testchat-54a32.firebaseapp.com',
    databaseURL: 'https://testchat-54a32.firebaseio.com/',
    projectId: 'testchat-54a32',
    storageBucket: 'testchat-54a32.appspot.com',
    messagingSenderId: '976182334043'
  },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
