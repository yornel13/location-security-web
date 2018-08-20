import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, Injectable} from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';
import {Watch} from '../../../../model/watch/watch';
import {AsideService} from './aside.service';
import { FilterPipe } from './filter.pipe';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})

export class AsideComponent implements OnInit, OnChanges {


    @Input() vehicles: Vehicle[] = [];
    @Input() watches: Watch[] = [];
    @Input() markersData: any[] = [];
    @Output() showMarker = {vehicles: true , watches: true , bombas: true, noGroups: true, message: ''};
    @Output() markerChanged = new EventEmitter();
    @Output() markerFocused = new EventEmitter();

    @Output() vehiclesCheck = true;
    @Output() watchesCheck = true;
    @Output() bombasCheck = true;
    @Output() noGroupCheck = true;
    // filter: any = { "vehicle": {"imei": ""} };
    noCards = false;
    showCardContainer = true;
    CHECK_ICON_URL = '../../../../assets/aside-menu/checked.png';
    search;
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
            this.showMarker.vehicles =  this.vehiclesCheck;
            this.showMarker.message =  message;
            this.markerChanged.emit(this.showMarker);
        }
        if (message.match('showBombas')) {
            this.bombasCheck = !this.bombasCheck;
            this.showMarker.bombas = this.bombasCheck;
            this.showMarker.message =  message;
            this.markerChanged.emit(this.showMarker);
        }
        if (message.match('showTablets')) {
            this.watchesCheck = !this.watchesCheck;
            this.showMarker.watches = this.watchesCheck;
            this.showMarker.message =  message;
            this.markerChanged.emit(this.showMarker);
        }
        if (!this.vehiclesCheck && !this.bombasCheck && !this.watchesCheck) {
            this.noCards = true;
            this.showCardContainer = false;
        } else {
            this.noCards = false;
            this.showCardContainer = true;
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
