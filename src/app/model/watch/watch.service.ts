import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs/index';
import {WatchList} from './watch.list';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class WatchesService {

    private WATCH_URL = environment.BASIC_URL + '/watch';
    private activePath = '/active/1';
    constructor (private http: HttpClient) {}

    getActiveWatches(): Observable<WatchList> {
        return this.http.get<WatchList>(this.WATCH_URL + this.activePath).pipe(
            tap(_ => this.log(`fetched watches`)),
            catchError(this.handleError<WatchList>(`WatchList`))
        );
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
