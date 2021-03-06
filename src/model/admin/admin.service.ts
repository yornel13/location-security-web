import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import {Admin} from './admin';
import {Guard} from "../guard/guard";


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class AdminService {

    private ADMIN_URL = environment.BASIC_URL + '/admin';
    constructor (private http: HttpClient) {}

    add(admin: Admin) {
        return this.http.post(this.ADMIN_URL, admin, httpOptions).toPromise()
            .then((response) => response);
    }

    set(admin: Admin) {
        return this.http.put(this.ADMIN_URL + '/' + admin.id, admin, httpOptions).toPromise()
            .then((response) => response);
    }

    activeAdmin(id: number) {
        return this.http.put(this.ADMIN_URL + '/' + id + '/active/1', httpOptions).toPromise()
            .then((response) => response);
    }

    desactiveAdmin(id: number) {
        return this.http.put(this.ADMIN_URL + '/' + id + '/active/0', httpOptions).toPromise()
            .then((response) => response);
    }

    getAll() {
        return this.http.get<Admin>(this.ADMIN_URL).toPromise()
            .then((response) => response);
    }

    getAllActive() {
        return this.http.get<Guard>(this.ADMIN_URL + '/active/1').toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.ADMIN_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.ADMIN_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

    private log(message: string) {
        console.log('GuardsService: ' + message);
    }
}
