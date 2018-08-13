import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {Vehicle} from '../../model/vehicle/vehicle';
import {Watch} from '../../model/watch/watch';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit, OnChanges {

    showWatches: boolean;
    showVehicles: boolean;
    showMarkers: boolean;
    @Input() vehicles: Vehicle[] = [];
    @Input() watches: Watch[] = [];
    @Output() showOpt = {showVehicles: true , showWatches: false , showMarkers: true};
    @Output() showWVMarkers = new EventEmitter();
    eventMessage = null;
    devices_status = 'DESCONECTADO';

    constructor() { }

    ngOnInit() {
        if (this.showWatches) {
            this.changeOptions(null);
        }
        // if (this.showVehicles) {
        //     this.mostrarVehiculos(null);
        // }
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
        if (message.localeCompare('showVehiclesMarkers')) {
            this.eventMessage = message;
            this.showOpt = {showVehicles: true , showWatches: true , showMarkers: true};
            this.showWVMarkers.emit(this.eventMessage);
        } else {
            this.eventMessage = message;
            this.showOpt = {showVehicles: false , showWatches: true , showMarkers: false};
            this.showWVMarkers.emit(this.eventMessage);
        }

        // console.log('Cargar guardia');
    }
    // mostrarVehiculos(message) {
    //     this.showOpt = {showVehicles: true , showWatches: false , showMarkers: true};
    //     this.eventMessage = message;
    //     this.showWVMarkers.emit(this.eventMessage);
    //     // console.log('Cargar vehiculos');
    // }
}
