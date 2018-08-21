import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import {WatchList} from './watch.list';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class WatchesService {

    private WATCH_URL = environment.BASIC_URL + '/watch';
    private activePath = '/active/1';
    constructor (private http: HttpClient) {}

    getWatchesActive(): Observable<WatchList> {
        return this.http.get<WatchList>(this.WATCH_URL + this.activePath);
    }

    getAll() {
        return this.http.get(this.WATCH_URL).toPromise()
            .then((response) => response);
    }

    getByGuard(id) {
        return this.http.get(this.WATCH_URL + '/guard/' + id).toPromise()
            .then((response) => response);
    }

    getByDate(year, month, day) {
        return this.http.get(this.WATCH_URL + '/date/' + year + '/' + month + '/' + day).toPromise()
            .then((response) => response);
    }

    getByGuardDate(id, year, month, day) {
        return this.http.get(this.WATCH_URL + '/guard/' + id +'/date/' + year + '/' + month + '/' + day).toPromise()
            .then((response) => response);
    }

    getById(id){
        return this.http.get(this.WATCH_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

    private log(message: string) {
        console.log('WatchesService: ' + message);
    }
}
