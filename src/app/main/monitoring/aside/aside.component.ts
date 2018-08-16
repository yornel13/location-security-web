import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, Injectable} from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';
import {Watch} from '../../../../model/watch/watch';
import {AsideService} from './aside.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})

export class AsideComponent implements OnInit, OnChanges {


    @Input() vehicles: Vehicle[] = [];
    @Input() watches: Watch[] = [];
    @Input() markerData: any[] = [];
    @Output() showCard = {showVehicles: true , showWatches: true , showBombas: true, showNoGroup: true, showMarkers: true};
    @Output() showWVMarkers = new EventEmitter();
    @Output() markerFocused = new EventEmitter();

    eventMessage = null;
    vehiclesCheck = true;
    watchesCheck = true;
    bombasCheck = true;
    noGroupCheck = true;
    CHECK_URL = '../../../../assets/aside-menu/checked.png';

    constructor(private asideService: AsideService) {}

    ngOnInit() {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicles']) {
            // Use if necessary
        }
        if (changes['watches']) {
            // Use if necessary
        }
    }
    selectMarkersOpts(message) {
        if (message.match('showVehicles')) {
            this.vehiclesCheck = !this.vehiclesCheck;
            this.showWVMarkers.emit(this.eventMessage);
            this.eventMessage = message;
        }
        if (message.match('showBombas')) {
            this.bombasCheck = !this.bombasCheck;
            this.showWVMarkers.emit(this.eventMessage);
            this.eventMessage = message;
        }
        if (message.match('showTablets')) {
            this.watchesCheck = !this.watchesCheck;
            this.showWVMarkers.emit(this.eventMessage);
            this.eventMessage = message;
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
}
