import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { GuardService } from '../../../model/guard/guard.service';
import { AdminService } from '../../../model/admin/admin.service';
import { VisitaVehiculoService } from '../../../model/visitavehiculo/visitavehiculo.service';
import { VisitanteService } from '../../../model/vistavisitantes/visitantes.service';
import { FuncionarioService } from '../../../model/funcionarios/funcionario.service';
import { IncidenciasService } from '../../../model/incidencias/incidencia.service';
import { BitacoraService } from '../../../model/bitacora/bitacora.service';
import { VisitasService } from '../../../model/visitas/visitas.service';
import { ConfiguracionService } from '../../../model/configuracion/configuracion.service';
import { BannerService } from '../../../model/banner/banner.service';
import { AlertaService } from '../../../model/alerta/alerta.service';
import { ExcelService } from '../../../model/excel/excel.services';
import { VehistorialService } from '../../../model/historial/vehistorial.service';
import { TabhistoryService } from '../../../model/historial/tabhistory.service';
import { SalidascercoService } from '../../../model/historial/salidacerco.service';

import { HttpClientModule } from '@angular/common/http';
import { ColorPickerModule } from 'ngx-color-picker';
import {NgxPaginationModule} from 'ngx-pagination';
import { ChartsModule } from 'ng2-charts';
import { FusionChartsModule } from 'angular-fusioncharts';
import FusionCharts from 'fusioncharts/core';
import Doughnut2D from 'fusioncharts/viz/doughnut2d';
FusionChartsModule.fcRoot(FusionCharts, Doughnut2D);

import { IgxSnackbarModule } from 'igniteui-angular';
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
import {VehiculostiposComponent} from './visitas/vehiculostipos/vehiculostipos.component';
import {VehiclestypesService} from '../../../model/vehicletsypes/vehiclestypes.service';

import { FilterPipeModule } from 'ngx-filter-pipe';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { OrderModule } from 'ngx-order-pipe';

import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import {AsideControlComponent} from './aside/aside.control.component';
import {AdminComponent} from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { WactivasComponent } from './watches/wactivas/wactivas.component';
import { WtodasComponent } from './watches/wtodas/wtodas.component';
import { MvisitasComponent } from './subhome/mvisitas/mvisitas.component';
import { MbitacoraComponent } from './subhome/mbitacora/mbitacora.component';
import { MvigilanciaComponent } from './subhome/mvigilancia/mvigilancia.component';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import {CercoComponent} from './cerco/cercovirtual/cerco.component';
import { AlertasComponent } from './alertas/alertas.component';
import {CercoService} from '../../../model/cerco/cerco.service';
import {GrupoService} from '../../../model/grupos/grupo.service';
import { PuestoService } from '../../../model/puestos/puestos.service';
import { CercogrupoComponent } from './cerco/cercogrupo/cercogrupo.component';
import { McercoComponent } from './subhome/mcerco/mcerco.component';
import { TabletsComponent } from './watches/tablets/tablets.component';
import { PuestosComponent } from './watches/puestos/puestos.component';
import { MhistorialComponent } from './subhome/mhistorial/mhistorial.component';
import { VehistorialComponent } from './historial/vehistorial/vehistorial.component';
import { TabhistorialComponent } from './historial/tabhistorial/tabhistorial.component';
import { VehicercohistorialComponent } from './historial/vehicercohistorial/vehicercohistorial.component';
import {PopupHistoryComponent} from './historial/vehistorial/popup.history.component';
import {PopupTablethComponent} from './historial/tabhistorial/popup.tableth.component';
import {PopupReportComponent} from './bitacora/filtreport/popup.report.component';
import {PopupVisitComponent} from './visitas/visitas/popup.visit.component';
import {PopupWatchtComponent} from './watches/wtodas/popup.watcht.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AgoTimePipe } from './ago.pipe';
import {ReportFilterPipe} from './bitacora/report.pipe';
import {VisitPrint} from './visitas/visit.print';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ErrorInterceptor, JwtInterceptor} from '../../_helpers';
import {BusinessService} from '../../../model/business/business.service';
import {EmpresasComponent} from './empresas/empresas.component';
import {MoperaComponent} from './subhome/mopera/mopera.component';
import {DevicesComponent} from './operability/devices/devices.component';
import {OperabilityService} from '../../../model/operability/operability.service';
import {StatisticsComponent} from './operability/statistics/statistics.component';

