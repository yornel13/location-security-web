import { Component, Input } from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';

@Component({
    selector: 'app-popup-vehicle',
    templateUrl: './popup.vehicle.component.html'
})
export class PopupVehicleComponent {

    imei: string;
    alias: string;
    speed: string;
    generated_time: string;
    model_name: string;

}
