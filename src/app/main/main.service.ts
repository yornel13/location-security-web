import {EventEmitter, Injectable} from '@angular/core';
import {Alerta} from '../../model/alerta/alerta';

@Injectable({
    providedIn: 'root',
})
export class MainService {

    alerts: Alerta[] = [];
    alerts0: Alerta[] = [];
    alerts1: Alerta[] = [];

    marker = new EventEmitter<any>();
    alertsEmitter = new EventEmitter<Alerta[]>();
    alerts0Emitter = new EventEmitter<Alerta[]>();
    alerts1Emitter = new EventEmitter<Alerta[]>();
}
