import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import { filter, map, catchError } from 'rxjs/operators';
import { _throw } from 'rxjs/observable/throw';

//35324 56132

@Injectable({ providedIn: 'root' })
export class ChatService {

  readonly tokenFire = localStorage.TokenFire;
  readonly admin_id  = localStorage.UserDni;
  readonly session   = 123;
  readonly user_1_id   = JSON.parse(localStorage.User)['id'];
  readonly user_1_type = JSON.parse(localStorage.User)['isAdmin'] ? 'ADMIN' : 'GUARD';
  readonly user_1_name = JSON.parse(localStorage.User)['name'];

    constructor(
          private http: HttpClient,
          private route: ActivatedRoute,
          private router: Router,

          ) { }

    webRegistre(token) {
        return this.http.post<any>(`${environment.BASIC_URL}/messenger/register/web`,{registration_id: token, admin_id: this.user_1_id, session: this.admin_id})
            .pipe(map(res => {
              if(res.result != null) {
                  console.log(res);
                  return res.result;
              }
            }
          ));
    }

    chat(user_2_id: number, user_2_name: string, user_2_type: string) {
     return this.http.post<any>(`${environment.BASIC_URL}/messenger/chat`, { user_1_id: this.user_1_id, user_1_type: this.user_1_type, user_1_name: this.user_1_name, user_2_id, user_2_name, user_2_type })
          .pipe(map(chat => {
              if (chat['result'] != null) {
                return chat;
              }
            }),
            catchError((error: any) => {
              return Observable.throw(error);
            }));
    }

    conversation(user_2_id: string, user_2_type: string, user_2_name: string) {
      let httpHeaders = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('user_1_id', this.user_1_id)
          .set('user_1_type', this.user_1_type)
          .set('user_1_name', this.user_1_name)
          .set('user_2_id', user_2_id)
          .set('user_2_name', user_2_name)
          .set('user_2_type', user_2_type);
      this.http.get(`${environment.BASIC_URL}/messenger/conversations/admin/{user_1_id}`, { headers : httpHeaders })
        .pipe(
            map(res => res) // or any other operator
        )
        .subscribe((res: any) => {
            console.log(res.estado);
            console.log(res.id);
            return res;
        });
    }

    sendMessage(text:string, sender_id: number, chat_id: number, sender_type: string, sender_name: string){
      return this.http.post<any>(`${environment.BASIC_URL}/messenger/send`, { text, sender_id, chat_id, sender_type, sender_name })
          .pipe(map(mess => {
              if (mess.result != null) {
                console.log(mess.result.id);
                return mess.result.id;
              }
            }));
    }

    listContactGuard(){
      // /public/guard/active/1
      return this.http.get(`${environment.BASIC_URL}/guard/active/1`);
    }
    listContactAdmin(){
      // /public/admin/active/1
      return this.http.get(`${environment.BASIC_URL}/admin/active/1`);
    }

    listOldMessage(id){
      let httpHeaders = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', id)
      return this.http.get(`${environment.BASIC_URL}/messenger/conversations/chat/`+id, { headers : httpHeaders });
    }

    listAllChatId(){
      var id = this.user_1_id;
      let httpHeaders = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('Authorization', id)
      return this.http.get(`${environment.BASIC_URL}/messenger/conversations/admin/`+id, { headers : httpHeaders });
    }
}
