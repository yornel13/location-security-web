import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { CommonModule } from '@angular/common';

import {PopupVehicleComponent} from './monitoring/map/popup.vehicle.component';
import {PopupWatchComponent} from './monitoring/map/popup.watch.component';

import { VehiclesService } from '../../model/vehicle/vehicle.service';
import { TabletService } from '../../model/tablet/tablet.service';
import { WatchesService } from '../../model/watch/watch.service';
import { GuardService } from '../../model/guard/guard.service';
import { AdminService } from '../../model/admin/admin.service';
import { VisitaVehiculoService } from '../../model/visitavehiculo/visitavehiculo.service';
import { VisitanteService } from '../../model/vistavisitantes/visitantes.service';
import { FuncionarioService } from '../../model/funcionarios/funcionario.service';
import { IncidenciasService } from '../../model/incidencias/incidencia.service';

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
import { MessagingComponent } from './messaging/messaging.component';
import { GuardiaComponent } from './control/guardia/guardia.component';
import { VehiculosComponent } from './visitas/vehiculos/vehiculos.component';
import { VisitantesComponent } from './visitas/visitantes/visitantes.component';
import { FuncionariosComponent } from './visitas/funcionarios/funcionarios.component';
import { IncidenciasComponent } from './control/bitacora/incidencias/incidencias.component';
import {CardVehicleComponent} from './monitoring/aside/card.vehicle.component';
import {CardTabletComponent} from './monitoring/aside/card.tablet.component';

const mainRoutes: Routes = [
    { path: '', component: MainComponent,
        children: [
            {
                path: '',
                children: [
                    { path: 'dashboard', component: DashboardComponent },
                    { path: 'monitoring', component: MonitoringComponent },
                    { path: 'control', component: ControlComponent },
                    { path: 'control/guardia', component: GuardiaComponent },
                    { path: 'control/visitas/vehiculos', component: VehiculosComponent },
                    { path: 'control/visitas/visitantes', component: VisitantesComponent },
                    { path: 'control/visitas/funcionarios', component: FuncionariosComponent },
                    { path: 'control/bitacora/incidencias', component: IncidenciasComponent },
                    { path: 'messaging', component: MessagingComponent },
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
  providers: [ VehiclesService, WatchesService, GuardService, AdminService, AsideService, VisitaVehiculoService,
      VisitanteService, FuncionarioService, IncidenciasService, TabletService ],
  entryComponents: [ PopupVehicleComponent, PopupWatchComponent, CardVehicleComponent, CardTabletComponent ],
  declarations: [
      MonitoringComponent,
      MapOsmComponent,
      PopupVehicleComponent,
      PopupWatchComponent,
      HeaderComponent, AsideComponent, MainComponent, ControlComponent, DashboardComponent, ReportComponent,
      MessagingComponent, GuardiaComponent, VehiculosComponent, VisitantesComponent, FuncionariosComponent,
      IncidenciasComponent, CardVehicleComponent, CardTabletComponent, HeaderComponent,
      AsideComponent, MainComponent, ControlComponent, DashboardComponent, ReportComponent, MessagingComponent ],
  bootstrap: [ MainComponent ]
})
export class MainModule {}
