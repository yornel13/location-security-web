import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, Injectable} from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';
import {Watch} from '../../../../model/watch/watch';
import {AsideService} from "./aside.service";

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})

export class AsideComponent implements OnInit, OnChanges {

    @Output() latlng = {lat: null , lng: null};
    @Input() vehicles: Vehicle[] = [];
    @Input() watches: Watch[] = [];
    @Output() showOpt = {showVehicles: true , showWatches: false , showMarkers: true};
    @Output() showWVMarkers = new EventEmitter();
    @Output() markerFocused = new EventEmitter();
    eventMessage = null;
    devices_status = 'DESCONECTADO';

    constructor(private asideService: AsideService) {}

    ngOnInit() {
        this.changeOptions('showVehiclesMarkers');
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicles']) {
            // Use if necessary
        }
        if (changes['watches']) {
            // Use if necessary
        }
    }
    changeOptions(message) {
        if (message.match('showVehiclesMarkers')) {
            this.eventMessage = message;
            this.showOpt = {showVehicles: true , showWatches: false , showMarkers: false};
            this.showWVMarkers.emit(this.eventMessage);
        } else {
            this.eventMessage = message;
            this.showOpt = {showVehicles: false , showWatches: true , showMarkers: true};
            this.showWVMarkers.emit(this.eventMessage);
        }
    }
    find(newSearch) {
        console.log(newSearch.value);
        this.vehicles.forEach( vehicle => {
           if (vehicle.imei.match(newSearch.value)) {
               console.log('imei es', vehicle.imei );
           } else {
               console.log('no match');
           }
        });
    }
    focusMarker(lat, lng) {
        console.log('lat: ', lat, 'lng: ', lng);
        this.latlng.lat = lat;
        this.latlng.lng = lng;
        this.markerFocused.emit(this.latlng);
        this.asideService.marker.emit(this.latlng);
    }
}
