import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import {PopupVehicleComponent} from './monitoring/map/popup.vehicle.component';
import {PopupWatchComponent} from './monitoring/map/popup.watch.component';

import { AgmCoreModule } from '@agm/core';
import { VehiclesService } from './model/vehicle/vehicle.service';
import { WatchesService } from './model/watch/watch.service';
import { GuardService } from './model/guard/guard.service';

import { HttpClientModule } from '@angular/common/http';

// My Modulus
import { MonitoringComponent } from './monitoring/monitoring.component';
import { MapGoogleComponent } from './monitoring/map/map.google';
import { MapOsmComponent } from './monitoring/map/map.osm';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './monitoring/aside/aside.component';
import {AgmJsMarkerClustererModule} from '@agm/js-marker-clusterer';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    AgmJsMarkerClustererModule,
    FormsModule, LeafletModule.forRoot(),
    AgmCoreModule.forRoot({
    apiKey: 'AIzaSyAnnU9xaS_i8x4_Ou9CZwVsVQX02RlxPlM'
    })
  ],
  providers: [ VehiclesService, WatchesService, GuardService ],
  entryComponents: [ PopupVehicleComponent, PopupWatchComponent ],
  declarations: [ AppComponent,
      MonitoringComponent,
      MapGoogleComponent,
      MapOsmComponent,
      PopupVehicleComponent,
      PopupWatchComponent,
      HeaderComponent, AsideComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
