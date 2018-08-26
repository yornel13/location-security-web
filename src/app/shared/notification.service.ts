import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    newNotification = new EventEmitter<any>();
}
