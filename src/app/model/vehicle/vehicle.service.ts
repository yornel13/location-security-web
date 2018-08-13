import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { VehicleList } from './vehicle.list';
import { Observable, of } from 'rxjs';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class VehiclesService {

  private IMEI;
  private VEHICLE_URL = environment.BASIC_URL + '/vehicle';
  private VEHICLE_URL_IMEI = environment.BASIC_URL + '/vehicle/' + this.IMEI;

  constructor (private http: HttpClient) {}

  getVehicles(): Observable<VehicleList> {
    return this.http.get<VehicleList>(this.VEHICLE_URL);
  }

  // getVehicleByIMEI(imei){
  //     return this.http.get<Vehicle>(this.VEHICLE_URL);
  // }


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
