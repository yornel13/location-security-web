import {EventEmitter, Injectable} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import { Alerta } from './alerta';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class AlertaService {

    private ALERT_URL = environment.BASIC_URL + '/alert';
    constructor (private http: HttpClient) {}


    set(alerta: Alerta) {
        return this.http.put(this.ALERT_URL + '/' + alerta.id, alerta, httpOptions).toPromise()
            .then((response) => response);
    }

    solveAlert(id: number) {
        return this.http.put(this.ALERT_URL + '/' + id , httpOptions).toPromise()
            .then((response) => response);
    }

    getAll() {
        return this.http.get(this.ALERT_URL).toPromise()
            .then((response) => response);
    }

    getByCause(cuase:string) {
        return this.http.get(this.ALERT_URL + '/cause/' + cuase).toPromise()
            .then((response) => response);
    }

    getByGuard(id:number) {
        return this.http.get(this.ALERT_URL + '/cause/all/guard/' + id + '/date/').toPromise()
            .then((response) => response);
    }

    getByGuardCause(id, cause) {
        return this.http.get(this.ALERT_URL + '/cause/' + cause + '/guard/' + id ).toPromise()
            .then((response) => response);
    }

    getByCauseDate(causa, year, month, day) {
        return this.http.get(this.ALERT_URL + '/cause/'+ causa +'/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getByGuardDate(id, year, month, day) {
        return this.http.get(this.ALERT_URL + '/cause/all/guard/' + id + '/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getByGuardCaseDate(id, cause, year, month, day) {
        return this.http.get(this.ALERT_URL + '/cause/'+cause+'/guard/' + id + '/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.ALERT_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.ALERT_URL + '/' + id).toPromise()
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
