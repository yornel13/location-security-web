import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';

const httpOpts = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class TabhistoryService {

    private TABHISTORY_URL = environment.BASIC_URL + '/tablet';

    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.TABHISTORY_URL).toPromise()
            .then((response) => response);
    }

    getImei(imei: number) {
        return this.http.get(this.TABHISTORY_URL + '/' + imei).toPromise()
            .then((response) => response);
    }

    getHistoryImei(imei: number) {
        return this.http.get(this.TABHISTORY_URL + '/history/' + imei).toPromise()
            .then((response) => response);
    }

    getHistoryImeiDate(imei, year, month, day, year1, month1, day1) {
        return this.http.get(this.TABHISTORY_URL + '/imei/' + imei+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
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
