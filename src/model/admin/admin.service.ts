import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import {Admin} from './admin';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class GuardService {

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

    getAll() {
        return this.http.get<Admin>(this.ADMIN_URL).toPromise()
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
