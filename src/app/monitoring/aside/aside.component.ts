import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Vehicle} from '../../model/vehicle/vehicle';
import {Watch} from '../../model/watch/watch';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit, OnChanges {

    @Input() vehicles: Vehicle[] = [];
    @Input() watches: Watch[] = [];
    devices_status = 'DESCONECTADO';

    constructor() { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicles']) {
            // Use if necessary
        }
        if (changes['watches']) {
            // Use if necessary
        }
    }
}
