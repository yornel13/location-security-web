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
          <app-aside (markerFocused)="markersFocused($event, $event)" (markerChanged)="setMarkerChanged($event)"
                     [vehicles]="vehicles" [watches]="watches" [markersData]="markersData" class="app-aside" ></app-aside>
          <div class="maps-container">
              <app-map-osm [markerChanged]="markerChanged" [showMarker]="showMarker" [markersData]="markersData"
                           [vehicles]="vehicles"  [watches]="watches" [lat]="lat" [lng]="lng"
                           [zoom]="zoom"></app-map-osm>
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
    watches: Watch[] = [];
    markersData: any[] = [];
    error: string;
    @Input() markerChanged: boolean;
    @Input() showMarker = {vehicles: true , watches: true , bombas: true, noGroup: true, message: ''};
    @Input() latlng = {lat: null , lng: null};

    constructor(private vehiclesService: VehiclesService, private tabletService: TabletService) {}


    ngOnInit() {
        this.getVehicles();
        this.getTablets();
    }

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
      this.markersData.forEach(data => {
          if (data.group_name === 'Tablet Guardia') {
              removeTablets.push(data);
          }
      });
      removeTablets.forEach( tablet => {
          this.markersData.splice(this.markersData.indexOf(tablet), 1);
      });
      tablets.forEach( tablet => {
          this.markersData.unshift(tablet);
      });
    }

    updateVehicle(vehicles: Vehicle[]) {
        const removeVehicles: any[] = [];
        this.markersData.forEach(data => {
            if (data.group_name !== 'Tablet Guardia') {
                removeVehicles.push(data);
            }
        });
        removeVehicles.forEach( vehicle => {
            this.markersData.splice(this.markersData.indexOf(vehicle), 1);
        });
        vehicles.forEach( vehicle => {
            this.markersData.push(vehicle);
        });
    }

    setMarkerChanged(showMarker) {
      if (showMarker.message === 'showVehicles') {
          this.markerChanged = showMarker.vehicles;
          this.showMarker = showMarker;
      }
      if (showMarker.message === 'showBombas') {
          this.markerChanged = showMarker.bombas;
          this.showMarker = showMarker;
      }
      if (showMarker.message === 'showTablets') {
          this.markerChanged = showMarker.watches;
          this.showMarker = showMarker;
      }
    }

    markersFocused(lat, lng) {
      this.lat = lat.lat;
      this.lng = lng.lng;
    }

}

