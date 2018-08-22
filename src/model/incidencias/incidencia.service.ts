import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import { Incidencia } from './incidencia';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class IncidenciasService {

    private INCID_URL = environment.BASIC_URL + '/incidence';
    constructor (private http: HttpClient) {}

    add(incidencia: Incidencia) {
        return this.http.post(this.INCID_URL, incidencia, httpOptions).toPromise()
            .then((response) => response);
    }

    set(incidencia: Incidencia) {
        return this.http.put(this.INCID_URL + '/' + incidencia.id, incidencia, httpOptions).toPromise()
            .then((response) => response);
    }

    getAll() {
        return this.http.get<Incidencia>(this.INCID_URL).toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.INCID_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.INCID_URL + '/' + id).toPromise()
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
