
import {Injectable, OnChanges, SimpleChanges} from '@angular/core';
import { AngularFireModule } from 'angularfire2';
// for AngularFireDatabase
import { AngularFireDatabase } from 'angularfire2/database';
// for AngularFireAuth
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase';
import { take } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import {AuthenticationService} from '../_services';
import {NotificationService} from './notification.service';

@Injectable()
export class MessagingService {

  messaging = firebase.messaging();
  currentMessage = new BehaviorSubject(null);
    private error: any;
    private loading: boolean;

  constructor(
        private notificationService: NotificationService,
        private authService: AuthenticationService,
        private afDB: AngularFireDatabase,
        private afAuth: AngularFireAuth) {
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
        this.updateToken(userId, token);
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
            console.log('new message received in service: ', payload);
            if (payload.data.type === 'ALERT') {
                const alert = JSON.parse(payload.data.message.toString());
                this.notificationService.newNotification.emit(alert);
            }
            if (payload.data.type === 'MESSAGE') {
                const message = JSON.parse(payload.data.message.toString());
                this.notificationService.newMessage.emit(message);
            }
            this.currentMessage.next(payload);
        });
    }
}
