import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { Vehicle } from '../../model/vehicle/vehicle';
import {Watch} from '../../model/watch/watch';


@Component({
    selector : 'app-map-google',
    templateUrl : './map.google.html',
    styleUrls: ['./map.google.css']
})
export class MapGoogleComponent implements OnChanges {

    @Input() vehicles: Vehicle[] = [];
    @Input() watches: Watch[] = [];

    @Input() lat: number;
    @Input() lng: number;
    @Input() zoom: number;
    showVehiclesMarker = true;
    showWatchesMarker = false;
    @Input() showOpt = {};
    @Input() showMarkers;
    constructor() { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicles']) {
            // Use if necessary
        }
        if (changes['watches']) {
            // Use if necessary
        }
        if (changes['showMarkers']) {
        }
    }
}