export const controlRoutes: Routes = [
    { path: '', component: ControlComponent,
        children: [
            {
                path: '',
                children: [
                    { path: 'admin', component: AdminComponent },
                    { path: 'guardia', component: GuardiaComponent },
                    { path: 'alertas', component: AlertasComponent },
                    { path: 'alertas/:id', component: AlertasComponent },
                    { path: 'visitas/visitas/todas', component: VisitasComponent },
                    { path: 'visitas/visitas/activas', component: VisitasactivasComponent },
                    { path: 'visitas/vehiculos', component: VehiculosComponent },
                    { path: 'visitas/visitantes', component: VisitantesComponent },
                    { path: 'visitas/funcionarios', component: FuncionariosComponent },
                    { path: 'visitas/tipos', component: VehiculostiposComponent },
                    { path: 'bitacora/incidencias', component: IncidenciasComponent },
                    { path: 'bitacora/reportes', component: ReportetsComponent },
                    { path: 'bitacora/reportfilter/:id', component: FiltreportComponent },
                    { path: 'bitacora/reportfilter', component: FiltreportComponent },
                    { path: 'vigilancia/activas', component: WactivasComponent },
                    { path: 'vigilancia/todas', component: WtodasComponent },
                    { path: 'vigilancia/tablets', component: TabletsComponent },
                    { path: 'vigilancia/puestos', component: PuestosComponent },
                    { path: 'historial/vehiculos', component: VehistorialComponent },
                    { path: 'historial/tablets', component: TabhistorialComponent },
                    { path: 'historial/vehiculocerco', component: VehicercohistorialComponent },
                    { path: 'empresas', component: EmpresasComponent },
                    { path: 'configuracion', component: ConfiguracionComponent },
                    { path: 'home', component: HomeComponent },
                    { path: 'visitas', component: MvisitasComponent },
                    { path: 'bitacora', component: MbitacoraComponent },
                    { path: 'vigilancia', component: MvigilanciaComponent },
                    { path: 'cerco', component: McercoComponent },
                    { path: 'historial', component: MhistorialComponent },
                    { path: 'operatividad', component: MoperaComponent },
                    { path: 'operatividad/dispositivos', component: DevicesComponent },
                    { path: 'operatividad/estadisticas', component: StatisticsComponent },
                    { path: 'cerco/virtual', component: CercoComponent },
                    { path: 'cerco/grupos', component: CercogrupoComponent },
                    { path: '', redirectTo: '/u/control/home', pathMatch: 'full' }
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
        ChartsModule,
        FusionChartsModule,
        FilterPipeModule,
        ColorPickerModule,
        OrderModule,
        Ng2SearchPipeModule,
        LeafletModule.forRoot(),
        LeafletDrawModule.forRoot(),
        LeafletMarkerClusterModule.forRoot(),
        IgxSnackbarModule,
        NgxPaginationModule,
        NgMultiSelectDropDownModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        GuardService, AdminService, VisitaVehiculoService, VisitanteService,
        FuncionarioService, ExcelService, PuestoService, VehiclestypesService,
        IncidenciasService, BitacoraService, VisitasService, ConfiguracionService,
        BannerService, AlertaService, CercoService, GrupoService, BusinessService,
        VehistorialService, TabhistoryService, SalidascercoService, VisitPrint, OperabilityService ],
    entryComponents: [ PopupHistoryComponent, PopupTablethComponent, PopupReportComponent, PopupVisitComponent, PopupWatchtComponent ],
    declarations: [
        GuardiaComponent, AdminComponent, ControlComponent, VehiculostiposComponent,
        VehiculosComponent, VisitantesComponent, FuncionariosComponent, IncidenciasComponent,
        ReportetsComponent, FiltreportComponent, VisitasComponent, VisitasactivasComponent,
        AsideControlComponent,
        HomeComponent,
        ConfiguracionComponent,
        WactivasComponent,
        WtodasComponent,
        MvisitasComponent,
        MbitacoraComponent,
        MoperaComponent,
        DevicesComponent,
        StatisticsComponent,
        MvigilanciaComponent,
        CercoComponent,
        VehicercohistorialComponent,
        AlertasComponent,
        CercogrupoComponent,
        McercoComponent,
        TabletsComponent,
        PuestosComponent,
        EmpresasComponent,
        MhistorialComponent,
        VehistorialComponent,
        TabhistorialComponent,
        PopupHistoryComponent,
        PopupTablethComponent,
        PopupReportComponent,
        PopupVisitComponent,
        PopupWatchtComponent,
        AgoTimePipe,
        ReportFilterPipe],
    bootstrap: [ ControlComponent ]
})
export class ControlModule {}
