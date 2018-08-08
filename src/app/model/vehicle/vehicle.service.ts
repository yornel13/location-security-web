import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, tap } from 'rxjs/operators';
import { VehicleList } from './vehicle.list';
import { Observable, of } from 'rxjs/index';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class WatchesService {

  private watchesUrl = 'http://icsseseguridad.com/location-security/public/watch';
  private activePath = '/active/1';
  constructor (private http: HttpClient) {}

  getActiveWatches(): Observable<VehicleList> {
    return this.http.get<VehicleList>(this.watchesUrl + this.activePath).pipe(
        tap(_ => this.log(`fetched watches`)),
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
