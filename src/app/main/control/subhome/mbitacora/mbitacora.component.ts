import { Component, OnInit } from '@angular/core';
import {MessagingService} from '../../../../shared/messaging.service';

@Component({
  selector: 'app-mbitacora',
  templateUrl: './mbitacora.component.html',
  styleUrls: ['./mbitacora.component.css']
})
export class MbitacoraComponent implements OnInit {

    unreadReplies: number;

    constructor(private messagingService: MessagingService) { }

    ngOnInit() {
        this.unreadReplies = this.messagingService.repliesUnread;
        this.messagingService.repliesUnreadEmitter.subscribe(count => {
            this.unreadReplies = count;
        });
    }

}
