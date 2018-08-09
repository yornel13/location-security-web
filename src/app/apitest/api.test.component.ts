// import { Component, OnInit } from '@angular/core';
// import {Guard} from '../model/guard/guard';
// import {GuardService} from '../model/guard/guard.service';
// import {ApiResponse} from '../model/app.response';
//
// @Component({
//   selector: 'app-api.test',
//   templateUrl: './api.test.component.html',
//   styleUrls: ['./api.test.component.css']
// })
// export class ApiTestComponent {
//
//     guard: Guard = { id: 8, dni: '2035684189', name: 'Jane', lastname: 'Keyner Jose', email: 'jane@gmail.com', password: '1234' };
//     constructor(private guardService: GuardService) { }
//     saveUser() {
//         this.guardService.delete(8).then(
//             success => {
//                 console.log('success', success );
//             }, error => {
//                 if (error.status === 422) {
//                     this.onSaveError(error.error);
//                 } else {
//                     this.onGeneralError(error);
//                 }
//             }
//         );
//     }
//     onSaveError(error: ApiResponse) {
//         console.log(error.message);
//         const err = error.errors;
//         Object.entries(err).forEach(
//             ([key, value]) => console.log(key, value)
//         );
//     }
//     onGeneralError(error: any) {
//         // should show dialog error
//         console.log(error.message);
//     }
//
// }
