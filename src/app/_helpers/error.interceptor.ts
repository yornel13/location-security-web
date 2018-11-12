import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService,
        private toastr: ToastrService) {}

    called = false;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                this.authenticationService.cleanStore();
                this.showToastExpire();
                location.reload(true);
            } else {
                return next.handle(request);
            }
            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }

    showToastExpire() {
        if (!this.called) {
            this.toastr.warning('Tu sesión ha expirado', 'Error',
                { positionClass: 'toast-center-center'});
        }
        this.called = true;
    }
}
