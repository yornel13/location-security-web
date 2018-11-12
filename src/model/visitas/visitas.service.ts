import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class VisitasService {

    private VISIT_URL = environment.BASIC_URL + '/visit';

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService) {}

    getAll() {
        return this.http.get(this.VISIT_URL+'/status/all',
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getByDate(year, month, day, status, year1, month1, day1) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getByGuard(id, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status + '/guard/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getByGuardDate(id, year, month, day, status, year1, month1, day1) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/guard/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getByVehiculo(id, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status + '/vehicle/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getByVehiculoDate(id, year, month, day, status, year1, month1, day1) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/vehicle/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getByVisitante(id, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status + '/visitor/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getByVisitanteDate(id, year, month, day, status, year1, month1, day1) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/visitor/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getByFuncionario(id, status) {
        return this.http.get(this.VISIT_URL+'/status/'+status + '/clerk/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getByFuncionarioDate(id, year, month, day, status, year1, month1, day1) {
        return this.http.get(this.VISIT_URL+'/status/'+status+'/clerk/'+id+'/date/'+year+'/'+month+'/'+day+'/to/'+year1+'/'+month1+'/'+day1,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getActive() {
        return this.http.get(this.VISIT_URL+'/status/1',
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getAllActive() {
        return this.http.get(this.VISIT_URL+'/active/1',
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
}
