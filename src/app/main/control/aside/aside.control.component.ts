import {Component, OnInit} from '@angular/core';
import {MessagingService} from '../../../shared/messaging.service';


@Component({
    selector: 'app-control-aside',
    templateUrl: './aside.control.component.html',
    styleUrls: ['./aside.control.component.css']
})

export class AsideControlComponent  implements OnInit {

  unreadReplies: number;

  constructor(private messagingService: MessagingService) {}

  ngOnInit() {
      this.unreadReplies = this.messagingService.repliesUnread;
      this.messagingService.repliesUnreadEmitter.subscribe(count => {
          this.unreadReplies = count;
      });
  }
}
