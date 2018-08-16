///<reference path="../../../model/admin/admin.service.ts"/>
import {Component, Input, OnInit, Output} from '@angular/core';
import {Vehicle} from '../../../model/vehicle/vehicle';
import {VehiclesService} from '../../../model/vehicle/vehicle.service';
import {UtilsVehicles} from '../../../model/vehicle/vehicle.utils';
import {HttpErrorResponse} from '@angular/common/http';
import {WatchesService} from '../../../model/watch/watch.service';
import {Watch} from '../../../model/watch/watch';
import {WatchUtils} from '../../../model/watch/watch.utils';
import {TabletService} from '../../../model/tablet/tablet.service';
import {Tablet} from '../../../model/tablet/tablet';
import {TabletUtils} from '../../../model/tablet/tablet.utils';

@Component({
  selector: 'app-monitoring',
  template: `
      <main class="monitoring-container">
              <app-aside (markerFocused)="markersFocused($event, $event)" (showWVMarkers)="cargarMarcadores($event)" [vehicles]="vehicles"
                         [watches]="watches" [markerData]="markerData" class="app-aside"></app-aside>
          <div class="maps-container">
              <app-map-osm [changeMarker]="showMarkers" class="app-map" [vehicles]="vehicles" [watches]="watches" [lat]="lat"
                           [lng]="lng" [zoom]="zoom"></app-map-osm>
          </div>
      </main>    `,
    styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {
  lat = -2.071522;
  lng = -79.607105;
  zoom = 8;
  vehicles: Vehicle[] = [];
  tablets: Tablet[] = [];
  markerData: any[] = [];
  error: string;
  @Input() showMarkers: string;
  @Input() showOpts = {};
  @Input() latlng = {lat: null , lng: null};
  watches: Watch[] = [];

  constructor(private vehiclesService: VehiclesService, private tabletService: TabletService) {}

  getVehicles() {
      this.vehiclesService.getVehicles().subscribe(data => {
          this.vehicles = new UtilsVehicles().processVehicles(data.data);
          this.updateVehicle(this.vehicles);
      }, (error: HttpErrorResponse) => {
          console.log(error.message);
          this.error = 'Error connecting with server';
      });
  }

  getTablets() {
       this.tabletService.getTablet().subscribe(data => {
           this.tablets = new TabletUtils().processTablets(data.data);
           this.updateTablet(this.tablets);
       }, (error: HttpErrorResponse) => {
           console.log(error.message);
           this.error = 'Error connecting with server';
       });
  }

  updateTablet(tablets: Tablet[]) {
      const removeTablets: any[] = [];
      this.markerData.forEach( data => {
          if (data.group_name === 'Tablet Guardia') {
              removeTablets.push(data);
          }
      });
      removeTablets.forEach( tablet => {
          this.markerData.splice(this.markerData.indexOf(tablet), 1);
      });
      tablets.forEach( tablet => {
          this.markerData.unshift(tablet);
      });
      console.log(this.markerData);
  }

    updateVehicle(vehicles: Vehicle[]) {
        const removeVehicles: any[] = [];
        this.markerData.forEach( data => {
            if (data.group_name !== 'Tablet Guardia') {
                removeVehicles.push(data);
            }
        });
        removeVehicles.forEach( vehicle => {
            this.markerData.splice(this.markerData.indexOf(vehicle), 1);
        });
        vehicles.forEach( vehicle => {
            this.markerData.push(vehicle);
        });
    }


  ngOnInit() {
      this.getVehicles();
      this.getTablets();
  }
  cargarMarcadores(message) {
    this.showMarkers = message;
  }
  markersFocused(lat, lng) {
      this.lat = lat.lat;
      this.lng = lng.lng;
  }
}


