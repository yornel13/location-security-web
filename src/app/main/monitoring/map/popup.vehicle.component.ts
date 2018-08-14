import { Component, Input } from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';

@Component({
    selector: 'app-popup-vehicle',
    templateUrl: './popup.vehicle.component.html'
})
export class PopupVehicleComponent {
    @Input()
    vehicle: Vehicle;

    device_status = 'DESCONECTADO';
}
