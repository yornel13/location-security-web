import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Vehicle} from '../../model/vehicle/vehicle';
import {Watch} from '../../model/watch/watch';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit, OnChanges {
    @Input()
    vehicles: Vehicle[] = [];
    // @Input()
    // watches2: Watch[] = [];
    devices_status = 'DESCONECTADO';

    constructor() { }

    ngOnInit() {
    }
    ngOnChanges(changes: SimpleChanges) {
        // only run when property "data" changed
        if (changes['vehicles']) {
            this.vehicles = this.getVehicles(this.vehicles);
        }
        if (changes['watches2']) {
            console.log('hubo un cambio-');
            // this.watches2 = this.getWatches(this.watches2);
            // this.watches.forEach( watch => {
            //     console.log('long es -> '.concat(watch.longitude));
            // });
        }
    }
    getVehicles(vehicles: Vehicle[]) {
        if (!vehicles) { return; }
        return vehicles;
    }
    getWatches(watches: Watch[]) {
        if (!watches) { return; }
        return watches;
    }


}
