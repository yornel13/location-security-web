import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Cerco} from './cerco';
import {Observable, of} from 'rxjs';

const httpOpts = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class CercoService {

    private CERCO_URL = environment.BASIC_URL + '/bounds';

    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.CERCO_URL).toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.CERCO_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    getVehiclesInBound(id: number) {
        return this.http.get(this.CERCO_URL + '/' + id + '/vehicle').toPromise()
            .then((response) => response);
    }

    getTabletsInBound(id: number) {
        return this.http.get(this.CERCO_URL + '/' + id + '/tablet').toPromise()
            .then((response) => response);
    }

    add(cerco: Cerco) {
        return this.http.post(this.CERCO_URL, cerco, httpOpts).toPromise()
            .then((response) => response);
    }

    addVehiclesToBound(id: number, points: string) {
        return this.http.post(this.CERCO_URL + '/' + id + '/vehicle', points, httpOpts).toPromise()
            .then((response) => response);
    }

    addTabletsToBound(id: number, points: string) {
        return this.http.post(this.CERCO_URL + '/' + id + '/tablet', points, httpOpts).toPromise()
            .then((response) => response);
    }

    set(cerco: Cerco) {
        return this.http.put(this.CERCO_URL + '/' + cerco.id, cerco, httpOpts).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.CERCO_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    deleteVehicleFromBound(id: number) {
        return this.http.delete(this.CERCO_URL + '/vehicle/' + id).toPromise()
            .then((response) => response);
    }

    deleteTabletFromBound(id: number) {
        return this.http.delete(this.CERCO_URL + '/tablet/' + id).toPromise()
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
