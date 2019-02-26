import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import {first} from 'rxjs/operators';
import {MessagingService} from '../../shared/messaging.service';

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
import {timer} from 'rxjs';

@Component({
    selector: 'app-messaging',
    templateUrl: './messaging.component.html',
    styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit, OnDestroy {
    @ViewChild('scrollMe') private myScrollContainer: ElementRef;
    user: Admin;
    loading = false;
    loading_msg = false;
    loading_chat = false;
    submitted = false;
    showChatForm = false;
    error = '';
    usersToSelect: any[];
    addUsersAdmin: any[];
    addUsersGuard: any[];
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
    filterValue: string;
    filter: string;
    search: any;
    userSelected: any;
    guardUnread: number;
    adminUnread: number;
    channelUnread: number;
    guardChatUnread: any[] = [];
    adminChatUnread: any[] = [];

    @ViewChild('messageField') messageField: any;
    @ViewChild('nameChannelField') nameChannelField: any;
    @ViewChild('ngForm') ngForm: any;

    listContactGuard: any[];
    listContactAdmin: any[];
    groupMembers: any[];
    currentChat: Chat = null;
    currentChannel: Channel = null;
    currentChatLines: ChatLine[];
    isClicked = false;

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
    }

    ngOnInit() {
        this.user = this.authService.getUser();
        if (this.user != null) {
            this.chatService.setUser(
                this.authService.getUser(),
                this.authService.getTokenSession()
            );
            this.currentChat = null;
            this.currentChatLines = [];
            this.listContactGuard = [];
            this.listContactAdmin = [];
            this.groupMembers = [];
            this.addUsersAdmin = [];
            this.addUsersGuard = [];
            this.loadContactGuard();
            this.loadContactAdmin();
            this.loadAllChannel();
            this.listAllOpenedChat();
            this.myForm = this.formBuilder.group({
                data: this.formBuilder.array([])
            });
            this.notificationService.newMessage.subscribe(
                (chatLine: ChatLine) => {
                    this.receivedMessage(chatLine);
                });
            this.subscribeToUnreadMessages();
        }
        this.messagingService.isMessengerOpen = true;
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                if (this.currentChannel != null) {
                    this.openOldChannelMessages(this.currentChannel);
                }
            }
        });
    }

    @HostListener('window:focus', ['$event'])
    onFocus(event: any): void {
        this.messagingService.isMessengerOpen = true;
    }

    @HostListener('window:blur', ['$event'])
    onBlur(event: any): void {
        this.messagingService.isMessengerOpen = false;
    }

    ngOnDestroy() {
        this.messagingService.isMessengerOpen = false;
    }

    subscribeToUnreadMessages() {
        this.guardUnread = this.messagingService.guardUnread;
        this.adminUnread = this.messagingService.adminUnread;
        this.channelUnread = this.messagingService.channelUnread;
        this.guardChatUnread = this.messagingService.guardChatUnread;
        this.adminChatUnread = this.messagingService.adminChatUnread;
        this.messagingService.unreadEmitter.subscribe(data => {
            if (this.currentChat != null) {
                if (this.guardUnread < this.messagingService.guardUnread ||
                    this.adminUnread < this.messagingService.adminUnread) {
                    this.openOldMessages(this.currentChat.id);
                }
            }
            this.guardUnread = this.messagingService.guardUnread;
            this.adminUnread = this.messagingService.adminUnread;
            this.channelUnread = this.messagingService.channelUnread;
            this.guardChatUnread = this.messagingService.guardChatUnread;
            this.adminChatUnread = this.messagingService.adminChatUnread;
            this.checkUnreadMessagesFromChat();
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
                this.listContactGuard.sort((n1, n2) => {
                    if (n1.name.trim().toUpperCase() < n2.name.trim().toUpperCase()) { return -1; }
                    if (n1.name.trim().toUpperCase() > n2.name.trim().toUpperCase()) {return 1; }
                    return 0;
                });
                this.checkChats();
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
                this.listContactAdmin.sort((n1, n2) => {
                    if (n1.name.trim().toUpperCase() < n2.name.trim().toUpperCase()) { return -1; }
                    if (n1.name.trim().toUpperCase() > n2.name.trim().toUpperCase()) {return 1; }
                    return 0;
                });
                this.checkChats();
            }, error => {
                this.error = error;
                this.loading = false;
            }
        );
    }

    loadAllChannel() {
        this.chatService.listAllChannelIdAdmin()
            .subscribe(
                success => {
                    this.allChannel = success.data;
                    this.allChannel.sort((n1, n2) => {
                        if (n1.channel_update_at > n2.channel_update_at) { return -1; }
                        if (n1.channel_update_at < n2.channel_update_at) {return 1; }
                        return 0;
                    });
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
                this.addChatLineIfNotExit(chatLine);
            } else {
                if (chatLine.sender_type === 'GUARD') {
                    let fromUser = null;
                    this.listContactGuard.forEach(guard => {
                        if (chatLine.sender_id === guard.id) {
                            fromUser = guard;
                        }
                    });
                    if (fromUser != null) {
                        fromUser.unread = fromUser.unread + 1;
                        this.listContactGuard.splice(this.listContactGuard.indexOf(fromUser, 0), 1);
                        this.listContactGuard.unshift(fromUser);
                    }
                }
                if (chatLine.sender_type === 'ADMIN') {
                    let fromUser = null;
                    this.listContactAdmin.forEach(admin => {
                        if (chatLine.sender_id === admin.id) {
                            fromUser = admin;
                        }
                    });
                    if (fromUser != null) {
                        fromUser.unread = fromUser.unread + 1;
                        this.listContactAdmin.splice(this.listContactAdmin.indexOf(fromUser, 0), 1);
                        this.listContactAdmin.unshift(fromUser);
                    }
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

    addChatLineIfNotExit(chatLine: ChatLine) {
        let alreadyAdded = false;
        this.currentChatLines.forEach(currentLine => {
            if (+currentLine.id === +chatLine.id) {
                alreadyAdded = true;
            }
        });
        if (!alreadyAdded) {
            this.currentChatLines.push(chatLine);
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
                    this.addChatLineIfNotExit(data);
                    this.scrollToBottom();
                    this.loading_msg = false;
                    this.messageField.nativeElement.value = '';
                    this.clickMakeAllRead();
                },
                error => {
                    this.error = error;
                    this.loading_msg = false;
                });
    }

    newChannel(formValue) {
        this.showMensajeria = false;
        this.submitted = true;
        this.loading = true;
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

    openChat(user: any) {
        this.clearSelected();
        user.active = true;
        this.userSelected = user;
        this.loading_chat = true;
        this.showChatForm = false;
        this.showMensajeria = false;
        this.currentChatLines = [];
        this.noMessages = false;
        this.isChannel = false;
        this.chatService.chat(user.id, user.name, user.type).then(
            (data: ApiResponse) => {
                this.currentChat = data.result;
                this.openOldMessages(this.currentChat.id);
            },
            error => {
                this.error = error;
                console.log(this.error);
            });
    }

    clearSelected() {
        if (this.userSelected !== undefined) {
            this.userSelected.active = false;
        }
        if (this.currentChannel != null) {
            this.currentChannel.active = false;
        }
        this.currentChat = null;
        this.currentChannel = null;
    }

    openOldMessages(chat_id) {
        this.noMessages = false;
        this.chatService.listOldMessage(chat_id).subscribe(
            data => {
                this.currentChatLines = data.data;
                this.currentChatLines.sort((n1, n2) => {
                    if (n1.create_at < n2.create_at) { return -1; }
                    if (n1.create_at > n2.create_at) {return 1; }
                    return 0;
                });
                // this.currentChatLines.reverse();
                this.loading_chat = false;
                if (this.currentChatLines.length === 0) {
                    this.noMessages = true;
                }
                this.makeAllRead(chat_id);
                this.loading_chat = false;
                this.scrollToBottom();
                this.showChatForm = true;
                this.message = '';
            },
            error => {
                this.error = error;
            });
    }

    clickMakeAllRead() {
        if (!this.isClicked) {
            timer(5000).subscribe(t => {
                this.isClicked = false;
            });
            this.isClicked = true;
            if (this.currentChat != null) {
                this.makeAllRead(this.currentChat.id);
            }
        }
    }

    makeAllRead(chat_id) {
        this.userSelected.unread = 0;
        this.chatService.makeMessagesChatRead(chat_id).then(response => {
            if (response.response) {
                this.messagingService.loadUnreadMessages();
            }
        }, error => {
            // on error
        });
    }

    viewGroupMembers(id) {
        this.groupMembers = [];
        this.chatService.getGroupMembers(id).then(
            data => {
                for (let i = 0; i < data.data.length; i++) {
                    const member = Object.assign(
                        {
                            user_type: data.data[i].user_type,
                            user_name: data.data[i].user_name,
                        }
                    );
                    this.groupMembers.push(member);
                }

            }, error => {
                this.error = error;
                this.loading = false;
            });
    }

    listAllOpenedChat() {
        this.currentChat = null;
        this.chatService.listAllChatId()
            .subscribe(
                data => {
                    this.allChat = data.data;
                    this.allChat.sort((n1, n2) => {
                        if (n1.update_at < n2.update_at) { return -1; }
                        if (n1.update_at > n2.update_at) {return 1; }
                        return 0;
                    });
                    this.checkChats();
                },
                error => {
                    console.log(this.error);
                });
        this.loading = false;
    }

    checkChats() {
        const usersGuardOpenChat = [];
        if (this.allChat) {
            this.allChat.forEach(chat => {
                this.listContactGuard.forEach(guard => {
                    if ((guard.id === chat.user_1_id && 'GUARD' === chat.user_1_type)
                        || (guard.id === chat.user_2_id && 'GUARD' === chat.user_2_type)) {
                        guard.update_at = chat.update_at;
                        guard.chat = chat;
                        usersGuardOpenChat.push(guard);
                    }
                });
            });
            // put all users with open chat to top
            usersGuardOpenChat.forEach(guard => {
                this.listContactGuard.splice(this.listContactGuard.indexOf(guard, 0), 1);
                this.listContactGuard.unshift(guard);
            });

            const usersAdminOpenChat = [];
            this.allChat.forEach(chat => {
                this.listContactAdmin.forEach(admin => {
                    if ((admin.id === chat.user_1_id && 'ADMIN' === chat.user_1_type)
                        || (admin.id === chat.user_2_id && 'ADMIN' === chat.user_2_type)) {
                        admin.update_at = chat.update_at;
                        admin.chat = chat;
                        usersAdminOpenChat.push(admin);
                    }
                });
            });
            // put all users with open chat to top
            usersAdminOpenChat.forEach(admin => {
                this.listContactAdmin.splice(this.listContactAdmin.indexOf(admin, 0), 1);
                this.listContactAdmin.unshift(admin);
            });
            this.checkUnreadMessagesFromChat();
        }
    }

    checkUnreadMessagesFromChat() {
        this.listContactGuard.forEach(guard => {
            if (guard.update_at) {
                this.guardChatUnread.forEach(value => {
                    if (value.chat.id === guard.chat.id) {
                        guard.unread = value.unread;
                    }
                });
            }
        });
        this.listContactAdmin.forEach(admin => {
            if (admin.update_at) {
                this.adminChatUnread.forEach(value => {
                    if (value.chat.id === admin.chat.id) {
                        admin.unread = value.unread;
                    }
                });
            }
        });
    }

    openChannel(channel: any) {
        this.clearSelected();
        channel.active = true;
        this.loading_chat = true;
        this.showChatForm = false;
        this.currentChannel = channel;
        this.showMensajeria = false;
        this.currentChatLines = [];
        this.isChannel = true;
        this.noMessages = false;
        if (this.messageField !== undefined) {
            this.messageField.nativeElement.value = '';
        }
        this.openOldChannelMessages(channel);
    }

    openOldChannelMessages(channel) {
        this.chatService.listOldMessageChannel(this.currentChannel.channel_id)
            .subscribe(data => {
                    this.loading_chat = true;

                    this.currentChannel = channel;

                    this.currentChatLines = data.data;
                    this.loading_chat = false;
                    if (this.currentChatLines.length === 0) {
                        this.noMessages = true;
                    }
                    this.currentChatLines.reverse();
                    this.loading_chat = false;
                    this.showChatForm = true;
                    this.messagingService.channelUnread = 0;
                    this.messagingService.loadUnreadMessages();
                    this.scrollToBottom();
                }, error => {
                    this.error = error;
                    this.loading = false;
                }
            );
    }

    add(channel_id) {
        const users = [];
        this.usersToSelect.forEach(user => {
            if (user.checked) {
                users.push({
                    user_id: user.id,
                    user_type: user.type,
                    user_name: user.name
                });
            }
        });
        if (users.length > 0) {
            this.chatService.addUsers(channel_id, users)
                .pipe(first())
                .subscribe(
                    data => {
                        this.loading = false;
                    }, error => {
                        this.error = error;
                        this.loading = false;
                    });
        }
    }

    getUsers(): any[] {
        this.usersToSelect = [];
        this.listContactAdmin.forEach(admin => {
            const name = admin.name + ' ' + admin.lastname;
            const userA = Object.assign(
                {id: admin.id},
                {name: name},
                {type: 'ADMIN'},
                {checked: false});
            this.usersToSelect.push(userA);
        });
        this.listContactGuard.forEach(guard => {
            const name = guard.name + ' ' + guard.lastname;
            const userG = Object.assign(
                {id: guard.id},
                {name: name},
                {type: 'GUARD'},
                {checked: false});
            this.usersToSelect.push(userG);
        });
        this.usersToSelect.sort((n1, n2) => {
            if (n1.name.trim().toUpperCase() < n2.name.trim().toUpperCase()) { return -1; }
            if (n1.name.trim().toUpperCase() > n2.name.trim().toUpperCase()) {return 1; }
            return 0;
        });
        return this.usersToSelect;
    }
}
