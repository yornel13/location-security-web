import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {Admin} from '../../model/admin/admin';
import {ApiResponse} from '../../model/app.response';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private user: Admin;

    private readonly TOKEN_SESSION = 'TOKEN-SESSION';
    private readonly TOKEN_FIRE = 'TOKEN-FIRE';
    private readonly USER = 'USER-ADMIN';

    constructor(
          private http: HttpClient,
          ) { }

    public getTokenSession(): string {
        return localStorage.getItem(this.TOKEN_SESSION);
    }

    public getTokenFire(): string {
        return localStorage.getItem(this.TOKEN_FIRE);
    }

    public getUser(): Admin {
        return JSON.parse(localStorage.getItem(this.USER));
    }

    public setTokenSession(tokenSession: string): boolean {
        localStorage.setItem(this.TOKEN_SESSION, tokenSession);
        return true;
    }

    public setTokenFire(tokenFire: string): boolean {
        localStorage.setItem(this.TOKEN_FIRE, tokenFire);
        return true;
    }

    public setUser(user: string): boolean {
        localStorage.setItem(this.USER, user);
        return true;
    }

    public cleanStore(): boolean {
        localStorage.removeItem(this.TOKEN_SESSION);
        localStorage.removeItem(this.USER);
        return true;
    }

    login(dni: string, password: string) {
        return this.http.post(`${environment.BASIC_URL}/auth/admin`, {
                    dni: dni,
                    password: password
            }, httpOptions).toPromise()
            .then((response) => response);
    }

    verify(tokenSession: string) {
        const httpHeaders = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('APP-TOKEN', tokenSession);
        return this.http.get(`${environment.BASIC_URL}/auth/verify`, {headers: httpHeaders})
            .pipe(map((data: Admin) => {
                if (data !== null && data !== undefined) {
                    this.user = data;
                    this.setUser(JSON.stringify(data));
                    this.setTokenSession(tokenSession);
                }
            })).toPromise().then((response) => response);
    }

    logout() {
        console.log(this.getTokenSession());
        const httpHeaders = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('APP-TOKEN', this.getTokenSession());
        return this.http.post(`${environment.BASIC_URL}/auth/logout`, null, {headers: httpHeaders})
            .pipe(map((data: ApiResponse) => {
                console.log(data);
            })).toPromise().then((response) => response);
    }

    webRegister(tokenFire: String, tokenSession: String, adminId: number) {
        return this.http.post(`${environment.BASIC_URL}/messenger/register/web`, {
            registration_id: tokenFire,
            session: tokenSession,
            admin_id: adminId},
          httpOptions)
        .toPromise().then((response) => response);
    }
}
