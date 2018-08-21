import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';

@Component({
  selector: 'app-messaging',
  templateUrl: './messaging.component.html',
  styleUrls: ['./messaging.component.css']
})
export class MessagingComponent implements OnInit {
  currentChat: any[];
  message: string;
  messagesCollection: AngularFirestoreCollection<any[]>;
  messages: Observable<any[]>;

  constructor(public afs: AngularFirestore) { }

  ngOnInit() {
    this.getChatData();
  }

 getChatData() {
   this.messagesCollection = this.afs.collection<any>('chat_messages');
     this.messages = this.messagesCollection.valuechanges();
 }

}
