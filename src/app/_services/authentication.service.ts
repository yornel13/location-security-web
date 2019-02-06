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
    private readonly SELECTED_COMPANY_ID = 'SELECTED-COMPANY-ID';

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

    public setSelectedCompany(id: number): boolean {
        localStorage.setItem(this.SELECTED_COMPANY_ID, id + '');
        return true;
    }

    public getSelectedCompany(): number {
        const id = +localStorage.getItem(this.SELECTED_COMPANY_ID);
        return id === null ? 0 : +id;
    }

    public cleanStore(): boolean {
        localStorage.removeItem(this.TOKEN_SESSION);
        localStorage.removeItem(this.USER);
        return true;
    }

    login(dni: string, password: string) {
        return this.http.post(`${environment.BASIC_URL}/auth/admin`,
            {
                dni: dni,
                password: password
            })
            .toPromise().then((response) => response);
    }

    verify(tokenSession: string) {
        this.setTokenSession(tokenSession);
        return this.http.get(`${environment.BASIC_URL}/auth/verify`)
            .pipe(map((data: Admin) => {
                if (data !== null && data !== undefined) {
                    this.user = data;
                    this.setUser(JSON.stringify(data));
                }
            })).toPromise().then((response) => response);
    }

    logout() {
        return this.http.post(`${environment.BASIC_URL}/auth/logout`,
            null)
            .pipe(map((data: ApiResponse) => {
                console.log(data);
            })).toPromise().then((response) => response);
    }

    webRegister(tokenFire: String, tokenSession: String, adminId: number) {
        return this.http.post(`${environment.BASIC_URL}/messenger/register/web`,
            {
                registration_id: tokenFire,
                session: tokenSession,
                admin_id: adminId
            })
        .toPromise().then((response) => response);
    }

    getHeader() {
        return new HttpHeaders();
    }
}
