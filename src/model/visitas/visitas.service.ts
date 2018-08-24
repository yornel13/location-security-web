import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
//import {Admin} from './admin';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class VisitasService {

    private VISIT_URL = environment.BASIC_URL + '/visit';
    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.VISIT_URL+'/status/all').toPromise()
            .then((response) => response);
    }

    getByDate(year, month, day, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getByGuard(id, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status + '/guard/' + id).toPromise()
            .then((response) => response);
    }

    getByGuardDate(id, year, month, day, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/guard/'+id+'/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getByVehiculo(id, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status + '/vehicle/' + id).toPromise()
            .then((response) => response);
    }

    getByVehiculoDate(id, year, month, day, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/vehicle/'+id+'/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getByVisitante(id, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status + '/visitor/' + id).toPromise()
            .then((response) => response);
    }

    getByVisitanteDate(id, year, month, day, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/visitor/'+id+'/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getByFuncionario(id, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status + '/clerk/' + id).toPromise()
            .then((response) => response);
    }

    getByFuncionarioDate(id, year, month, day, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/clerk/'+id+'/date/'+year+'/'+month+'/'+day).toPromise()
            .then((response) => response);
    }

    getActive() {
        return this.http.get(this.VISIT_URL+'/status/1').toPromise()
            .then((response) => response);
    }

    getAllActive() {
        return this.http.get(this.VISIT_URL+'/active/1').toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.VISIT_URL + '/' + id).toPromise()
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
