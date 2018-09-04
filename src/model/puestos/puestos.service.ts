import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import { Puesto } from './puesto';
import {Observable, of} from 'rxjs';

const httpOpts = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class PuestoService {

    private PUESTO_URL = environment.BASIC_URL + '/stand';
    private TAB_URL = environment.BASIC_URL + '/tablet/';
    private GUARD_URL = environment.BASIC_URL + '/guard/';

    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.PUESTO_URL).toPromise()
            .then((response) => response);
    }

    getId(id: number) {
        return this.http.get(this.PUESTO_URL + '/' + id).toPromise()
            .then((response) => response);
    }



    add(puesto: Puesto) {
        return this.http.post(this.PUESTO_URL, puesto, httpOpts).toPromise()
            .then((response) => response);
    }

    set(puesto: Puesto) {
        return this.http.put(this.PUESTO_URL + '/' + puesto.id, puesto, httpOpts).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.PUESTO_URL + '/' + id).toPromise()
            .then((response) => response);
    }

    deleteVehicleFromBound(id: number) {
        return this.http.delete(this.PUESTO_URL + '/vehicle/' + id).toPromise()
            .then((response) => response);
    }

    getTabletsPuesto(id:number){
        return this.http.get(this.TAB_URL + 'stand/' + id).toPromise()
            .then((response) => response);
    }

    getGuardiasPuesto(id:number){
        return this.http.get(this.GUARD_URL + 'stand/' + id).toPromise()
            .then((response) => response);
    }

    addTabletsPuesto(id:number, points:string){
        return this.http.post(this. PUESTO_URL + '/' + id + '/tablet/add', points, httpOpts).toPromise()
            .then((response) => response);
    }

    addGuardiasPuesto(id:number, points:string){
        return this.http.post(this. PUESTO_URL + '/' + id + '/guard/add', points, httpOpts).toPromise()
            .then((response) => response);
    }

    deleteGuardiaPuesto(id:number){
        return this.http.put(this.GUARD_URL + id + '/stand/remove', httpOpts).toPromise()
            .then((response) => response);
    }

    deleteTabletPuesto(id:number){
        return this.http.put(this.TAB_URL + id + '/stand/remove', httpOpts).toPromise()
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
