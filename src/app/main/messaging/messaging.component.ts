import { Component, OnInit } from '@angular/core';
// import { MessagingService } from '../../shared/messaging.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ChatService } from '../../_services';
import {Admin} from "../../../model/admin/admin";

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
    ];
  }

  newMessage(formValue) {
      this.submitted = true;
      this.loading = true;
      const admin: Admin = JSON.parse(localStorage.getItem('User'));
      console.log(localStorage.getItem('User'));
      const newMessage = Object.assign(formValue, { user: admin.name + ' ' + admin.lastname });
      const sender_type = 'ADMIN';
      console.log('Datos: ', formValue.message, sender_type, admin.name, admin.id, 8);
      this.loading = true;
      this.chatService.sendMessage(formValue.message, admin.id, 8, sender_type, admin.name)
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
