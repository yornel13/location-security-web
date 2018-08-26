import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MessagingService } from '../../shared/messaging.service';

import { ChatService } from '../../_services';
import {GuardService} from '../../../model/guard/guard.service';
import {Guard} from '../../../model/guard/guard';
import {AdminService} from '../../../model/admin/admin.service';
import {Admin} from '../../../model/admin/admin';

@Component({
    selector: 'app-messaging',
    templateUrl: './messaging.component.html',
    styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    currentChat: any[];
    listContactGuard: any[];
    listContactAdmin: any[];
    message: string;
    idChat: number;
    private oldMessage:any = undefined;
    private allChat:any = undefined;
    private guards: Guard[];
    private guardsData;
    private admins: Admin[];
    private adminsData;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private messagingService: MessagingService,
        private chatService: ChatService,
        private guardService: GuardService,
        private adminService: AdminService) {}

    ngOnInit() {
        this.currentChat = [];
        this.listContactGuard = [];
        this.listContactAdmin = [];
        this.loadContactGuard();
        this.loadContactAdmin();
        this.messagingService.receiveMessage();
    }

    loadContactGuard() {
        this.guardService.getAllActive().then(
            success => {
                this.guardsData = success;
                this.guards = this.guardsData.data;
                for (let i = 0; i < this.guards.length; i++) {
                    const contact = Object.assign(
                        {id: this.guards[i].id},
                        {name: this.guards[i].name},
                        { lastname: this.guards[i].lastname},
                        {type: 'GUARD'});
                    const list = this.listContactGuard.push(contact);
                }
            }, error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

    loadContactAdmin() {
        this.adminService.getAllActive().then(
            success => {
                this.adminsData = success;
                this.admins = this.adminsData.data;
                for (let i = 0; i < this.admins.length; i++) {
                    const contact = Object.assign(
                        {id: this.admins[i].id},
                        {name: this.admins[i].name},
                        { lastname: this.admins[i].lastname},
                        {type: 'ADMIN'});
                    const list = this.listContactAdmin.push(contact);
                }
            }, error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

    newMessage(formValue) {
        console.log(this.idChat);
        this.submitted = true;
        this.loading = true;
        var obj = JSON.parse(localStorage.User);
        const newMessage = Object.assign(formValue, { user: obj['name']});
        var sender_type = obj['isAdmin'] ? 'ADMIN' : 'GUARD';
        this.loading = true;
        this.chatService.sendMessage(formValue.message, obj['id'], this.idChat, sender_type, obj['name'])
            .pipe(first())
            .subscribe(
                data => {
                    this.currentChat.push(newMessage);
                    this.loading = false;
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }

    openChat(id,name,type){
        this.chatService.chat(id,name,type)
            .subscribe(
                data => {
                    this.currentChat = [];
                    console.log(data.result);
                    this.idChat = data.result.id;
                },
                error => {
                    this.openOldMessage(8);
                });
    }

    openOldMessage(chat_id){
        this.chatService.listOldMessage(chat_id)
            .subscribe(
                data => {
                    this.currentChat = [];
                    this.oldMessage = data;
                    this.oldMessage = this.oldMessage.data;
                    console.log(this.oldMessage.reverse());
                    for (var i=0; i< this.oldMessage.length; i++) {
                        const messageOld = Object.assign({message: this.oldMessage[i].text}, {user: this.oldMessage[i].sender_name});
                        var list = this.currentChat.push(messageOld);
                    }
                    return list;
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }

    listAllChat(id,name,type){
        this.chatService.listAllChatId()
            .subscribe(
                data => {
                    this.allChat = data;
                    this.allChat = this.allChat.data;
                    for (var i=0; i< this.allChat.length; i++) {
                        if(this.allChat[i].user_2_id == id && this.allChat[i].user_2_type == type){
                            var userSelect = this.allChat[i];
                            break;
                        }
                    }
                    if(userSelect){
                        console.log(userSelect);
                        this.openOldMessage(userSelect.id);
                        this.idChat = userSelect.id;
                    }else{
                        this.openChat(id,name,type);
                    }
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }

}
