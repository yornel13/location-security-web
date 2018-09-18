import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {interval, Observable, of} from 'rxjs';
import {TabletList} from './tablet.list';
import {repeatWhen} from 'rxjs/operators';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};


@Injectable()
export class TabletService {
    private TABLET_URL = environment.BASIC_URL + '/tablet';

    constructor (private http: HttpClient) {}

    getTablet(): Observable<TabletList> {
        return this.http.get<TabletList>(this.TABLET_URL).pipe(repeatWhen(() => interval(10000)));
    }

    getAll() {
        return this.http.get(this.TABLET_URL + '/active/all').toPromise()
            .then((response) => response);
    }

    setStatus(id: number, status: number) {
        return this.http.put(this.TABLET_URL + '/' + id + '/active/' + status, httpOptions).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.TABLET_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

    private log(message: string) {
        console.log('TabletService: ' + message);
    }

}
