import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import {PopupVehicleComponent} from './monitoring/map/popup.vehicle.component';
import {PopupWatchComponent} from './monitoring/map/popup.watch.component';

import { VehiclesService } from './model/vehicle/vehicle.service';
import { WatchesService } from './model/watch/watch.service';
import { GuardService } from './model/guard/guard.service';

import { HttpClientModule } from '@angular/common/http';

// My Modulus
import { MonitoringComponent } from './monitoring/monitoring.component';
import { MapOsmComponent } from './monitoring/map/map.osm';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './monitoring/aside/aside.component';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule, LeafletModule.forRoot(), LeafletMarkerClusterModule.forRoot()
  ],
  providers: [ VehiclesService, WatchesService, GuardService ],
  entryComponents: [ PopupVehicleComponent, PopupWatchComponent ],
  declarations: [ AppComponent,
      MonitoringComponent,
      MapOsmComponent,
      PopupVehicleComponent,
      PopupWatchComponent,
      HeaderComponent, AsideComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
