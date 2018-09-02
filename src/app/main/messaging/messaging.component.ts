import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { interval } from 'rxjs';
import { MessagingService } from '../../shared/messaging.service';

import {AuthenticationService, ChatService} from '../../_services';
import {GuardService} from '../../../model/guard/guard.service';
import {Guard} from '../../../model/guard/guard';
import {AdminService} from '../../../model/admin/admin.service';
import {Admin} from '../../../model/admin/admin';
import {Chat} from '../../../model/chat/chat';
import {Channel} from '../../../model/chat/channel';
import {ChatLine} from '../../../model/chat/chat.line';
import {NotificationService} from '../../shared/notification.service';

@Component({
    selector: 'app-messaging',
    templateUrl: './messaging.component.html',
    styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    user: Admin;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    currentChat: any[];
    checkboxValue: any[];
    listContactGuard: any[];
    listContactAdmin: any[];
    listChannelAdmin: any[];
    addUsers: any[];
    message: string;
    idChat: number;
    isChannel: boolean;
    optionsMap: any[];
    optionsChecked: any[];
    options: any[];
    accepted = true;
    private oldMessage: ChatLine[];
    private channelMessage: ChatLine[];
    private allChat: Chat[];
    private allChannel: Channel[];
    private guards: Guard[];
    private guardsData;
    private admins: Admin[];
    private adminsData;
    private refreshInterval = interval(1000);
    myForm: FormGroup;
    nameChannel: any;
    chat_id;

    constructor(
        private authService: AuthenticationService,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private messagingService: MessagingService,
        private notificationService: NotificationService,
        private chatService: ChatService,
        private guardService: GuardService,
        private adminService: AdminService) {
        this.user = authService.getUser();
    }

    ngOnInit() {
        this.currentChat = [];
        this.listContactGuard = [];
        this.listContactAdmin = [];
        this.listChannelAdmin = [];
        this.addUsers = [];
        this.loadContactGuard();
        this.loadContactAdmin();
        this.listAllChannel();
        console.log(this.authService.getUser());
        this.myForm = this.formBuilder.group({
            data: this.formBuilder.array([])
        });
        this.notificationService.newMessage.subscribe(
            (chatLine: ChatLine) => {
                this.receivedMessage(chatLine);
            });
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
                        {lastname: this.guards[i].lastname},
                        {photo: this.guards[i].photo},
                            {type: 'GUARD'});
                    this.listContactGuard.push(contact);
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
                        {lastname: this.admins[i].lastname},
                        {photo: this.admins[i].photo},
                        {type: 'ADMIN'});
                    const list = this.listContactAdmin.push(contact);
                }
            }, error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

    receivedMessage(chatLine: ChatLine) {
        if (chatLine.chat_id != null) {
            if (this.idChat == chatLine.chat_id) {
                const newMessage = Object.assign(
                    {message: chatLine.text},
                    {user: chatLine.sender_name},
                    {created_at: chatLine.create_at}
                    );
                this.currentChat.push(newMessage);
            }
        }
        //
    }

    newMessage(formValue) {
        console.log(this.idChat);
        this.submitted = true;
        this.loading = true;
        const newMessage = Object.assign(formValue, { user: this.user.name, id: this.user.id});
        const sender_type = 'ADMIN';
        this.loading = true;
        console.log('channel.ts: ' + this.isChannel);
        this.chatService.sendMessage(formValue.message, this.user.id, this.idChat, sender_type, this.user.name, this.isChannel )
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

    newChannel(formValue) {
        this.submitted = true;
        this.loading = true;
        const sender_type = 'ADMIN';
        this.loading = true;
        this.listChannelAdmin = [];
        this.chatService.channel(formValue.nameChannel)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data);
                    this.loading = false;
                    this.listAllChannel();
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    openChat(id, name, type) {
        this.chatService.chat(id, name, type)
            .subscribe(
                data => {
                    this.currentChat = [];
                    console.log(data.result);
                    this.idChat = data.result.id;
                },
                error => {
                    this.error = error;
                    console.log(this.error);
                });
    }

    openOldMessage(chat_id) {
        this.chat_id = chat_id;
          this.chatService.listOldMessage(chat_id)
            .subscribe(
                data => {
                    this.currentChat = [];
                    this.oldMessage = data.data;
                    console.log(this.oldMessage.reverse());
                    let lastMessage;
                    for (let i = 0; i < this.oldMessage.length; i++) {
                        const messageOld = Object.assign({message: this.oldMessage[i].text}, {user: this.oldMessage[i].sender_name}, {user: this.oldMessage[i].create_at});
                        lastMessage = this.currentChat.push(messageOld);
                    }
                    this.scrollToBottom();
                    return lastMessage;
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }

    listAllChat(id, name, type) {
        this.chatService.listAllChatId()
            .subscribe(
                data => {
                    this.allChat = data.data;
                    let userSelect;
                    for (let i = 0; i < this.allChat.length; i++) {
                        if ((this.allChat[i].user_2_id == id && this.allChat[i].user_2_type == type) ||
                            (this.allChat[i].user_2_id == this.user.id && this.allChat[i].user_1_id == id)) {
                            console.log(this.allChat[i]);
                            userSelect = this.allChat[i];
                          break;
                      }
                  }
                  if (userSelect) {
                      console.log(userSelect);
                      this.openOldMessage(userSelect.id);
                      this.idChat = userSelect.id;
                  } else {
                      this.openChat(id, name, type);
                  }
              },
              error => {
                  this.error = error;
                  this.loading = false;
              });
    }

    listAllChannel() {
        this.chatService.listAllChannelIdAdmin()
            .subscribe(
                success => {
                    this.allChannel = success.data;
                    for (let i = 0; i < this.allChannel.length; i++) {
                        const channel = Object.assign(
                            {id: this.allChannel[i].channel_id},
                            {name: this.allChannel[i].channel_name});
                        console.log(this.allChannel[i]);
                        const list = this.listChannelAdmin.push(channel);
                    }
            },
            error => {
                this.error = error;
                this.loading = false;
            });
    }

    openChannel(id) {
        this.chatService.listOldMessageChannel(id)
            .subscribe(
                data => {
                    this.currentChat = [];
                    this.channelMessage = data.data;
                    console.log(this.channelMessage.reverse());
                    let list;
                    for (let i = 0; i < this.channelMessage.length; i++) {
                        this.idChat = id;
                        console.log(this.idChat);
                        this.isChannel = true;
                        const messageOld = Object.assign(
                            {message: this.channelMessage[i].text},
                            {user: this.channelMessage[i].sender_name, userId: this.channelMessage[i].sender_id});
                        list = this.currentChat.push(messageOld);
                    }
              return list;
          },
          error => {
            this.error = error;
            this.loading = false;
          }
        );
    }

    add(channel_id, tags) {
        for (let i = 0; i < tags.length; i++) {
            const id = tags.id;
            const name = tags.name;
            const type = tags.type;
            this.chatService.addUsers(channel_id, id, type, name)
                .pipe(first())
                .subscribe(
                    data => {
                        console.log(data);
                        this.loading = false;
                }, error => {
                    this.error = error;
                    this.loading = false;
                });
        }
    }

    onChange(id: string, name: string, type: string, isChecked: boolean) {
        if (isChecked) {
            const user = Object.assign(
                {id: id},
                {name: name},
                {type: type});
            const list = this.addUsers.push(user);
            console.log(this.addUsers);
    } else {
            console.log('deselect');
            //let index = this.addUsers.findIndex(x => x.value == id);
            //this.addUsers.removeAt(index);
    }

  }

}
