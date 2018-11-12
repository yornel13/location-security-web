import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Observable, of} from 'rxjs';
import {Vehiclestypes} from './vehiclestypes';
import {AuthenticationService} from "../../app/_services";

@Injectable()
export class VehiclestypesService {

    private TYPES_URL = environment.BASIC_URL + '/vehicle_type';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    getAll() {
        return this.http.get(this.TYPES_URL,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.TYPES_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }


    add(type: Vehiclestypes) {
        return this.http.post(this.TYPES_URL, type,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    set(type: Vehiclestypes) {
        return this.http.put(this.TYPES_URL + '/' + type.id, type,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.TYPES_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }
}
