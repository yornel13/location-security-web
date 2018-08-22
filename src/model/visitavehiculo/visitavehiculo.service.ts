import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import  { Vvehiculo } from './visitavehiculo';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};
const httpOptions2 = { headers: new HttpHeaders({ 'Content-Type': 'application/json, Origin', 'Access-Control-Allow-Origin':'*' })};

@Injectable()
export class VisitaVehiculoService {

    private VEHICULO_URL = environment.BASIC_URL + '/visitor-vehicle';
    constructor (private http: HttpClient) {}

    add(vehiculo: Vvehiculo) {
        return this.http.post(this.VEHICULO_URL, vehiculo, httpOptions).toPromise()
            .then((response) => response);
    }

    set(vehiculo: Vvehiculo) {
        return this.http.put(this.VEHICULO_URL + '/' + vehiculo.id, vehiculo, httpOptions).toPromise()
            .then((response) => response);
    }

    getAll() {
        return this.http.get(this.VEHICULO_URL+'/active/1').toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.VEHICULO_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.VEHICULO_URL + '/' + id).toPromise()
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
