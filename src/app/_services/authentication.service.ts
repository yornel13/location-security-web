import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(
          private http: HttpClient,
          private route: ActivatedRoute,
          private router: Router,
          ) { }

    login(dni: string, password: string) {
        return this.http.post<any>(`${environment.BASIC_URL}/auth/admin`, { dni, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
              if(user.result != null){

                let dni:string = "";

               let httpHeaders = new HttpHeaders()
                         .set('Content-Type', 'application/json')
                         .set('APP-TOKEN', user.result);

                this.http.get(`${environment.BASIC_URL}/auth/verify`, {headers : httpHeaders})
                .pipe(
                  map(res => res) // or any other operator
                )
                .subscribe(res => {
                  localStorage.setItem('TokenUser', JSON.stringify(user.result));
                  localStorage.setItem('User', JSON.stringify(res));
                  localStorage.setItem('UserDni', JSON.stringify(res.dni));
                  console.log(localStorage.User);
                  console.log(localStorage.TokenUser);
                  localStorage
                  return res;


              });
            }));
    }


    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }


}
