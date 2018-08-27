import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { CommonModule } from '@angular/common';

import {PopupVehicleComponent} from './monitoring/map/popup.vehicle.component';
import {PopupWatchComponent} from './monitoring/map/popup.watch.component';

import { VehiclesService } from '../../model/vehicle/vehicle.service';
import { WatchesService } from '../../model/watch/watch.service';
import {CardVehicleComponent} from './monitoring/aside/card.vehicle.component';
import {CardTabletComponent} from './monitoring/aside/card.tablet.component';

import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { FusionChartsModule } from 'angular-fusioncharts';
import FusionCharts from 'fusioncharts/core';
import Doughnut2D from 'fusioncharts/viz/doughnut2d';
FusionChartsModule.fcRoot(FusionCharts, Doughnut2D);

// My Modulus
import { MonitoringComponent } from './monitoring/monitoring.component';
import { MapOsmComponent } from './monitoring/map/map.osm';
import { HeaderComponent } from './header/header.component';
import { AsideComponent } from './monitoring/aside/aside.component';
import { MainComponent } from './main.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportComponent } from './report/report.component';
import {RouterModule, Routes} from '@angular/router';
import {AsideService} from './monitoring/aside/aside.service';
import { MessagingComponent } from './messaging/messaging.component';

import { FilterPipe } from './monitoring/aside/filter.pipe';
import { FilterPipeModule } from 'ngx-filter-pipe';
import {TabletService} from '../../model/tablet/tablet.service';
import {ControlModule} from './control/control.module';
import {CardAlertComponent} from './monitoring/aside/card.alert.component';

const mainRoutes: Routes = [
    { path: '', component: MainComponent,
        children: [
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent },
                    { path: 'monitoring', component: MonitoringComponent },
                    { path: 'control', loadChildren: () => ControlModule },
                    { path: 'messaging', component: MessagingComponent },
                    { path: 'report', component: ReportComponent },
                    { path: '', redirectTo: '/u/dashboard', pathMatch: 'full' },
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
    ReactiveFormsModule,
    mainRouting,
    ChartsModule,
    FusionChartsModule,
    FilterPipeModule,
    LeafletModule.forRoot(),
    LeafletMarkerClusterModule.forRoot(),
    LeafletDrawModule.forRoot(),
    ControlModule,
  ],
  providers: [
      VehiclesService, WatchesService, AsideService, TabletService ],
  entryComponents: [ PopupVehicleComponent, PopupWatchComponent, CardVehicleComponent,
      CardTabletComponent ],
  declarations: [
      MonitoringComponent, MapOsmComponent, PopupVehicleComponent, PopupWatchComponent,
      HeaderComponent, AsideComponent, MainComponent,
      DashboardComponent, ReportComponent, MessagingComponent,
      CardVehicleComponent, CardTabletComponent, FilterPipe, CardAlertComponent
  ],
  bootstrap: [ MainComponent ]
})
export class MainModule {}
