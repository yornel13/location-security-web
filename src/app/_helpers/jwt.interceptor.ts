import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from '../_services';
import {ToastrService} from 'ngx-toastr';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

    constructor(
        private authenticationService: AuthenticationService,
        private toastr: ToastrService) {}

    called = false;

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (!request.url.includes('/auth/admin')) {
            const token = this.authenticationService.getTokenSession();
            if (token) {
                request = request.clone({
                    setHeaders: {
                        'APP-TOKEN': token,
                        'Content-Type': 'application/json'
                    }
                });
                return next.handle(request);
            } else {
                // this.authenticationService.cleanStore();
                // this.showToastExpire();
                // location.reload(true);
            }
        } else {
            return next.handle(request);
        }
    }

    showToastExpire() {
        if (!this.called) {
            this.toastr.info('Sesión Finalizada', 'Error',
                { positionClass: 'toast-center-center'});
            this.called = true;
        }
    }
}
