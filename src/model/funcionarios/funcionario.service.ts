import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import { Funcionario } from './funcionario';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class FuncionarioService {

    private FUN_URL = environment.BASIC_URL + '/clerk';
    constructor (private http: HttpClient) {}

    add(funcionario: Funcionario) {
        return this.http.post(this.FUN_URL, funcionario, httpOptions).toPromise()
            .then((response) => response);
    }

    set(funcionario: Funcionario) {
        return this.http.put(this.FUN_URL + '/' + funcionario.id, funcionario, httpOptions).toPromise()
            .then((response) => response);
    }

    getAll() {
        return this.http.get<Funcionario>(this.FUN_URL+'/active/1').toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.FUN_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.FUN_URL + '/' + id).toPromise()
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
