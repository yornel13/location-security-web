import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Tablet} from '../../../../model/tablet/tablet';
import {MainService} from '../../main.service';

@Component({
    selector: 'app-card-tablet',
    templateUrl: './card.tablet.component.html',
    styleUrls: ['./card.tablet.css']
})
export class CardTabletComponent implements OnInit {
    @Input()
    tablet: any;
    @Output() latlng = {lat: null , lng: null};
    @Output() markerFocused = new EventEmitter();
    devices_status = 'ONLINE';
    date: Date;


    constructor(private mainService: MainService) {}

    focusMarker(lat, lng) {
        console.log('lat: ', lat, 'lng: ', lng);
        this.latlng.lat = lat;
        this.latlng.lng = lng;
        this.markerFocused.emit(this.latlng);
        this.mainService.marker.emit(this.latlng);
    }

  ngOnInit() {
    this.date = new Date(this.tablet.generated_time);
  }
}
