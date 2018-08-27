import {Component, OnInit} from '@angular/core';
import {MessagingService} from '../shared/messaging.service';


@Component({
    selector: 'app-main',
    template: `
      <div class="app-container">
          <app-header class="app-header"></app-header>
          <router-outlet></router-outlet>
      </div>
  `
})
export class MainComponent implements OnInit {

    message;

    constructor(private messagingService: MessagingService) { }

    ngOnInit() {
        const userId = 'user001';
        this.messagingService.requestPermission(userId);
        this.messagingService.receiveMessage();
        this.message = this.messagingService.currentMessage;
    }
}