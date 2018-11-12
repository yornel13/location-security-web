import {Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { map, catchError } from 'rxjs/operators';
import {AuthenticationService} from './authentication.service';
import {ListChat} from '../../model/chat/list.chat';
import {ListChannel} from '../../model/chat/list.channel';
import {ListChatLine} from '../../model/chat/list.chat.line';
import {ListGroupMembers} from '../../model/chat/list.group.members';
import {Admin} from '../../model/admin/admin';
import {ApiResponse} from '../../model/app.response';
import {ListUnread} from '../../model/chat/list.unread';

@Injectable({ providedIn: 'root' })
export class ChatService {

    private user_1_id;
    private user_1_type;
    private user_1_name;
    private token_session;

    constructor (
        private http: HttpClient,
        private authService: AuthenticationService) {}

    setUser(user: Admin, tokenSession) {
        if (user != null) {
            this.user_1_id   = user.id;
            this.user_1_type = 'ADMIN';
            this.user_1_name = `${user.name} ${user.lastname}`;
            this.token_session = tokenSession;
        } else {
            console.log('No user to work with ChatService');
        }
    }

    chat(user_2_id: number, user_2_name: string, user_2_type: string) {
        return this.http.post<any>(`${environment.BASIC_URL}/messenger/chat`,
            {
                user_1_id: this.user_1_id,
                user_1_type: this.user_1_type,
                user_1_name: this.user_1_name,
                user_2_id,
                user_2_name,
                user_2_type
            },
            {
                headers: this.authService.getHeader()
            }).toPromise();
    }

    channel(name: string) {
        return this.http.post<any>(`${environment.BASIC_URL}/messenger/channel`,
            {
                name: name,
                creator_id: this.user_1_id,
                creator_type: this.user_1_type,
                creator_name: this.user_1_name
            },
            {
                headers: this.authService.getHeader()
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
            return this.http.post<any>(`${environment.BASIC_URL}/messenger/send`,
                {
                    text,
                    chat_id,
                    sender_id: this.user_1_id,
                    sender_type: this.user_1_type,
                    sender_name: this.user_1_name
                },
                {
                    headers: this.authService.getHeader()
                }).pipe(map(mess => {
                    if (mess.result != null) {
                        return mess.result;
                    }
                }));
        } else {
            return this.http.post<any>(`${environment.BASIC_URL}/messenger/send`,
                {
                    text,
                    channel_id: chat_id,
                    sender_id: this.user_1_id,
                    sender_type: this.user_1_type,
                    sender_name: this.user_1_name
                },
                {
                    headers: this.authService.getHeader()
                }).pipe(map(mess => {
                    if (mess.result != null) {
                        return mess.result;
                    }
                }));
        }
    }

    listOldMessage(id) {
        return this.http.get<ListChatLine>(`${environment.BASIC_URL}/messenger/conversations/chat/` + id,
            {
                headers: this.authService.getHeader()
            });
    }

    makeMessagesChatRead(id) {
        return this.http.put<ApiResponse>(
            `${environment.BASIC_URL}/messenger/conversations/admin/` + this.user_1_id + `/chat/` + id + `/read`,
            {},
            {
                headers: this.authService.getHeader()
            }).toPromise().then((response) => response);
    }

    listOldMessageChannel(id) {
        return this.http.get<ListChatLine>(`${environment.BASIC_URL}/messenger/conversations/channel/` + id,
            {
                headers: this.authService.getHeader()
            });
    }

    listAllChatId() {
        return this.http.get<ListChat>(`${environment.BASIC_URL}/messenger/conversations/admin/` + this.user_1_id,
            {
                headers: this.authService.getHeader()
            });
    }

    listAllChatIdGuard() {
        return this.http.get(`${environment.BASIC_URL}/messenger/conversations/guard/` + this.user_1_id,
            {
                headers: this.authService.getHeader()
            });
    }

    listAllChannelIdAdmin() {
        return this.http.get<ListChannel>(`${environment.BASIC_URL}/messenger/channel/admin/` + this.user_1_id,
            {
                headers: this.authService.getHeader()
            });
    }

    addUsers(channel_id, users) {
        return this.http.post<any>(
            `${environment.BASIC_URL}/messenger/channel/` + channel_id + `/add`,
            users,
            {
                headers: this.authService.getHeader()
            }
        ).pipe(map(add => {
            console.log(add);
            return(add);
        }), catchError((error: any) => {
            return Observable.throw(error);
        }));
    }

    getGroupMembers(id) {
        return this.http.get<ListGroupMembers>(`${environment.BASIC_URL}/messenger/channel/` + id + `/members`,
            {
                headers: this.authService.getHeader()
            }).toPromise()
            .then((response) => response);
    }

    getUnreadMessages() {
        return this.http.get<ListUnread>(`${environment.BASIC_URL}/messenger/conversations/admin/`
              + this.user_1_id + `/chat/unread`,
            {
                headers: this.authService.getHeader()
            })
            .toPromise().then((response) => response);
    }
}
