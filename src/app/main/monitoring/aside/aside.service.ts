import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AsideService {
    marker = new EventEmitter<any>();
}