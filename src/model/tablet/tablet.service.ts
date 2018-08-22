import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {interval, Observable, of} from 'rxjs';
import {Tablet} from './tablet';
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
