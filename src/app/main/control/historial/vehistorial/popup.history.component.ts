import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-popup-history',
    templateUrl: './popup.history.component.html',
    styleUrls: ['./popup.history.css']
})
export class PopupHistoryComponent implements OnInit {

    record: any;
    private date: Date;
    private time: Date;
    private isSOS: boolean;

    constructor() {}

    ngOnInit() {
      this.date = new Date(this.record.date);
      this.time = new Date(this.record.time);
      this.isSOS = this.record.alert_message.includes('SOS');
    }
}
