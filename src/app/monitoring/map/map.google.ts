import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Vehicle } from '../../model/vehicle/vehicle';
import {Watch} from '../../model/watch/watch';

@Component({
    selector : 'app-map-google',
    templateUrl : './map.google.html',
    styleUrls: ['./map.google.css']
})
export class MapGoogleComponent implements OnChanges {
    @Input()
    vehicles: Vehicle[] = [];
    @Input()
    watchesMap: Watch[] = [];
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
            this.vehicles = this.getVehicles(this.vehicles);
        }
        if (changes['watchesMap']) {
        // this.watches2.forEach(watch => {
        //        console.log('lat '.concat(watch.latitude));
        //     });
            this.watchesMap = this.getWatches(this.watchesMap);
            console.log('watchesMap size:' + this.watchesMap.length);
        }
    }
    getVehicles(vehicles: Vehicle[]) {
        if (!vehicles) { return; }
        return vehicles;
    }
    getWatches(watches: Watch[]) {
        if (!watches) { return; }
        return watches;
    }
}
