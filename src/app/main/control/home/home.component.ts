import { Component, OnInit } from '@angular/core';
import {MessagingService} from '../../../shared/messaging.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    unreadReplies: number;

    constructor(private messagingService: MessagingService) { }

    ngOnInit() {
        this.unreadReplies = this.messagingService.repliesUnread;
        this.messagingService.repliesUnreadEmitter.subscribe(count => {
            this.unreadReplies = count;
        });
    }

}
