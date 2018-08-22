import { Component, OnInit } from '@angular/core';
//import { MessagingService } from "../../shared/messaging.service";
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ChatService } from '../../_services';

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
  message: string;

  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private chatService: ChatService) {}

  ngOnInit() {
    this.currentChat = [
      { user: 'bob', message: 'hey, what are you doing?' },
      { user: 'jeff', message: 'learning angular 2' },
      { user: 'bob', message: 'cool, angular is great' },
      { user: 'jeff', message: 'i know that\'s right' },
    ];
  }

  newMessage(formValue) {
      this.submitted = true;
      this.loading = true;
      var obj = JSON.parse(localStorage.User);
      console.log(localStorage.User);
      const newMessage = Object.assign(formValue, { user: obj['name']});
      var sender_type = obj['isAdmin'] ? 'ADMIN' : 'GUARD'
      console.log("aquivamos",formValue.message,sender_type,obj['name'], obj['id'], 8);
      this.loading = true;
      this.chatService.sendMessage(formValue.message, obj['id'], 8, sender_type, obj['name'])
          .pipe(first())
          .subscribe(
              data => {
                  this.currentChat.push(newMessage); // text, sender_type, sender_name, sender_id, chatID
                  this.loading = false;
              },
              error => {
                  this.error = error;
                  this.loading = false;
              });
  }

}
