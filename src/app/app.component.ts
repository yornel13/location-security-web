import { Component } from '@angular/core';
import { MessagingService } from "./shared/messaging.service";
@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  message;

  constructor(private messagingService: MessagingService) { }

  ngOnInit() {
    const userId = 'user001';
<<<<<<< HEAD
    this.messagingService.requestPermission(userId);
    this.messagingService.receiveMessage();
=======
    this.messagingService.receiveMessage()
>>>>>>> ee6984de653e35dbd0adeecdaccd8e8e86509bb2
    this.message = this.messagingService.currentMessage;
  }
}
