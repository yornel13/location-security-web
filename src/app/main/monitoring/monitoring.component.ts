///<reference path="../../../model/admin/admin.service.ts"/>
import {Component, Input, OnInit} from '@angular/core';
import {Vehicle} from '../../../model/vehicle/vehicle';
import {VehiclesService} from '../../../model/vehicle/vehicle.service';
import {UtilsVehicles} from '../../../model/vehicle/vehicle.utils';
import {HttpErrorResponse} from '@angular/common/http';
import {WatchesService} from '../../../model/watch/watch.service';
import {Watch} from '../../../model/watch/watch';
import {WatchUtils} from '../../../model/watch/watch.utils';

@Component({
  selector: 'app-monitoring',
  template: `
      <main  class="monitoring-container">
          <app-aside (markerFocused)="markersFocused($event, $event)" (showWVMarkers)="cargarMarcadores($event)"
                     [vehicles]="vehicles" [watches]="watches" class="app-aside"></app-aside>
          <div class="maps-container">
              <app-map-osm class="app-map" [vehicles]="vehicles" [watches]="watches" [lat]="lat" [lng]="lng" [zoom]="zoom"></app-map-osm>
          </div>
      </main>
  `,
    styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {
  lat = -2.071522;
  lng = -79.607105;
  zoom = 8;
  vehicles: Vehicle[] = [];
  watches: Watch[] = [];
  error: string;
  showWatches: boolean;
  showVehicles: boolean;
  @Input() showMarkers: string;
  @Input() showOpts = {};
  @Input() latlng = {lat: null , lng: null};

  constructor(private vehiclesService: VehiclesService, private watchesService: WatchesService) {}

  getVehicles() {
      this.vehiclesService.getVehicles().subscribe(data => {
          this.vehicles = new UtilsVehicles().processVehicles(data.data);
      }, (error: HttpErrorResponse) => {
          console.log(error.message);
          this.error = 'Error connecting with server';
      });
  }
  getWatches() {
       this.watchesService.getWatchesActive().subscribe(data => {
           this.watches = new WatchUtils().processWatches(data.data);
       }, (error: HttpErrorResponse) => {
           console.log(error.message);
           this.error = 'Error connecting with server';
       });
  }


  ngOnInit() {
      this.getWatches();
      this.getVehicles();
  }
  cargarMarcadores(message) {
    this.showMarkers = message;
  }
  markersFocused(lat, lng) {
      console.log('en foc marker', lng.lng);
      this.lat = lat.lat;
      this.lng = lng.lng;
  }
}


