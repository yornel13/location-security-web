import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { CommonModule } from '@angular/common';

import {PopupVehicleComponent} from './monitoring/map/popup.vehicle.component';
import {PopupWatchComponent} from './monitoring/map/popup.watch.component';

import { VehiclesService } from '../../model/vehicle/vehicle.service';
import { WatchesService } from '../../model/watch/watch.service';
import { GuardService } from '../../model/guard/guard.service';

import { HttpClientModule } from '@angular/common/http';

// My Modulus
import { MonitoringComponent } from './monitoring/monitoring.component';
import { MapOsmComponent } from './monitoring/map/map.osm';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './monitoring/aside/aside.component';
import { MainComponent } from './main.component';
import { ControlComponent } from './control/control.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import {RouterModule, Routes} from '@angular/router';
import {AsideService} from './monitoring/aside/aside.service';

const mainRoutes: Routes = [
    { path: '', component: MainComponent,
        children: [
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent },
                    { path: 'monitoring', component: MonitoringComponent },
                    { path: 'control', component: ControlComponent },
                    { path: 'report', component: ReportComponent },
                    { path: '', component: MonitoringComponent }
                ]
            }
        ]
    }
];

export const mainRouting = RouterModule.forChild(mainRoutes);

@NgModule({
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
    mainRouting,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule.forRoot()
  ],
  providers: [ VehiclesService, WatchesService, GuardService, AsideService ],
  entryComponents: [ PopupVehicleComponent, PopupWatchComponent ],
  declarations: [
      MonitoringComponent,
      MapOsmComponent,
      PopupVehicleComponent,
      PopupWatchComponent,
      HeaderComponent, AsideComponent, MainComponent, ControlComponent, DashboardComponent, ReportComponent ],
  bootstrap: [ MainComponent ]
})
export class MainModule {}
