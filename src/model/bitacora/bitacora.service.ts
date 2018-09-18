import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import { Bitacora } from './bitacora';
import {ApiResponse} from "../app.response";


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class BitacoraService {

    private BITAC_URL = environment.BASIC_URL + '/binnacle';
    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.BITAC_URL+'/resolved/all').toPromise()
            .then((response) => response);
    }

    getAllToday() {
        return this.http.get(this.BITAC_URL+'/resolved/all/date').toPromise()
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

    getByDate(year, month, day, year1, month1, day1) {
        return this.http.get(this.BITAC_URL+'/resolved/all/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
            .then((response) => response);
    }

    getAllUnreadReplies() {
        return this.http.get(this.BITAC_URL + '-reply/admin/comment/unread').toPromise()
          .then((response) => response);
    }

    getAllUnreadReports() {
        return this.http.get(this.BITAC_URL + '-reply/admin/comment/unread/full').toPromise()
            .then((response) => response);
    }

    putReportRead(id) {
        return this.http.put<ApiResponse>(`${this.BITAC_URL}-reply/admin/report/` + id + `/read`,
            httpOptions).toPromise().then((response) => response);
    }

// ------------------------ Status en Incidencia ------------------------------------------------------

    getOpenDate(year, month, day, year1, month1, day1) {
        return this.http.get(this.BITAC_URL+'/resolved/open/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
            .then((response) => response);
    }

    getCloseDate(year, month, day, year1, month1, day1) {
        return this.http.get(this.BITAC_URL+'/resolved/0/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
            .then((response) => response);
    }

    getOpenAll() {
        return this.http.get(this.BITAC_URL+'/resolved/open').toPromise()
            .then((response) => response);
    }

    getCloseAll() {
        return this.http.get(this.BITAC_URL+'/resolved/0').toPromise()
            .then((response) => response);
    }

    getByIncidenAll(id: number) {
        return this.http.get(this.BITAC_URL+'/resolved/all/incidence/'+id).toPromise()
            .then((response) => response);
    }

    getByIncidenciaOpen(id: number) {
        return this.http.get(this.BITAC_URL+'/resolved/open/incidence/'+id).toPromise()
            .then((response) => response);
    }

    getByIncidenciaClose(id: number) {
        return this.http.get(this.BITAC_URL+'/resolved/0/incidence/'+id).toPromise()
            .then((response) => response);
    }

    getByIncidenciaDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BITAC_URL+'/resolved/all/incidence/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
            .then((response) => response);
    }

    getByIncidenciaOpenDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BITAC_URL+'/resolved/open/incidence/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
            .then((response) => response);
    }

    getByIncidenciaCloseDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BITAC_URL+'/resolved/0/incidence/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
            .then((response) => response);
    }

// ----------------------- Status en Guardia

    getByGuardiaAll(id) {
        return this.http.get(this.BITAC_URL+'/resolved/all/guard/'+id).toPromise()
            .then((response) => response);
    }

    getByGuardiaDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BITAC_URL+'/resolved/all/guard/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
            .then((response) => response);
    }

    getByGuardiaOpen(id: number) {
        return this.http.get(this.BITAC_URL+'/resolved/open/guard/'+id).toPromise()
            .then((response) => response);
    }

    getByGuardiaOpenDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BITAC_URL+'/resolved/open/guard/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
            .then((response) => response);
    }

    getByGuardiaClose(id: number) {
        return this.http.get(this.BITAC_URL+'/resolved/0/guard/'+id).toPromise()
            .then((response) => response);
    }

    getByGuardiaCloseDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BITAC_URL+'/resolved/0/guard/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1).toPromise()
            .then((response) => response);
    }


// -------------------------------------------------------------------------------------
    getId(id: number) {
        return this.http.get(this.BITAC_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    getComentarios(id: number) {
        return this.http.get(this.BITAC_URL + '/' + id + '/replies').toPromise()
            .then((response) => response);
    }

    addCommetario(comentario: Bitacora) {
        console.log(comentario);
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
