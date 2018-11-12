import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import {Admin} from './admin';
import {Guard} from '../guard/guard';
import {AuthenticationService} from '../../app/_services';

@Injectable({ providedIn: 'root' })
export class AdminService {

    private ADMIN_URL = environment.BASIC_URL + '/admin';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    add(admin: Admin) {
        return this.http.post(this.ADMIN_URL, admin,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    set(admin: Admin) {
        return this.http.put(this.ADMIN_URL + '/' + admin.id, admin,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    activeAdmin(id: number) {
        return this.http.put(this.ADMIN_URL + '/' + id + '/active/1',
            {},
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    desactiveAdmin(id: number) {
        return this.http.put(this.ADMIN_URL + '/' + id + '/active/0',
            {},
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getAll() {
        return this.http.get<Admin>(this.ADMIN_URL,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getAllActive() {
        return this.http.get<Guard>(this.ADMIN_URL + '/active/1',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.ADMIN_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.ADMIN_URL + '/' + id)
            .toPromise().then((response) => response);
    }
}
