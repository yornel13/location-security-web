
import {EventEmitter, Injectable, OnInit} from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import {AuthenticationService, ChatService} from '../_services';
import {NotificationService} from './notification.service';
import {ChatLine} from '../../model/chat/chat.line';
import {BitacoraService} from '../../model/bitacora/bitacora.service';

@Injectable()
export class MessagingService {

    isMessengerOpen = false;
    messaging = firebase.messaging();
    currentMessage = new BehaviorSubject(null);

    private error: any;
    private loading: boolean;
    unread: number;
    guardUnread: number;
    adminUnread: number;
    channelUnread = 0;
    guardChatUnread: any[] = [];
    adminChatUnread: any[] = [];
    unreadEmitter = new EventEmitter<any>();

    repliesUnread: number;
    repliesUnreadEmitter = new EventEmitter<any>();
    private audio;

    constructor(
        private notificationService: NotificationService,
        private authService: AuthenticationService,
        private afDB: AngularFireDatabase,
        private afAuth: AngularFireAuth,
        private chatService: ChatService,
        private binnacleService: BitacoraService) {
    }

  /**
   * update token in firebase database
   *
   * @param userId userId as a key
   * @param token token as a value
   */
    updateToken(userId, token) {
      this.afAuth.authState.pipe(take(1)).subscribe(() => {
        const data = new Object;
        data[userId] = token;
        this.afDB.object('fcmTokens/').update(data).then();
      });
    }

    /**
     * request permission for notification from firebase cloud messaging
     *
     * @param userId userId
     */
    requestPermission(userId) {
        this.messaging.requestPermission()
            .then(() => {
                console.log('notification permission granted.');
                console.log(firebase.messaging().getToken());
                return firebase.messaging().getToken();
            })
            .then(token => {
                console.log(token);
                this.authService.setTokenFire(token);
                this.authService.webRegister(token, this.authService.getTokenSession(), this.authService.getUser().id)
                      .then(success => {
                    console.log(success);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
            })
            .catch((err) => {
              console.log('Unable to get permission to notify.', err);
        });
    }

    /**
    * hook method when new notification received
    */
    receiveMessage() {
        this.messaging.onMessage((payload) => {
            // const notificationTitle = payload.notification.title;
            // const notificationOptions = {
            //     body: payload.notification.body,
            //     icon: payload.notification.icon,
            // };
            // const notification = new Notification(notificationTitle, notificationOptions);
            // notification.onclick = function(event) {
            //   event.preventDefault(); // prevent the browser from focusing the Notification's tab
            //   window.open(payload.notification.click_action , '_blank');
            //   notification.close();
            // };
            console.log('new message received in service, payload: ', payload);
            if (payload.data.type === 'ALERT') {
                const alert = JSON.parse(payload.data.message.toString());
                this.notificationService.newNotification.emit(alert);
            }
            if (payload.data.type === 'MESSAGE') {
                const message: ChatLine = JSON.parse(payload.data.message.toString());
                this.notificationService.newMessage.emit(message);
                if (message.channel_id != null) {
                    this.channelUnread ++;
                }
                this.loadUnreadMessages();

                if (!this.isMessengerOpen) {
                    const notificationTitle = payload.notification.title;
                    const notificationOptions = {
                        body: payload.notification.body,
                        icon: payload.notification.icon,
                    };
                    const notification = new Notification(notificationTitle, notificationOptions);
                    notification.onclick = function(event) {
                        event.preventDefault(); // prevent the browser from focusing the Notification's tab
                        window.open('/u/messaging');
                        notification.close();
                    };
                }
            }
            if (payload.data.type === 'REPORT') {
                const reply: any = JSON.parse(payload.data.message.toString());
                this.loadUnreadReplies();
                  const notificationTitle = payload.notification.title;
                  const notificationOptions = {
                      body: payload.notification.body,
                      icon: payload.notification.icon,
                  };
                  const notification = new Notification(notificationTitle, notificationOptions);
                  notification.onclick = function(event) {
                      event.preventDefault(); // prevent the browser from focusing the Notification's tab
                      window.open('/u/control/bitacora/reportes');
                      notification.close();
                  };
            }
            // this.currentMessage.next(payload);
        });
    }

    loadUnreadMessages() {
        this.chatService.setUser(this.authService.getUser(), this.authService.getTokenSession());
        this.chatService.getUnreadMessages().then(success => {
            // if (this.unread < success.unread) {
            //     this.audio = new Audio();
            //     this.audio.src = './assets/sounds/alert.mp3';
            //     this.audio.load();
            //     this.audio.play();
            // }
            this.unread = success.unread;
            this.guardUnread = 0;
            this.guardChatUnread = []; // chats from guards with messages without read
            this.adminUnread = 0;
            this.adminChatUnread = []; // chats from admins with messages without read
            success.data.forEach((value: any) => {
                if (this.authService.getUser().id === value.chat.user_1_id && 'ADMIN' === value.chat.user_1_type) {
                    if (value.chat.user_2_type === 'ADMIN') {
                        this.adminUnread += value.unread;
                        this.adminChatUnread.push(value);
                    } else {
                        this.guardUnread += value.unread;
                        this.guardChatUnread.push(value);
                    }
                } else {
                    if (value.chat.user_1_type === 'ADMIN') {
                        this.adminUnread += value.unread;
                        this.adminChatUnread.push(value);
                    } else {
                        this.guardUnread += value.unread;
                        this.guardChatUnread.push(value);
                    }
                }
            });
            this.unreadEmitter.emit(this.getUnread());
        });
    }

    getUnread(): number {
        return (this.unread + this.channelUnread);
    }

    loadUnreadReplies() {
        this.binnacleService.getAllUnreadReplies().then((data: any) => {
            console.log(data.unread + ' unread replies');
            // if (+this.repliesUnread < +data.unread) {
            //     this.audio = new Audio();
            //     this.audio.src = './assets/sounds/alert.mp3';
            //     this.audio.load();
            //     this.audio.play();
            // }
            this.repliesUnread = data.unread;
            this.repliesUnreadEmitter.emit(this.repliesUnread);
        });
    }
}
