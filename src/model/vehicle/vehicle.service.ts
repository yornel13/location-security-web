import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { VehicleList } from './vehicle.list';
import {interval, Observable, of} from 'rxjs';
import {repeatWhen} from 'rxjs/operators';
import {Vehicle} from './vehicle';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class VehiclesService {

  private VEHICLE_BOUND_URL = environment.BASIC_URL + '/bounds/' + '/vehicle/';
  private VEHICLE_URL = environment.BASIC_URL + '/vehicle';


  constructor (private http: HttpClient) {}

  getVehicles(): Observable<VehicleList> {
    return this.http.get<VehicleList>(this.VEHICLE_URL).pipe(repeatWhen(() => interval(environment.MONITORING_REFRESH_INTERVAL)));
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
