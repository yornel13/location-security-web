import {Component, Input, OnInit} from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';

@Component({
    selector: 'app-popup-vehicle',
    templateUrl: './popup.vehicle.component.html',
    styleUrls: ['./popup.vehicle.css']
})
export class PopupVehicleComponent implements OnInit{

    vehicle: Vehicle;
    date: Date;

  ngOnInit() {

  }
}
