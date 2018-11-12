import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Incidencia } from './incidencia';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class IncidenciasService {

    private INCID_URL = environment.BASIC_URL + '/incidence';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    add(incidencia: Incidencia) {
        return this.http.post(this.INCID_URL, incidencia,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    set(incidencia: Incidencia) {
        return this.http.put(this.INCID_URL + '/' + incidencia.id,
            incidencia,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getAll() {
        return this.http.get<Incidencia>(this.INCID_URL,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.INCID_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.INCID_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }
}
