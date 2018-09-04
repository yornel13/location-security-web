import { Component, Input } from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';

@Component({
    selector: 'app-popup-vehicle',
    templateUrl: './popup.vehicle.component.html',
    styleUrls: ['./popup.vehicle.css']
})
export class PopupVehicleComponent {

    vehicle: Vehicle;
}
