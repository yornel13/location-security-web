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
import {ApiResponse} from '../../../model/app.response';

@Component({
    selector: 'app-messaging',
    templateUrl: './messaging.component.html',
    styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    user: Admin;
    loading = false;
    loading_msg = false;
    loading_chat = false;
    submitted = false;
    showChatForm = false;
    error = '';
    addUsers: any[];
    message: string;
    isChannel: boolean;
    options: any[];
    allChat: Chat[];
    allChannel: Channel[];
    guards: Guard[];
    guardsData;
    admins: Admin[];
    adminsData;
    myForm: FormGroup;
    nameChannel: any;
    noMessages = false;
    emptyField = false;
    showMensajeria = true;

    @ViewChild('messageField') messageField: any;
    @ViewChild('nameChannelField') nameChannelField: any;
    @ViewChild('ngForm') ngForm: any;

    listContactGuard: any[];
    listContactAdmin: any[];
    listChannelAdmin: any[];
    groupMembers: any[];
    currentChat: Chat;
    currentChannel: Channel;
    currentChatLines: ChatLine[];

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
        this.currentChat = null;
        this.currentChatLines = [];
        this.listContactGuard = [];
        this.listContactAdmin = [];
        this.listChannelAdmin = [];
        this.groupMembers = [];
        this.addUsers = [];
        this.loadContactGuard();
        this.loadContactAdmin();
        this.loadAllChannel();
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
                        {update_date: this.guards[i].update_date},
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
                let me: Admin = null;
                this.admins.forEach(admin => {
                  if (admin.id === this.user.id) {
                    me = admin;
                  }
                });
                if (me != null) {
                  this.admins.splice(this.admins.indexOf(me, 0), 1);
                }
                for (let i = 0; i < this.admins.length; i++) {
                    const contact = Object.assign(
                        {id: this.admins[i].id},
                        {name: this.admins[i].name},
                        {lastname: this.admins[i].lastname},
                        {update_date: this.admins[i].update_date},
                        {photo: this.admins[i].photo},
                        {type: 'ADMIN'});
                    this.listContactAdmin.push(contact);
                }
            }, error => {
                this.error = error;
                this.loading = false;
            }
        );
    }



    loadAllChannel() {
      this.listChannelAdmin = [];
      this.chatService.listAllChannelIdAdmin()
        .subscribe(
          success => {
            this.allChannel = success.data;
            for (let i = 0; i < this.allChannel.length; i++) {
              const channel = Object.assign(
                {id: this.allChannel[i].channel_id},
                {name: this.allChannel[i].channel_name});
              console.log('channel ' + i + ': ', this.allChannel[i]);
              this.listChannelAdmin.push(channel);
            }
          },
          error => {
            this.error = error;
            this.loading = false;
          });
    }

    receivedMessage(chatLine: ChatLine) {
        console.log('received message from ', chatLine.sender_name + ' -> ' + chatLine.sender_type);
        if (chatLine.chat_id != null && this.currentChat != null) {
            if (+this.currentChat.id === +chatLine.chat_id) {
              let alreadyAdded = false;
                this.currentChatLines.forEach(currentLine => {
                  if (currentLine.id === chatLine.id) {
                    alreadyAdded = true;
                  }
                });
                if (!alreadyAdded) {
                  this.currentChatLines.push(chatLine);
                }
            }
        } else if (chatLine.channel_id != null && this.currentChannel != null) {
          if (+this.currentChannel.channel_id === +chatLine.channel_id) {
            let alreadyAdded = false;
            this.currentChatLines.forEach(currentLine => {
              if (currentLine.id === chatLine.id) {
                alreadyAdded = true;
              }
            });
            if (!alreadyAdded) {
              this.currentChatLines.push(chatLine);
            }
          }
        }
    }
    newMessage(formValue) {
        this.showMensajeria = false;
        this.submitted = true;
        this.loading_msg = true;
        const chatId = this.isChannel ? this.currentChannel.channel_id : this.currentChat.id;
        this.chatService.sendMessage(formValue.message, chatId, this.isChannel)
            .pipe(first())
            .subscribe(
              (data: ChatLine)  => {
                  this.loading_msg = true;
                  this.currentChatLines.push(data);
                  this.scrollToBottom();
                  this.loading_msg = false;
                  this.messageField.nativeElement.value = '';
              },
                error => {
                    this.error = error;
                    this.loading_msg = false;
                });
    }
    newChannel(formValue) {
        console.log('crear grupo', formValue.nameChannel);
        this.showMensajeria = false;
        this.submitted = true;
        this.loading = true;
        const sender_type = 'ADMIN';
        this.listChannelAdmin = [];

        if (formValue.nameChannel === undefined) {
            this.loading = false;
            this.emptyField = true;
            return;
        }
        this.emptyField = false;
        this.chatService.channel(formValue.nameChannel)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data);
                    this.nameChannelField.nativeElement.value = '';
                    this.loading = false;
                    this.loadAllChannel();
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
        formValue.nameChannel = undefined;
    }

    scrollToBottom(): void {
        try {
            this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
        } catch (err) { }
    }

    openChat(id, name, type) {
        console.log(name);
        this.loading_chat = true;
        this.showChatForm = false;
      // this.currentChat = null;
      // this.currentChannel = null;
      this.showMensajeria = false;
      this.currentChatLines = [];
      this.noMessages = false;
      this.isChannel = false;
      this.chatService.chat(id, name, type).subscribe(
        (data: ApiResponse) => {
          this.currentChat = data.result;
          console.log('----->', this.currentChat);

            this.openOldMessages(this.currentChat.id);
            // this.loading_chat = false;
            console.log(data);
        },
          error => {
          this.error = error;
          console.log(this.error);
        });
    }

    openOldMessages(chat_id) {
      console.log('open old');
        this.noMessages = false;
        // this.loading_chat = true;
        this.chatService.listOldMessage(chat_id).subscribe(
        data => {
                this.currentChatLines = data.data;
                this.currentChatLines.reverse();
                if (this.currentChatLines.length === 0) {
                    this.loading_chat = false;
                    this.noMessages = true;
                }
                this.loading_chat = false;
                this.scrollToBottom();
                this.showChatForm = true;
                this.message = '';
                },
                error => {
                    this.error = error;
                });
    }

    viewGroupMembers(id) {
        this.groupMembers = [];
        console.log('g->>> ', id);
        this.chatService.getGroupMembers(id).then(
            data => {
                for (let i = 0; i < data.data.length; i++) {
                    const member = Object.assign(
                        {
                            user_type: data.data[i].user_type,
                            user_name: data.data[i].user_name,
                        }
                    );
                    console.log('M->>> ', member.user_name);

                    this.groupMembers.push(member);
            }

        }, error => {
                this.error = error;
                this.loading = false;
        });
    }

    listAllChat(id, name, type) {
        this.currentChat = null;

        this.chatService.listAllChatId()
            .subscribe(
                data => {
                    this.allChat = data.data;
                    let userSelect;
                    this.loading = true;
                    for (let i = 0; i < this.allChat.length; i++) {
                        if ((this.allChat[i].user_2_id == id && this.allChat[i].user_2_type == type) ||
                            (this.allChat[i].user_2_id == this.user.id && this.allChat[i].user_1_id == id)) {
                            // console.log(this.allChat[i]);
                            userSelect = this.allChat[i];
                            break;
                        }
                    }
                    if (userSelect) {
                      // console.log('usuario seleccionado-->  ', userSelect);
                      this.openOldMessages(userSelect.id);
                      //this.idChat = userSelect.id;
                  } else {
                      this.openChat(id, name, type);
                  }
              },
              error => {
                  this.error = error;
                  this.loading = false;
              });
        this.loading = false;
    }

    openChannel(channel: Channel) {
        this.loading_chat = true;
        this.showChatForm = false;
        console.log('try open channel');
        this.currentChannel = channel;
        this.showMensajeria = false;

        this.currentChat = null;
        // this.currentChannel = null;
        this.currentChatLines = [];
        this.isChannel = true;
        this.noMessages = false;
        if (this.messageField !== undefined) {
            this.messageField.nativeElement.value = '';
        }

        this.chatService.listOldMessageChannel(this.currentChannel.channel_id)
            .subscribe(
                data => {
                  console.log(data);
                    this.loading_chat = true;

                    this.currentChannel = channel;

                    this.currentChatLines = data.data;
                    if (this.currentChatLines.length === 0) {
                        this.loading_chat = false;
                        this.noMessages = true;
                    }
                    this.currentChatLines.reverse();
                    this.loading_chat = false;
                    this.showChatForm = true;

                },
          error => {
            this.error = error;
            this.loading = false;
          }
        );
        // this.currentChannel = null;
        console.log('llego');

        this.scrollToBottom();

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

    onChange(contact: any, type: string, isChecked: boolean) {
      const name = contact.name + ' ' + contact.lastname;
      if (isChecked) {
        const user = Object.assign(
                {id: contact.id},
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
