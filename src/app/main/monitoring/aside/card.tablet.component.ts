import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Tablet} from '../../../../model/tablet/tablet';
import {AsideService} from './aside.service';

@Component({
    selector: 'app-card-tablet',
    templateUrl: './card.tablet.component.html',
    styleUrls: ['./card.tablet.css']
})
export class CardTabletComponent {
    @Input()
    tablet: Tablet;
    @Output() latlng = {lat: null , lng: null};
    @Output() markerFocused = new EventEmitter();
    devices_status = 'ONLINE';


    constructor(private asideService: AsideService) {}

    focusMarker(lat, lng) {
        console.log('lat: ', lat, 'lng: ', lng);
        this.latlng.lat = lat;
        this.latlng.lng = lng;
        this.markerFocused.emit(this.latlng);
        this.asideService.marker.emit(this.latlng);
    }
}
