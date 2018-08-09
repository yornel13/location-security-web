import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Vehicle} from '../../model/vehicle/vehicle';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit, OnChanges {
  @Input()
  vehicles: Vehicle[] = [];
  devices_status = 'DESCONECTADO';

  constructor() { }

  ngOnInit() {
  }

    ngOnChanges(changes: SimpleChanges) {
        // only run when property "data" changed
        if (changes['vehicles']) {
            this.vehicles = this.getVehicles(this.vehicles);
        }
    }
    getVehicles(vehicles: Vehicle[]) {
        if (!vehicles) { return; }
        return vehicles;
    }


}
