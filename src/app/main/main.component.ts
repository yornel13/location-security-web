import { Component } from '@angular/core';
import { MessagingService } from "./shared/messaging.service";


@Component({
    selector: 'app-main',
    template: `
      <div class="app-container">
          <app-header class="app-header"></app-header>
          <router-outlet></router-outlet>
      </div>
  `
})
<<<<<<< HEAD
export class MainComponent { }
=======
export class MainComponent {

  message;

  constructor(private messagingService: MessagingService) { }

  ngOnInit() {
    const userId = JSON.parse(localStorage.User)['id'];
    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();
    this.message = this.messagingService.currentMessage;
  }

  }
>>>>>>> ee6984de653e35dbd0adeecdaccd8e8e86509bb2
