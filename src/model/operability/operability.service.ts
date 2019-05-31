import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import {AuthenticationService} from '../../app/_services';

@Injectable()
export class OperabilityService {

    private OPERABILITY_URL = environment.BASIC_URL + '/operability';

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService) {}

    getAll() {
        return this.http.get(this.OPERABILITY_URL).toPromise()
            .then((response) => response);
    }

    start(imei: string) {
        return this.http.put(this.OPERABILITY_URL + '/start/' + imei, {},
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    stop(imei: string) {
        return this.http.put(this.OPERABILITY_URL + '/stop/' + imei, {},
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    set(operability: any) {
        return this.http.put(this.OPERABILITY_URL + '/' + operability.imei, operability,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getHours(list, year, month, day, year1, month1, day1) {
        return this.http.post(this.OPERABILITY_URL
            + '/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1, list,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }
}
