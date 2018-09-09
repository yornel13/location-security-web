import {Component, Input, OnInit} from '@angular/core';
import {Watch} from '../../../../model/watch/watch';
import {forEach} from '@angular/router/src/utils/collection';
import {Guard} from '../../../../model/guard/guard';
import {Tablet} from '../../../../model/tablet/tablet';

@Component({
    selector: 'app-popup-watch',
    templateUrl: './popup.watch.component.html',
    styleUrls: ['./popup.watch.css']
})
export class PopupWatchComponent {

    tablet: Tablet;
}
