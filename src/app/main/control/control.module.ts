import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { CommonModule } from '@angular/common';

import { GuardService } from '../../../model/guard/guard.service';
import { AdminService } from '../../../model/admin/admin.service';
import { VisitaVehiculoService } from '../../../model/visitavehiculo/visitavehiculo.service';
import { VisitanteService } from '../../../model/vistavisitantes/visitantes.service';
import { FuncionarioService } from '../../../model/funcionarios/funcionario.service';
import { IncidenciasService } from '../../../model/incidencias/incidencia.service';
import { BitacoraService } from '../../../model/bitacora/bitacora.service';
import { VisitasService } from '../../../model/visitas/visitas.service';

import { HttpClientModule } from '@angular/common/http';

import { ControlComponent } from './control.component';
import {RouterModule, Routes} from '@angular/router';
import { GuardiaComponent } from './guardia/guardia.component';
import { VehiculosComponent } from './visitas/vehiculos/vehiculos.component';
import { VisitantesComponent } from './visitas/visitantes/visitantes.component';
import { FuncionariosComponent } from './visitas/funcionarios/funcionarios.component';
import { IncidenciasComponent } from './bitacora/incidencias/incidencias.component';
import { ReportetsComponent } from './bitacora/reportets/reportets.component';
import { FiltreportComponent } from './bitacora/filtreport/filtreport.component';
import { VisitasComponent } from './visitas/visitas/visitas.component';
import { VisitasactivasComponent } from './visitas/visitasactivas/visitasactivas.component';

import { FilterPipeModule } from 'ngx-filter-pipe';
import {AsideControlComponent} from './aside/aside.control.component';
import {AdminComponent} from './admin/admin.component';

const controlRoutes: Routes = [
    { path: '', component: ControlComponent,
        children: [
            {
                path: '',
                children: [
                    { path: 'admin', component: AdminComponent },
                    { path: 'guardia', component: GuardiaComponent },
                    { path: 'visitas/visitas/todas', component: VisitasComponent },
                    { path: 'visitas/visitas/activas', component: VisitasactivasComponent },
                    { path: 'visitas/vehiculos', component: VehiculosComponent },
                    { path: 'visitas/visitantes', component: VisitantesComponent },
                    { path: 'visitas/funcionarios', component: FuncionariosComponent },
                    { path: 'bitacora/incidencias', component: IncidenciasComponent },
                    { path: 'bitacora/reportes', component: ReportetsComponent },
                    { path: 'bitacora/reportfilter', component: FiltreportComponent },
                    { path: '', redirectTo: '/u/control/admin', pathMatch: 'full' },
                ]
            }
        ]
    }
];

export const controlRouting = RouterModule.forChild(controlRoutes);

@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        FormsModule,
        controlRouting,
        FilterPipeModule,
    ],
    providers: [
        GuardService, AdminService, VisitaVehiculoService, VisitanteService, FuncionarioService,
        IncidenciasService, BitacoraService, VisitasService ],
    entryComponents: [ ],
    declarations: [
        GuardiaComponent, AdminComponent, ControlComponent,
        VehiculosComponent, VisitantesComponent, FuncionariosComponent, IncidenciasComponent,
        ReportetsComponent, FiltreportComponent, VisitasComponent, VisitasactivasComponent,
        AsideControlComponent ],
    bootstrap: [ ControlComponent ]
})
export class ControlModule {}