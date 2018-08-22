import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

import { Observable, of } from 'rxjs';
import { Banner } from './banner';


const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable()
export class BannerService {

    private BANNER_URL = environment.BASIC_URL + '/banner';
    constructor (private http: HttpClient) {}

    getAll() {
        return this.http.get(this.BANNER_URL).toPromise()
            .then((response) => response);
    }

    add(banner: Banner) {
        return this.http.post(this.BANNER_URL, banner, httpOptions).toPromise()
            .then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.BANNER_URL + '/' + id).toPromise()
            .then((response) => response);
    }

}
