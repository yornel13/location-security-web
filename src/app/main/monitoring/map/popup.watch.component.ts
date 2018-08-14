import { Component, Input } from '@angular/core';
import {Watch} from '../../../../model/watch/watch';

@Component({
    selector: 'app-popup-watch',
    templateUrl: './popup.watch.component.html'
})
export class PopupWatchComponent {
    @Input()
    watch: Watch;
}
