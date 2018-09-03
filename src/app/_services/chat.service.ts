import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { filter, map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';
import {AuthenticationService} from './authentication.service';
import {ListChat} from '../../model/chat/list.chat';
import {ListChannel} from '../../model/chat/list.channel';
import {ChatLine} from '../../model/chat/chat.line';
import {ListChatLine} from '../../model/chat/list.chat.line';

const httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json' })};

@Injectable({ providedIn: 'root' })
export class ChatService {

    user_1_id;
    user_1_type;
    user_1_name;
    token_session;

    constructor(private http: HttpClient, private authService: AuthenticationService) {
        if (authService.getUser() != null) {
            this.user_1_id   = authService.getUser().id;
            this.user_1_type = 'ADMIN';
            this.user_1_name = `${authService.getUser().name} ${authService.getUser().lastname}`;
            this.token_session = authService.getTokenSession();
        }
        httpOptions.headers.set('APP-TOKEN', authService.getTokenSession());
    }

    webRegister(tokenFire: String, tokenSession: String, adminId: number) {
        return this.http.post(`${environment.BASIC_URL}/messenger/register/web`, {
                                            registration_id: tokenFire,
                                            session: tokenSession,
                                            admin_id: adminId}, httpOptions)
            .toPromise().then((response) => response);
    }

    chat(user_2_id: number, user_2_name: string, user_2_type: string) {
        return this.http.post<any>(`${environment.BASIC_URL}/messenger/chat`, {
                user_1_id: this.user_1_id,
                user_1_type: this.user_1_type,
                user_1_name: this.user_1_name,
                user_2_id,
                user_2_name,
                user_2_type
        }).pipe(map(chat => {
                if (chat['result'] != null) {
                    return chat;
                }
            }),
            catchError((error: any) => {
                return Observable.throw(error);
            }));
    }

    channel(name: string) {
        return this.http.post<any>(`${environment.BASIC_URL}/messenger/channel`, {
                name: name,
                creator_id: this.user_1_id,
                creator_type: this.user_1_type,
                creator_name: this.user_1_name
        }).pipe(map(chat => {
                if (chat['result'] != null) {
                    return chat;
                }
            }),
            catchError((error: any) => {
                return Observable.throw(error);
            }));
    }

    sendMessage(text: string, chat_id: number, isChannel: boolean) {
        if (!isChannel) {
            return this.http.post<any>(`${environment.BASIC_URL}/messenger/send`, {
              text,
              chat_id,
              sender_id: this.user_1_id,
              sender_type: this.user_1_type,
              sender_name: this.user_1_name})
                .pipe(map(mess => {
                    if (mess.result != null) {
                        return mess.result;
                    }
                }));
        } else {
            return this.http.post<any>(`${environment.BASIC_URL}/messenger/send`, {
              text,
              channel_id: chat_id,
              sender_id: this.user_1_id,
              sender_type: this.user_1_type,
              sender_name: this.user_1_name})
                .pipe(map(mess => {
                    if (mess.result != null) {
                        return mess.result;
                    }
                }));
        }
    }

    listContactGuard() {
      // /public/guard/active/1
        return this.http.get(`${environment.BASIC_URL}/guard/active/1`);
    }
    listContactAdmin() {
      // /public/admin/active/1
        return this.http.get(`${environment.BASIC_URL}/admin/active/1`);
    }

    listOldMessage(id) {
        return this.http.get<ListChatLine>(`${environment.BASIC_URL}/messenger/conversations/chat/` + id, httpOptions);
    }

    listOldMessageChannel(id) {
        return this.http.get<ListChatLine>(`${environment.BASIC_URL}/messenger/conversations/channel/` + id, httpOptions);
    }

    listAllChatId() {
        return this.http.get<ListChat>(`${environment.BASIC_URL}/messenger/conversations/admin/` + this.user_1_id, httpOptions);
    }

    listAllChatIdGuard() {
        return this.http.get(`${environment.BASIC_URL}/messenger/conversations/guard/` + this.user_1_id, httpOptions);
    }

    listAllChannelIdAdmin() {
        return this.http.get<ListChannel>(`${environment.BASIC_URL}/messenger/channel/admin/` + this.user_1_id, httpOptions);
    }

    listAllChannelIdGuard() {
        return this.http.get(`${environment.BASIC_URL}/messenger/channel/guard/` + this.user_1_id, httpOptions);
    }

    listAllChanelId() {
        return this.http.get(`${environment.BASIC_URL}/messenger/channel/guard/` + this.user_1_id, httpOptions);
    }

    addUsers(channel_id, user_id, user_type, user_name) {
        console.log('new channel:' , channel_id);
        return this.http.post<any>(`${environment.BASIC_URL}/messenger/channel/` + channel_id + `/add`, {
                user_id: user_id,
                user_type: user_type,
                user_name: user_name
        }).pipe(map(add => {
                console.log(add);
            return(add);
        }), catchError((error: any) => {
            return Observable.throw(error);
        }));
    }

}
