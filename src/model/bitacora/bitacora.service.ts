import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import { Bitacora } from './bitacora';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class BitacoraService {

    private BITAC_URL = environment.BASIC_URL + '/binnacle';
    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.BITAC_URL).toPromise()
            .then((response) => response);
    }

    getClose() {
        return this.http.get(this.BITAC_URL+'/resolved/0').toPromise()
            .then((response) => response);
    }

    getOpen() {
        return this.http.get(this.BITAC_URL+'/resolved/1').toPromise()
            .then((response) => response);
    }

    getReopen() {
        return this.http.get(this.BITAC_URL+'/resolved/2').toPromise()
            .then((response) => response);
    }

    getOpenAll() {
        return this.http.get(this.BITAC_URL+'/open/all').toPromise()
            .then((response) => response);
    }

    getByInciden(id: number) {
        return this.http.get(this.BITAC_URL+'/incidence/'+id).toPromise()
            .then((response) => response);
    }

    getByDate(year, month, day) {
        return this.http.get(this.BITAC_URL+'/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getByGuardia(id) {
        return this.http.get(this.BITAC_URL+'/guard/'+id).toPromise()
            .then((response) => response);
    }

    getByIncidenciaDate(id, year, month, day) {
        return this.http.get(this.BITAC_URL+'/incidence/'+id+'/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getByGuardiaDate(id, year, month, day) {
        return this.http.get(this.BITAC_URL+'/guard/'+id+'/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.BITAC_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    getComentarios(id: number) {
        return this.http.get(this.BITAC_URL + '/' + id + '/replies').toPromise()
            .then((response) => response);
    }

    addCommetario(comentario: Bitacora) {
        return this.http.post(this.BITAC_URL+'-reply', comentario, httpOptions).toPromise()
            .then((response) => response);
    }

    setReopen(id: number) {
        return this.http.put(this.BITAC_URL + '/open/' + id, httpOptions).toPromise()
            .then((response) => response);
    }

    setClose(id: number) {
        return this.http.put(this.BITAC_URL + '/resolved/' + id, httpOptions).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.BITAC_URL + '/' + id).toPromise()
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
