import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import {Guard} from './guard';
import {VehicleList} from '../vehicle/vehicle.list';
import {GuardList} from './guard.list';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class GuardService {

    private GUARD_URL = environment.BASIC_URL + '/guard';
    constructor (private http: HttpClient) {}

    add(guard: Guard) {
        return this.http.post(this.GUARD_URL, guard, httpOptions).toPromise()
            .then((response) => response);
    }

    set(guard: Guard) {
        return this.http.put(this.GUARD_URL + '/' + guard.id, guard, httpOptions).toPromise()
            .then((response) => response);
    }

    activeGuard(id: number) {
        return this.http.put(this.GUARD_URL + '/' + id + '/active/1', httpOptions).toPromise()
            .then((response) => response);
    }

    desactiveGuard(id: number) {
        return this.http.put(this.GUARD_URL + '/' + id + '/active/0', httpOptions).toPromise()
            .then((response) => response);
    }

    getAll() {
        return this.http.get<Guard>(this.GUARD_URL).toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.GUARD_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.GUARD_URL + '/' + id).toPromise()
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
