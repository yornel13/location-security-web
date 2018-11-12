import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Banner } from './banner';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class BannerService {

    private BANNER_URL = environment.BASIC_URL + '/banner';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    getAll() {
        return this.http.get(this.BANNER_URL,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    add(banner: Banner) {
        return this.http.post(this.BANNER_URL, banner,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.BANNER_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

}
