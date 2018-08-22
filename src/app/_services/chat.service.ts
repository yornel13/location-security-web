import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {Admin} from '../../model/admin/admin';

// 35324 56132

@Injectable({ providedIn: 'root' })
export class ChatService {

    readonly tokenFire = localStorage.getItem('TokenFire');
    readonly session   = 123;
    readonly admin: Admin = JSON.parse(localStorage.getItem('User'));
    readonly user_1_id =  this.admin.id;
    readonly user_1_type = 'ADMIN';
    readonly user_1_name = this.admin.name;

    constructor(
          private http: HttpClient,
          private route: ActivatedRoute,
          private router: Router,

          ) { }

    webRegistre() {
        return this.http.post<any>(`${environment.BASIC_URL}/public/messenger/register/web`, { registration_id: this.tokenFire, admin_id: this.user_1_id, session: this.session})
            .pipe(map(res => {
              if(res.result != null) {
                  console.log(res.registration_id);
                  return res.registration_id;
              }
            }
          ));
    }

    chat(user_2_id: number, user_2_type: string, user_2_name: string) {
     return this.http.post<any>(`${environment.BASIC_URL}/public/messenger/chat`, { user_1_id: this.user_1_id, user_1_type: this.user_1_type, user_1_name: this.user_1_name, user_2_id, user_2_type, user_2_name  })
          .pipe(map(chat => {
              if (chat.result != null) {
                console.log(chat.id);
                console.log(chat.state);
                return chat.id;
              }
            }));
    }

    conversation(user_2_id: string, user_2_type: string, user_2_name: string) {
      let httpHeaders = new HttpHeaders()
          .set('Content-Type', 'application/json')
          .set('user_1_id', String(this.user_1_id))
          .set('user_1_type', this.user_1_type)
          .set('user_1_name', this.user_1_name)
          .set('user_2_id', user_2_id)
          .set('user_2_type', user_2_type)
          .set('user_2_name', user_2_name);
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
              console.log(mess);
              if (mess.result != null) {
                console.log(mess.id);
                return mess.id;
              }
            }));
    }




}
