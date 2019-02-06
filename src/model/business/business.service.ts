import {HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class BusinessService {

    private BUSINESS_URL = environment.BASIC_URL + '/business';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    getAll() {
        return this.http.get(this.BUSINESS_URL,
            {
                headers: this.authService.getHeader()
            })
            .toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.BUSINESS_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise()
            .then((response) => response);
    }

    add(business: any) {
        return this.http.post(this.BUSINESS_URL, business,
            {
                headers: this.authService.getHeader()
            })
            .toPromise()
            .then((response) => response);
    }

    set(business: any) {
        return this.http.put(this.BUSINESS_URL + '/' + business.id, business,
            {
                headers: this.authService.getHeader()
            })
            .toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.BUSINESS_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise()
            .then((response) => response);
    }
}
