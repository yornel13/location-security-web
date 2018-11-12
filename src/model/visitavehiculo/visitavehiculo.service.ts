import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Vvehiculo } from './visitavehiculo';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class VisitaVehiculoService {

    private VEHICLE_URL = environment.BASIC_URL + '/visitor-vehicle';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    add(vehiculo: Vvehiculo) {
        return this.http.post(this.VEHICLE_URL, vehiculo,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    set(vehiculo: Vvehiculo) {
        return this.http.put(this.VEHICLE_URL + '/' + vehiculo.id, vehiculo,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getAll() {
        return this.http.get(this.VEHICLE_URL + '/active/1',
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.VEHICLE_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.VEHICLE_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }
}
