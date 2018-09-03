import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Guard} from '../../../model/guard/guard';

@Component({
    selector: 'app-item-guard',
    templateUrl: './item.guard.component.html',
    styleUrls: ['./item.guard.css']
})
export class ItemGuardComponent implements OnInit {

    @Input() guard: any;
    title: string;
    photo: string;
    date: Date;

    ngOnInit() {
        if (this.guard.photo == null || this.guard.photo == undefined || this.guard.photo == '') {
            this.photo = '../../../assets/img/user_empty.jpg';
        } else {
            this.photo = this.guard.photo;
        }
    }
    // callParent(guard: any) {
    //     this.clickGuard.emit(guard);
    // }
}
