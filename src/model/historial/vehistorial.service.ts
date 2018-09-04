import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';

const httpOpts = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class VehistorialService {

    private VEHISTORY_URL = environment.BASIC_URL + '/vehicle';

    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.VEHISTORY_URL).toPromise()
            .then((response) => response);
    }

    getImei(imei: number) {
        return this.http.get(this.VEHISTORY_URL + '/' + imei).toPromise()
            .then((response) => response);
    }

    getHistoryImei(imei: number) {
        return this.http.get(this.VEHISTORY_URL + '/history/' + imei).toPromise()
            .then((response) => response);
    }

    getHistoryImeiDate(imei, year, month, day) {
        return this.http.get(this.VEHISTORY_URL + '/history/' + imei+'/'+year+'/'+month+'/'+day).toPromise()
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
