import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {Grupos} from './grupos';
import {Observable, of} from 'rxjs';

const httpOpts = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class GrupoService {

    private GROUP_URL = environment.BASIC_URL + '/bounds_group';
    private BOUNDS_URL = environment.BASIC_URL + '/bounds/group/';
    private BO_URL = environment.BASIC_URL + '/bounds/';

    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.GROUP_URL).toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.GROUP_URL + '/' + id).toPromise()
            .then((response) => response);
    }


    add(grupo: Grupos) {
        return this.http.post(this.GROUP_URL, grupo, httpOpts).toPromise()
            .then((response) => response);
    }

    set(grupo: Grupos) {
        return this.http.put(this.GROUP_URL + '/' + grupo.id, grupo, httpOpts).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.GROUP_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    getCercoGrupo(id: number){
        return this.http.get(this.BOUNDS_URL+id).toPromise()
            .then((response) => response);
    }

    addCercosToGroup(id:number, cercos:string){
        return this.http.post(this.GROUP_URL + '/' + id + '/bounds/add', cercos, httpOpts).toPromise()
            .then((response) => response);
    }

    deleteCercoGrupo(id: number) {
        return this.http.put(this.BO_URL + id + '/group/remove', httpOpts).toPromise()
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
