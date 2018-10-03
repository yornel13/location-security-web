import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';
import {Vehiclestypes} from './vehiclestypes';

const httpOpts = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class VehiclestypesService {

    private TYPES_URL = environment.BASIC_URL + '/vehicle_type';

    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.TYPES_URL).toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.TYPES_URL + '/' + id).toPromise()
            .then((response) => response);
    }


    add(type: Vehiclestypes) {
        return this.http.post(this.TYPES_URL, type, httpOpts).toPromise()
            .then((response) => response);
    }

    set(type: Vehiclestypes) {
        return this.http.put(this.TYPES_URL + '/' + type.id, type, httpOpts).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.TYPES_URL + '/' + id).toPromise()
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
