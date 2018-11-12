import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Configuracion } from './configuracion';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class ConfiguracionService {

    private CONFIG_URL = environment.BASIC_URL + '/utility';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    add(config: Configuracion) {
        return this.http.post(this.CONFIG_URL, config,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    set(config: Configuracion) {
        return this.http.put(this.CONFIG_URL + '/' + config.id, config,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getAll() {
        return this.http.get<Configuracion>(this.CONFIG_URL,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getTablet() {
        return this.http.get(this.CONFIG_URL + '/name/TABLET_GPS_UPDATE',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.CONFIG_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.CONFIG_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }
}
