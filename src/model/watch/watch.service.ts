import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class WatchesService {

    private WATCH_URL = environment.BASIC_URL + '/watch';


    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    getAll() {
        return this.http.get(this.WATCH_URL,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getActive() {
        return this.http.get(this.WATCH_URL + '/active/1',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getActiveByGuard(id) {
        return this.http.get(this.WATCH_URL + '/guard/' + id + '/active/1',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByGuard(id) {
        return this.http.get(this.WATCH_URL + '/guard/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByDate(year, month, day, year1, month1, day1) {
        return this.http.get(this.WATCH_URL
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByGuardDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.WATCH_URL + '/guard/' + id
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByStandDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.WATCH_URL + '/stand/' + id
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getById(id) {
        return this.http.get(this.WATCH_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }
}
