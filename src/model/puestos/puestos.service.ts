import {HttpClient } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import { Puesto } from './puesto';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class PuestoService {

    private PUESTO_URL = environment.BASIC_URL + '/stand';
    private TAB_URL = environment.BASIC_URL + '/tablet/';
    private GUARD_URL = environment.BASIC_URL + '/guard/';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    getAll() {
        return this.http.get(this.PUESTO_URL,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.PUESTO_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    add(puesto: Puesto) {
        return this.http.post(this.PUESTO_URL, puesto,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    set(puesto: Puesto) {
        return this.http.put(this.PUESTO_URL + '/' + puesto.id, puesto,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.PUESTO_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise()
            .then((response) => response);
    }

    deleteVehicleFromBound(id: number) {
        return this.http.delete(this.PUESTO_URL + '/vehicle/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getTabletsPuesto(id:number){
        return this.http.get(this.TAB_URL + 'stand/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getGuardiasPuesto(id:number){
        return this.http.get(this.GUARD_URL + 'stand/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    addTabletsPuesto(id:number, points:string){
        return this.http.post(this. PUESTO_URL + '/' + id + '/tablet/add', points,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    addGuardiasPuesto(id:number, points:string) {
        return this.http.post(this. PUESTO_URL + '/' + id + '/guard/add', points,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    deleteGuardiaPuesto(id:number) {
        return this.http.put(this.GUARD_URL + id + '/stand/remove',
            {},
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    deleteTabletPuesto(id:number){
        return this.http.put(this.TAB_URL + id + '/stand/remove',
            {},
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }
}
