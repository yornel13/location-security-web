import {Component, OnInit} from '@angular/core';
import {Vehicle} from '../model/vehicle/vehicle';
import {VehiclesService} from '../model/vehicle/vehicle.service';
import {UtilsVehicles} from '../model/vehicle/vehicle.utils';
import {HttpErrorResponse} from '@angular/common/http';

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
export class MonitoringComponent implements OnInit {
  lat = -2.071522;
  lng = -79.607105;
  zoom = 12;
  vehicles: Vehicle[];
  error: string;
  show = true;
  constructor(private vehiclesService: VehiclesService) {}

  getVehicles() {
      this.vehiclesService.getVehicles().subscribe(data => {
          this.vehicles = new UtilsVehicles().process(data.data);
      }, (error: HttpErrorResponse) => {
          console.log(error.message);
          this.error = 'Error connecting with server';
      });
  }

  ngOnInit() {
  }
}


