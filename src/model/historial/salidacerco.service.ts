import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';

const httpOpts = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class SalidascercoService {

    private SALIDA_URL = environment.BASIC_URL + '/alert/out/bounds';

    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.SALIDA_URL).toPromise()
            .then((response) => response);
    }

    getImei(imei: number) {
        return this.http.get(this.SALIDA_URL + '/imei/' + imei).toPromise()
            .then((response) => response);
    }

    getSalidasDate(year, month, day, year1, mont1, day1) {
        return this.http.get(this.SALIDA_URL + '/date' +'/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+mont1+'/'+day1).toPromise()
            .then((response) => response);
    }

    getSalidasImeiDate(imei, year, month, day, year1, mont1, day1) {
        return this.http.get(this.SALIDA_URL + '/imei/' + imei +'/date' +'/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+mont1+'/'+day1).toPromise()
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
