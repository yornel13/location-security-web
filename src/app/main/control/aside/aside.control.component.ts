import {Component, OnInit} from '@angular/core';


@Component({
    selector: 'app-control-aside',
    templateUrl: './aside.control.component.html',
    styleUrls: ['./aside.control.component.css']
})

export class AsideControlComponent  implements OnInit {

  unreadReplies: number;

  constructor() {}

  ngOnInit() {

  }
}
