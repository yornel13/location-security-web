import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';

const httpOpts = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

const TOKEN = '01EC469EB5F64D8DA878042400D3CBA2';

@Injectable()
export class VehistorialService {

    private VEHISTORY_URL = environment.BASIC_URL + '/vehicle';

    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.VEHISTORY_URL).toPromise()
            .then((response) => response);
    }

    getImei(imei: number) {
        // return this.http.get(this.VEHISTORY_URL + '/' + imei).toPromise()
        //     .then((response) => response);
        return this.http.get('http://dts.location-world.com/api/Fleet/' +
            'dailyhistory?token=' + TOKEN + '&' +
            'imei=' + imei + '&' +
            'year=2018&' +
            'month=09&' +
            'day=15&' +
            'timezoneoffset=-5&culture=es').toPromise()
            .then((response) => response);
    }

    getHistoryImei(imei: string) {
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
