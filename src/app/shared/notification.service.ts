import {EventEmitter, Injectable} from '@angular/core';
import {Alerta} from '../../model/alerta/alerta';
import {ChatLine} from '../../model/chat/chat.line';

@Injectable({
    providedIn: 'root',
})
export class NotificationService {
    newNotification = new EventEmitter<Alerta>();
    newMessage = new EventEmitter<ChatLine>();
}
