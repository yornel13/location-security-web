import { Component, OnInit } from '@angular/core';
import {Admin} from '../../../model/admin/admin';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  currentChat: any[];
  message: string;
  ngOnInit() {
    this.currentChat = [
      { user: 'bob', message: 'hey, what are you doing?' },
      { user: 'jeff', message: 'learning angular 2' },
      { user: 'bob', message: 'cool, angular is great' },
      { user: 'jeff', message: 'i know that\'s right' },
    ];
  }

  chat(formValue) {
    console.log(localStorage.getItem('UserDni'));
    const newMessage = Object.assign(formValue, { user: localStorage.getItem('UserDni')});
    this.currentChat.push(newMessage);
  }


}
