import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {interval, Observable} from 'rxjs';
import {TabletList} from './tablet.list';
import {repeatWhen} from 'rxjs/operators';
import {AuthenticationService} from '../../app/_services';

@Injectable()
export class TabletService {

    private TABLET_URL = environment.BASIC_URL + '/tablet';

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    getTablet(): Observable<TabletList> {
        return this.http.get<TabletList>(this.TABLET_URL,
            {
                headers: this.authService.getHeader()
            })
            .pipe(/*repeatWhen(() => interval(environment.MONITORING_REFRESH_INTERVAL))*/);
    }

    getAll() {
        return this.http.get(this.TABLET_URL + '/active/all',
            {
                headers: this.authService.getHeader()
            }).toPromise()
            .then((response) => response);
    }

    setStatus(id: number, status: number) {
        return this.http.put(this.TABLET_URL + '/' + id + '/active/' + status,
            {},
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    setAlias(id: number, alias: string) {
        return this.http.put(this.TABLET_URL + '/' + id, { alias: alias},
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

    delete(id: number) {
        return this.http.delete(this.TABLET_URL + '/' + id,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }

}
