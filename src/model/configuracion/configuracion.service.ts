import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import { Configuracion } from './configuracion';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class ConfiguracionService {

    private CONFIG_URL = environment.BASIC_URL + '/utility';
    constructor (private http: HttpClient) {}

    add(config: Configuracion) {
        return this.http.post(this.CONFIG_URL, config, httpOptions).toPromise()
            .then((response) => response);
    }

    set(config: Configuracion) {
        return this.http.put(this.CONFIG_URL + '/' + config.id, config, httpOptions).toPromise()
            .then((response) => response);
    }

    getAll() {
        return this.http.get<Configuracion>(this.CONFIG_URL).toPromise()
            .then((response) => response);
    }

    getTablet(){
        return this.http.get(this.CONFIG_URL + '/name/TABLET_GPS_UPDATE').toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.CONFIG_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.CONFIG_URL + '/' + id).toPromise()
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
