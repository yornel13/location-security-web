import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import { Visitantes } from './visitantes';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class VisitanteService {

    private VISIT_URL = environment.BASIC_URL + '/visitor';
    constructor (private http: HttpClient) {}

    add(visitantes: Visitantes) {
        return this.http.post(this.VISIT_URL, visitantes, httpOptions).toPromise()
            .then((response) => response);
    }

    set(visitantes: Visitantes) {
        return this.http.put(this.VISIT_URL + '/' + visitantes.id, visitantes, httpOptions).toPromise()
            .then((response) => response);
    }

    getAll() {
        return this.http.get<Visitantes>(this.VISIT_URL+'/active/1').toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.VISIT_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.VISIT_URL + '/' + id).toPromise()
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
