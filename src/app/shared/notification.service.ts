import {EventEmitter, Injectable} from '@angular/core';
import {Alerta} from '../../model/alerta/alerta';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    newNotification = new EventEmitter<Alerta>();
}
