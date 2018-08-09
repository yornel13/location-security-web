import { Component } from '@angular/core';
import {Vehicle} from '../model/vehicle/vehicle';
import {VehiclesService} from '../model/vehicle/vehicle.service';

@Component({
  selector: 'app-monitoring',
  template: `
      <main class="monitoring-container">
          <app-aside [vehicles]="vehicles" class="app-aside" ></app-aside>
          <div class="maps-container">
              <app-map-google  [vehicles]="vehicles" [lat]="lat" [lng]="lng" [zoom]="zoom"></app-map-google>
              <!--<app-map-osm hidden class="app-map" [vehicles]="vehicles" [lat]="lat" [lng]="lng" [zoom]="zoom"></app-map-osm>-->
          </div>
      </main>
      `,
    styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent {
  lat = -2.071522;
  lng = -79.607105;
  zoom = 12;
  vehicles: Vehicle[];
  constructor(public vehiclesService: VehiclesService) { this.getVehicles(); } // call on constructor the get
  getVehicles() {
    this.vehiclesService.getVehicles().subscribe(data => {
      this.vehicles = data.data;
      this.vehicles.forEach(vehicle => {
        vehicle.iconUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/images/marker-icon.png';
      });
      console.log(data.data[0]);
    });
  }
}
