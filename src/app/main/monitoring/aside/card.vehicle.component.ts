import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';
import {MainService} from '../../main.service';

@Component({
    selector: 'app-card-vehicle',
    templateUrl: './card.vehicle.component.html',
    styleUrls: ['./card.vehicle.css']
})
export class CardVehicleComponent {
    @Input()
    vehicle: Vehicle;
    @Output() latlng = {lat: null , lng: null};
    @Output() showWVMarkers = new EventEmitter();
    @Output() markerFocused = new EventEmitter();
    devices_status = 'DESCONECTADO';

    constructor(private asideService: MainService) {}

    focusMarker(lat, lng, vehicle) {
        console.log('lat: ', lat, 'lng: ', lng);
        this.latlng.lat = lat;
        this.latlng.lng = lng;
        this.markerFocused.emit(this.latlng);
        this.asideService.marker.emit(this.latlng);
        this.asideService.vehicle.emit(vehicle);
    }
}
