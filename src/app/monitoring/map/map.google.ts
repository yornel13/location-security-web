import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Vehicle } from '../../model/vehicle/vehicle';

@Component({
    selector : 'app-map-google',
    templateUrl : './map.google.html',
    styleUrls: ['./map.google.css']
})
export class MapGoogleComponent implements OnChanges {
    @Input()
    vehicles: Vehicle[] = [];
    @Input()
    lat: number;
    @Input()
    lng: number;
    @Input()
    zoom: number;

    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        // only run when property "data" changed
        if (changes['vehicles']) {
            /*this.vehicles = this.getVehicles(this.vehicles);*/
        }
    }
    getVehicles(vehicles: Vehicle[]) {
        if (!vehicles) { return; }
        return vehicles;
    }
}