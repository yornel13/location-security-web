import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import {Guard} from './guard';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class GuardService {

    private GUARD_URL = environment.BASIC_URL + '/guard';

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService) {}

    add(guard: Guard) {
        return this.http.post(this.GUARD_URL, guard,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    set(guard: Guard) {
        return this.http.put(this.GUARD_URL + '/' + guard.id, guard,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    activeGuard(id: number) {
        return this.http.put(this.GUARD_URL + '/' + id + '/active/1',
            {},
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    desactiveGuard(id: number) {
        return this.http.put(this.GUARD_URL + '/' + id + '/active/0',
            {},
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getAll() {
        return this.http.get<Guard>(this.GUARD_URL,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getAllActive() {
        return this.http.get<Guard>(this.GUARD_URL + '/active/1',
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.GUARD_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.GUARD_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }
}
