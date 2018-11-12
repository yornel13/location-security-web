import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../_services';
import {Router} from '@angular/router';
import {Admin} from '../../../model/admin/admin';
import {MessagingService} from '../../shared/messaging.service';
import {ToastrService} from 'ngx-toastr';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    user: string;
    photo: string;
    unreadMessages: number;
    unreadReplies: number;

    constructor(
        private authService: AuthenticationService,
        private router: Router,
        private messagingService: MessagingService,
        private toastr: ToastrService) { }

    ngOnInit() {
        const admin: Admin = this.authService.getUser();
        if (admin != null) {
            this.user = admin.name + ' ' + admin.lastname;
            if (admin.photo != null && admin.photo.includes('http')) {
                this.photo = admin.photo;
            } else {
                this.photo = './assets/img/user_empty.jpg';
            }
            this.checkSession();
        } else {
            console.log('no user logger');
            this.router.navigate(['/login']).then();
        }
    }

    subscribeToUnreadMessages() {
        this.unreadMessages = this.messagingService.getUnread();
        this.unreadReplies = this.messagingService.repliesUnread;
        this.messagingService.unreadEmitter.subscribe(count => {
            this.unreadMessages = count;
        });
        this.messagingService.repliesUnreadEmitter.subscribe(count => {
            this.unreadReplies = count;
        });
    }

    checkSession() {
        this.authService.verify(this.authService.getTokenSession())
            .then(success => {
                    console.log('session checked success');
                    this.subscribeToUnreadMessages();
                },
                error => {
                    console.log('session checked failed');
                    this.authService.cleanStore();
                    this.router.navigate(['/login']).then();
                });
    }

    exit() {
        this.authService.logout().then(
            success => {
                this.authService.cleanStore();
                this.showToastExpire();
                location.replace('/login');
                // this.router.navigate(['/login']).then( on => {
                //     location.replace('/login');
                // });
            },
            error => {
                this.authService.cleanStore();
                this.showToastExpire();
                location.replace('/login');
                // this.router.navigate(['/login']).then(on => {
                //     location.reload(true);
                // });
            });
    }

    showToastExpire() {
        this.toastr.info('Sesión Finalizada', 'Error',
            { positionClass: 'toast-center-center'});
    }
}
