import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Bitacora } from './bitacora';
import {ApiResponse} from '../app.response';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class BitacoraService {

    private BINNACLE_URL = environment.BASIC_URL + '/binnacle';
    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    getAll() {
        return this.http.get(this.BINNACLE_URL + '/resolved/all',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getAllToday() {
        return this.http.get(this.BINNACLE_URL + '/resolved/all/date',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getOpen() {
        return this.http.get(this.BINNACLE_URL + '/resolved/1',
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    getReopen() {
        return this.http.get(this.BINNACLE_URL + '/resolved/2',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByDate(year, month, day, year1, month1, day1) {
        return this.http.get(this.BINNACLE_URL + '/resolved/all'
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getAllUnreadReplies() {
        return this.http.get(this.BINNACLE_URL + '-reply/admin/comment/unread',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getAllUnreadReports() {
        return this.http.get(this.BINNACLE_URL + '-reply/admin/comment/unread/full',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    putReportRead(id) {
        return this.http.put<ApiResponse>(`${this.BINNACLE_URL}-reply/admin/report/` + id + `/read`,
            {},
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

// ------------------------ Status en Incidencia ------------------------------------------------------

    getOpenDate(year, month, day, year1, month1, day1) {
        return this.http.get(this.BINNACLE_URL + '/resolved/open'
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getCloseDate(year, month, day, year1, month1, day1) {
        return this.http.get(this.BINNACLE_URL + '/resolved/0'
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getOpenAll() {
        return this.http.get(this.BINNACLE_URL + '/resolved/open',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getCloseAll() {
        return this.http.get(this.BINNACLE_URL + '/resolved/0',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByIncidenAll(id: number) {
        return this.http.get(this.BINNACLE_URL + '/resolved/all/incidence/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByIncidenciaOpen(id: number) {
        return this.http.get(this.BINNACLE_URL + '/resolved/open/incidence/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByIncidenciaClose(id: number) {
        return this.http.get(this.BINNACLE_URL + '/resolved/0/incidence/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByIncidenciaDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BINNACLE_URL + '/resolved/all/incidence/' + id
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByIncidenciaOpenDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BINNACLE_URL + '/resolved/open/incidence/' + id
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByIncidenciaCloseDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BINNACLE_URL + '/resolved/0/incidence/' + id
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    /**************** Status en Guardia ***********************/

    getByGuardiaAll(id) {
        return this.http.get(this.BINNACLE_URL + '/resolved/all/guard/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByGuardiaDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BINNACLE_URL + '/resolved/all/guard/' + id
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByGuardiaOpen(id: number) {
        return this.http.get(this.BINNACLE_URL + '/resolved/open/guard/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByGuardiaOpenDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BINNACLE_URL + '/resolved/open/guard/' + id
            + '/date/' + year + '/' + month + '/' + day
            + '/to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByGuardiaClose(id: number) {
        return this.http.get(this.BINNACLE_URL + '/resolved/0/guard/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getByGuardiaCloseDate(id, year, month, day, year1, month1, day1) {
        return this.http.get(this.BINNACLE_URL + '/resolved/0/guard/' + id
            + '/date/' + year + '/' + month + '/' + day
            + ' /to/' + year1 + '/' + month1 + '/' + day1,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }


// -------------------------------------------------------------------------------------
    getId(id: number) {
        return this.http.get(this.BINNACLE_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    getComentarios(id: number) {
        return this.http.get(this.BINNACLE_URL + '/' + id + '/replies',
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    addCommetario(comentario: Bitacora) {
        console.log(comentario);
        return this.http.post(this.BINNACLE_URL + '-reply', comentario,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    setReopen(id: number) {
        return this.http.put(this.BINNACLE_URL + '/open/' + id,
            {},
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    setClose(id: number) {
        return this.http.put(this.BINNACLE_URL + '/resolved/' + id,
            {},
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.BINNACLE_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }
}
