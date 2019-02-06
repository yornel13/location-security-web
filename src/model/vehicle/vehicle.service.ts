import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { VehicleList } from './vehicle.list';
import {Observable, of} from 'rxjs';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class VehiclesService {

    private VEHICLE_URL = environment.BASIC_URL + '/vehicle';
    private TOKEN = '01EC469EB5F64D8DA878042400D3CBA2';


    constructor (private http: HttpClient) {}

    getVehicles(): Observable<VehicleList> {
        return this.http.get<VehicleList>(this.VEHICLE_URL)
            .pipe(/*repeatWhen(() => interval(environment.MONITORING_REFRESH_INTERVAL))*/);
    }

    getVehiclesFromClaro() {
        const url =
            'http://dts.location-world.com/api/fleet/onlinedevicesinfo?token='
            + this.TOKEN
            + '&time_zone_offset=-5&culture=es';
        return this.http.get(url).toPromise()
            .then((response) => response);
    }

    getVehiclesList() {
        return this.http.get<VehicleList>(this.VEHICLE_URL).toPromise()
            .then( (response) => response);
    }

    private handleError<T> (operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {
            console.error(error);
            return of(result as T);
        };
    }

    private log(message: string) {
        console.log('VehicleService: ' + message);
    }
}
