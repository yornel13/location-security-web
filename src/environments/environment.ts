// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
    BASIC_URL: 'http://icsseseguridad.com/location-security/public',
    firebase: {
      apiKey: 'AIzaSyAzFM4z3GoUE3pFiwpcUBSMm-6PxMNxxaQ',
      authDomain: 'icsseseguridad-6f751.firebaseapp.com',
      databaseURL: 'https://icsseseguridad-6f751.firebaseio.com',
      projectId: 'icsseseguridad-6f751',
      storageBucket: 'icsseseguridad-6f751.appspot.com',
      messagingSenderId: '962881875237'
    },
    google_map_api_key : {
        apiKey: 'AIzaSyA24mC9OAkD08aAkO_UADkSOSxaCKUZFBQ'
    },
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
