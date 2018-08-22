import {Component, Input, OnInit} from '@angular/core';
import {Watch} from '../../../../model/watch/watch';
import {forEach} from '@angular/router/src/utils/collection';
import {Guard} from '../../../../model/guard/guard';

@Component({
    selector: 'app-popup-watch',
    templateUrl: './popup.watch.component.html'
})
export class PopupWatchComponent {

    dni: string;
    name: number;
    lastname: number;
    generated_time: string;
    observation: string;
}
