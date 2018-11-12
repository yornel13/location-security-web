import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Funcionario } from './funcionario';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class FuncionarioService {

    private FUN_URL = environment.BASIC_URL + '/clerk';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    add(funcionario: Funcionario) {
        return this.http.post(this.FUN_URL, funcionario,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    set(funcionario: Funcionario) {
        return this.http.put(this.FUN_URL + '/' + funcionario.id, funcionario,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getAll() {
        return this.http.get<Funcionario>(this.FUN_URL + '/active/1',
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.FUN_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.FUN_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }
}
