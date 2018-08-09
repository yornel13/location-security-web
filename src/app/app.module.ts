import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';
import {HTMLMarkerComponent} from './monitoring/map/html-marker.component';

import { AgmCoreModule } from '@agm/core';
import { VehiclesService } from './model/vehicle/vehicle.service';
import { WatchesService } from './model/watch/watch.service';
import { GuardService } from './model/guard/guard.service';

import { HttpClientModule } from '@angular/common/http';

// My Modulus
import { DashComponent } from './monitoring/dash.component';
import { MapGoogleComponent } from './monitoring/map/map.google';
import { MapOsmComponent } from './monitoring/map/map.osm';
import { ApiTestComponent } from './api.test/api.test.component';

@NgModule({
  imports: [
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule, LeafletModule.forRoot(),
    AgmCoreModule.forRoot({
    apiKey: 'AIzaSyAnnU9xaS_i8x4_Ou9CZwVsVQX02RlxPlM'
    })
  ],
  providers: [ VehiclesService, WatchesService, GuardService ],
  entryComponents: [HTMLMarkerComponent],
  declarations: [ AppComponent, DashComponent, MapGoogleComponent, MapOsmComponent, HTMLMarkerComponent, ApiTestComponent ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}
