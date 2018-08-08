import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { catchError, tap } from 'rxjs/operators';
import { VehicleList } from './vehicle.list';
import { Observable, of } from 'rxjs';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class VehiclesService {

  private VEHICLE_URL = environment.BASIC_URL + '/vehicle';
  constructor (private http: HttpClient) {}

  getVehicles(): Observable<VehicleList> {
    return this.http.get<VehicleList>(this.VEHICLE_URL).pipe(
        tap(_ => this.log(`fetched vehicles`)),
        catchError(this.handleError<VehicleList>(`VehicleList`))
    );
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
