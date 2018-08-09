import {Component, OnInit} from '@angular/core';
import {Vehicle} from '../model/vehicle/vehicle';
import {VehiclesService} from '../model/vehicle/vehicle.service';
import {UtilsVehicles} from '../model/vehicle/vehicle.utils';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  template: `
      <app-map-google [vehicles]="vehicles" [lat]="lat" [lng]="lng" [zoom]="zoom"></app-map-google>
      <app-map-osm [vehicles]="vehicles" [lat]="lat" [lng]="lng" [zoom]="zoom"></app-map-osm>
  `,
  styleUrls: ['./dash.component.css']
})
export class DashComponent implements OnInit {

  lat = -2.071522;
  lng = -79.607105;
  zoom = 12;
  vehicles: Vehicle[];
  error: string;

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
    this.getVehicles();
  }
}


