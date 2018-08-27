import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import { interval } from 'rxjs';
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
    private oldMessage:any = undefined;
    private channelMessage:any = undefined;
    private allChat:any = undefined;
    private allChannel:any = undefined;
    private guards: Guard[];
    private guardsData;
    private admins: Admin[];
    private adminsData;
    private refreshInterval = interval(1000);
    myForm: FormGroup;

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
        this.listChannelAdmin = [];
        this.addUsers = [];
        this.loadContactGuard();
        this.loadContactAdmin();
        this.listAllChannel();
        this.messagingService.receiveMessage();
        console.log(localStorage.User);
        this.myForm = this.formBuilder.group({
          data: this.formBuilder.array([])
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
                        {lastname: this.admins[i].lastname},
                        {type: 'ADMIN'});
                    const list = this.listContactAdmin.push(contact);
                }
            }, error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

    receivedMessage(message, id, idChat, sender_type, name){
      const newMessage = Object.assign({message: message},{user: name});
      this.currentChat.push(newMessage);
    }

    newMessage(formValue) {
        console.log(this.idChat);
        this.submitted = true;
        this.loading = true;
        var obj = JSON.parse(localStorage.User);
        const newMessage = Object.assign(formValue, { user: obj['name']});
        var sender_type = obj['isAdmin'] ? 'ADMIN' : 'GUARD';
        this.loading = true;
        console.log(this.isChannel);
        this.chatService.sendMessage(formValue.message, obj['id'], this.idChat, sender_type, obj['name'], this.isChannel)
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
        var obj = JSON.parse(localStorage.User);
        var sender_type = obj['isAdmin'] ? 'ADMIN' : 'GUARD';
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

    openChat(id,name,type){
        this.chatService.chat(id,name,type)
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
        var obj = JSON.parse(localStorage.User);
        if(obj['isAdmin'] == true){
          this.chatService.listAllChatId()
              .subscribe(
                  data => {
                      this.allChat = data;
                      this.allChat = this.allChat.data;
                      console.log(obj['id']);
                      for (var i=0; i< this.allChat.length; i++) {
                          if((this.allChat[i].user_2_id == id && this.allChat[i].user_2_type == type) ||
                        (this.allChat[i].user_2_id == obj['id'] && this.allChat[i].user_1_id == id)) {
                              console.log(this.allChat[i]);
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
        }else{
          this.chatService.listAllChatIdGuard()
              .subscribe(
                  data => {
                      this.allChat = data;
                      this.allChat = this.allChat.data;
                      console.log(obj['id']);
                      for (var i=0; i< this.allChat.length; i++) {
                          if((this.allChat[i].user_2_id == id && this.allChat[i].user_2_type == type) ||
                        (this.allChat[i].user_2_id == obj['id'] && this.allChat[i].user_1_id == id)) {
                              console.log(this.allChat[i]);
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
    listAllChannel(){
        var obj = JSON.parse(localStorage.User);
        if(obj['isAdmin'] == true){
          this.chatService.listAllChannelIdAdmin()
            .subscribe(
                success => {
                  this.allChannel = success;
                  this.allChannel = this.allChannel.data;
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
        }else{
          this.chatService.listAllChannelIdGuard()
            .subscribe(
                success => {
                  this.allChannel = success;
                  this.allChannel = this.allChannel.data;
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
    }

    openChannel(id){
      this.chatService.listOldMessageChannel(id)
        .subscribe(
          data => {
            this.currentChat = [];
            var list;
            this.channelMessage = data;
            this.channelMessage = this.channelMessage.data;
            console.log(this.channelMessage.reverse());
              for (var i=0; i< this.channelMessage.length; i++) {
                  this.idChat = id;
                  console.log(this.idChat);
                  this.isChannel = true;
                  const messageOld = Object.assign({message: this.channelMessage[i].text}, {user: this.channelMessage[i].sender_name});
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

    add(channel_id,tags) {
      for (var i=0; i< tags.length; i++) {
        const id = tags.id;
        const name = tags.name;
        const type = tags.type;
        this.chatService.addUsers(channel_id,id,type,name)
            .pipe(first())
            .subscribe(
                data => {
                    console.log(data);
                    this.loading = false;
                },
                error => {
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
      console.log("deselect");
      let index = this.addUsers.findIndex(x => x.value == id);
      //this.addUsers.removeAt(index);
    }

  }

}
