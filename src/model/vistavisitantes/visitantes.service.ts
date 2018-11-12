import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Visitantes } from './visitantes';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class VisitanteService {

    private VISIT_URL = environment.BASIC_URL + '/visitor';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    add(visitantes: Visitantes) {
        return this.http.post(this.VISIT_URL, visitantes,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    set(visitantes: Visitantes) {
        return this.http.put(this.VISIT_URL + '/' + visitantes.id, visitantes,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getAll() {
        return this.http.get<Visitantes>(this.VISIT_URL + '/active/1',
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.VISIT_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.VISIT_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }
}
