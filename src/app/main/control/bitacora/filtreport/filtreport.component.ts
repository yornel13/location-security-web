import {Component, ComponentFactoryResolver, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { BitacoraService } from '../../../../../model/bitacora/bitacora.service';
import { Bitacora } from '../../../../../model/bitacora/bitacora';
import { GuardService } from '../../../../../model/guard/guard.service';
import { IncidenciasService } from '../../../../../model/incidencias/incidencia.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';
import {AuthenticationService} from '../../../../_services';
import {Admin} from '../../../../../model/admin/admin';
import {GlobalOsm} from '../../../../global.osm';
import {UtilsVehicles} from '../../../../../model/vehicle/vehicle.utils';
import {PopupReportComponent} from './popup.report.component';
import {MessagingService} from '../../../../shared/messaging.service';
import {NotificationService} from '../../../../shared/notification.service';
import {ApiResponse} from '../../../../../model/app.response';

@Component({
    selector: 'app-filtreport',
    templateUrl: './filtreport.component.html',
    styleUrls: ['./filtreport.component.css']
})
export class FiltreportComponent implements OnInit {
    /* general */
    reportes: any = [];
    data: any = [];
    open: any = [];
    reopen: any = [];
    report: any = [];
    comentarios: any = [];
    coment: any = [];
    resolved: number = 0;
    change: any = [];
    incidencias: any = [];
    inciden: any = [];
    incidenSelect: number = 0;
    haycomentarios: boolean = false;
    valueDate: any = [];
    dateSelect: any = '';
    guardiaSelect: number = 0;
    filtroSelect = 0;
    guardias: any = [];
    guard: any = [];
    /* vistas */
    lista: boolean;
    detalle: boolean;
    /* comentario */
    newcoment: string = '';
    addcomment: boolean = false;
    /* status */
    status = 0;
    numElement: number = 10;
    /* new chart */
    dataSource: any = {};
    valores: number[] = [2,2];
    names: string[] = ["Robo", "Incendio"];
    datos: any = [{"label": "Robo",
        "value": 2},
        {"label": "Incendio",
            "value": 2}];
    /* exportaciones */
    contpdf:any = [];
    info: any = [];
    /* order table */
    key: string = 'id';
    reverse: boolean = false;
    /* filter chart */
    rangeday:boolean = true;
    desde:string = "";
    hasta:string = "";
    chartreportes:any = [];
    chartdata:any = [];
    isLoading = false;
    resultListSelected = [];

    //map
    map: any;
    mapchart: any;
    lat:number= -2.0000;
    lng:number = -79.0000;
    viewmap:boolean = false;

    //fechas
    desde2:any = "";
    hasta2:any = "";
    rangeday2:boolean=true;
    date:any;
    month2:any;
    day2:any;

    //dropdow
    dropdownList1 = [];
    selectedIncidencias = [];
    dropdownSettings1 = {};

    dropdownList2 = [];
    selectedGuardias = [];
    dropdownSettings2 = {};

    zoom;
    center = L.latLng(([ this.lat, this.lng ]));
    marker = L.marker([this.lat, this.lng], {draggable: false});
    markerClusterData: any[] = [];
    markerClusterOptions: L.MarkerClusterGroupOptions;
    layersControlOptions;
    baseLayers;
    options;
    private selectReport: any;

    constructor(
            private resolver: ComponentFactoryResolver,
            private globalOSM: GlobalOsm,
            private injector: Injector,
            private utilVehicle: UtilsVehicles,
            public router: Router,
            private bitacoraService: BitacoraService,
            private guardiaService: GuardService,
            private incidenciaService: IncidenciasService,
            private excelService: ExcelService,
            private route: ActivatedRoute,
            private messagingService: MessagingService,
            private notificationService: NotificationService,
            private authService: AuthenticationService) {
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = this.globalOSM.defaultOptions;
        this.getIncidencias();
        this.getToday();
        this.getGuardias();
        this.setupDropdown1();
        this.setupDropdown2();
        this.lista = true;
        this.detalle = false;
        this.dataSource = {
            chart: {
                "yAxisName": "Cantidad de reportes",
                "yAxisMaxValue": 5
            },
            // Chart Data
            "data": this.datos
        };
        this.notificationService.newReply.subscribe(reply => {
            if (this.detalle) {
                if (+this.report.id === +reply.report_id) {
                    this.coment.unshift(reply);
                }
            }
        });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                if (this.detalle) {
                    this.getComments(this.report.id);
                }
            }
        });
        this.sort('create_date');
    }

    onMapReady(map: L.Map) {
        this.map = map;
        this.globalOSM.setupLayer(this.map);
        this.zoom = this.globalOSM.fullZoom;
        this.center = L.latLng(([ this.lat, this.lng ]));
        this.marker = L.marker([this.lat, this.lng], { icon: L.icon({iconUrl: './assets/alerts/report.png'})} );
        this.marker.addTo(this.map);
    }

    onMapReadyChart(map: L.Map) {
        this.mapchart = map;
        this.globalOSM.setupLayer(this.mapchart);
        this.center = this.globalOSM.center;
        this.zoom = this.globalOSM.zoom;
        const southWest = new L.LatLng(-2.100599, -79.560921);
        const northEast = new L.LatLng(-2.030906, -79.568947);
        const bounds = new L.LatLngBounds(southWest, northEast);
        const data: any[] = [];
        if (this.data.length) {
            const coors = [];
            this.data.forEach((report: any) => {
                const lat = Number(report.latitude);
                const lng = Number(report.longitude);
                const maker = L.marker([lat, lng], {icon: L.icon({iconUrl: './assets/alerts/report.png'})});
                const factory = this.resolver.resolveComponentFactory(PopupReportComponent);
                const component = factory.create(this.injector);
                const popupContent = component.location.nativeElement;
                component.instance.report = report;
                component.changeDetectorRef.detectChanges();
                maker.bindPopup(popupContent).openPopup();
                data.push(maker);
                coors.push({latitude: lat, longitude: lng});
                bounds.extend(maker.getLatLng());
            });
            this.mapchart.fitBounds(bounds);
            const geoCenter = geolib.getCenter(coors);
            this.center = L.latLng([geoCenter.latitude, geoCenter.longitude]);
        }
        this.markerClusterData = data;
    }

    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    selectRange(id) {
        if (id == 1) {
            this.rangeday2 = true;
            this.desde2 = "";
            this.hasta2 = "";
            this.dismissLoading();
            this.getSearch();
        } else {
            this.rangeday2 = false;
            this.desde2 = "";
            this.hasta2 = "";
            this.dismissLoading();
            this.getSearch();
        }
    }

    selectRange2(id){
        if(id == 1){
            this.rangeday = true;
            this.desde = "";
            this.hasta = "";
            this.getChartDate();
        }else{
            this.rangeday = false;
            this.desde = "";
            this.hasta = "";
            this.getChartDate();
        }
    }

    getToday(){
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth()+1;
        var year = d.getFullYear();

        if(day < 10){
            this.day2 = "0"+day;
        }else{
            this.day2 = day;
        }

        if(month < 10){
            this.month2 = "0"+month;
        }else{
            this.month2 = month;
        }

        this.date = year+"-"+this.month2+"-"+this.day2;
        this.desde2 = this.date;

        this.getSearch();
    }

    showLoading() {
        this.isLoading = true;
        this.data = [];
    }

    dismissLoading() {
        this.isLoading = false;
    }

    countInciden(data){
        var value = []
        if(data.length == 0){
            value = [];
            return value;
        }else{
            for(var j=0; j<this.incidencias.total; j++){
                var hola = 0;
                for(var i=0; i<data.length; i++){
                    if(data[i].incidence_id == this.inciden[j].id){
                        hola++;
                    }
                }
                value[j] = hola;
            }
            return value;
        }
    }

    countIncidenDate(data){
        var value = []

        var fecha1 = String(this.desde);
        var valueDate1 = fecha1.split('-');
        var year1 = valueDate1[0];
        var month1 = valueDate1[1];
        var day1 = valueDate1[2];

        var fecha2 = String(this.hasta);
        var valueDate2 = fecha2.split('-');
        var year2 = valueDate2[0];
        var month2 = valueDate2[1];
        var day2 = valueDate2[2];

        var date1 = fecha1.replace('-','');
        var date11 = Number(date1.replace('-',''));
        var date2 = fecha2.replace('-','');
        var date22 = Number(date2.replace('-',''));

        if(data.length == 0){
            value = [];
            return value;
        }else{
            for(var j=0; j<this.incidencias.total; j++){
                var hola = 0;
                for(var i=0; i<data.length; i++){
                    var date = String(this.chartdata[i].create_date);
                    var valueDate = date.split(' ');
                    var fecha = valueDate[0].toString();
                    var fecha1 = fecha.replace('-','');
                    var fecha11 = Number(fecha1.replace('-',''));
                    console.log(fecha11);
                    console.log(date11);
                    console.log(date22);

                    if(fecha11 >= date11 && fecha11 <= date22){
                        if(data[i].incidence_id == this.inciden[j].id){
                            hola++;
                        }
                    }
                }
                value[j] = hola;
            }
            return value;
        }
    }

    nameInciden(){
        var name = [];
        for(var i=0; i<this.incidencias.total; i++){
            name[i] = this.inciden[i].name;
        }
        return name;
    }

    getChartDate(){
        var fecha1 = String(this.desde);
        var valueDate1 = fecha1.split('-');
        var year1 = valueDate1[0];
        var month1 = valueDate1[1];
        var day1 = valueDate1[2];

        var fecha2 = String(this.hasta);
        var valueDate2 = fecha2.split('-');
        var year2 = valueDate2[0];
        var month2 = valueDate2[1];
        var day2 = valueDate2[2];

        var date1 = fecha1.replace('-','');
        var date11 = Number(date1.replace('-',''));
        var date2 = fecha2.replace('-','');
        var date22 = Number(date2.replace('-',''));

        if(this.rangeday){
            if(this.desde == ""){
                this.bitacoraService.getAll().then(
                    success => {
                        this.chartreportes = success;
                        this.chartdata = this.chartreportes.data;
                        //chart
                        var hola = [];
                        var nombres = [];
                        var valores = [];
                        nombres = this.nameInciden();
                        valores = this.countInciden(this.chartdata);
                        for(var i=0; i<this.incidencias.total; i++){
                            if(nombres[i] != "General"){
                                hola.push({"label":nombres[i], "value":valores[i]})
                            }
                        }
                        this.datos = hola;
                        this.dataSource.data = hola;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
            }else{
                this.bitacoraService.getByDate(year1, month1, day1, year1, month1, day1).then(
                    success => {
                        this.chartreportes = success;
                        this.chartdata = this.chartreportes.data;
                        //chart
                        var hola = [];
                        var nombres = [];
                        var valores = [];
                        nombres = this.nameInciden();
                        valores = this.countInciden(this.chartdata);
                        for(var i=0; i<this.incidencias.total; i++){
                            if(nombres[i] != "General"){
                                hola.push({"label":nombres[i], "value":valores[i]})
                            }
                        }
                        this.datos = hola;
                        this.dataSource.data = hola;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
            }
        }else{
            if(this.desde == ""){
                this.hasta = "";
                this.bitacoraService.getAll().then(
                    success => {
                        this.chartreportes = success;
                        this.chartdata = this.chartreportes.data;
                        //chart
                        var hola = [];
                        var nombres = [];
                        var valores = [];
                        nombres = this.nameInciden();
                        valores = this.countInciden(this.chartdata);
                        for(var i=0; i<this.incidencias.total; i++){
                            if(nombres[i] != "General"){
                                hola.push({"label":nombres[i], "value":valores[i]})
                            }
                        }
                        this.datos = hola;
                        this.dataSource.data = hola;
                    }, error => {
                        if (error.status === 422) {
                            // on some data incorrect
                        } else {
                            // on general error
                        }
                    }
                );
            }else{
                if(this.hasta != ""){
                    this.bitacoraService.getAll().then(
                        success => {
                            this.chartreportes = success;
                            this.chartdata = this.chartreportes.data;
                            //chart
                            var hola = [];
                            var nombres = [];
                            var valores = [];
                            nombres = this.nameInciden();
                            valores = this.countIncidenDate(this.chartdata);
                            for(var i=0; i<this.incidencias.total; i++){
                                if(nombres[i] != "General"){
                                    hola.push({"label":nombres[i], "value":valores[i]})
                                }
                            }
                            console.log(hola);
                            this.datos = hola;
                            this.dataSource.data = hola;
                        }, error => {
                            if (error.status === 422) {
                                // on some data incorrect
                            } else {
                                // on general error
                            }
                        }
                    );
                }
            }
        }
    }

    viewDetail(selectReport) {
        this.selectReport = selectReport;
        this.bitacoraService.getId(selectReport.id).then(
            success => {
                this.report = success;
                this.report.latitude = this.lat = Number(this.report.latitude);
                this.report.longitude = this.lng = Number(this.report.longitude);
                this.lista = false;
                this.detalle = true;
                this.zoom = this.globalOSM.fullZoom;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );

        this.getComments(selectReport.id);
    }

    getComments(id) {
        this.bitacoraService.getComentarios(id).then(success => {
                this.comentarios = success;
                this.coment = this.comentarios.data;
                if (this.coment.length == 0) {
                    this.haycomentarios = false;
                } else {
                    this.haycomentarios = true;
                }
                this.putReportRead(id);
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    putReportRead(id) {
        if (this.coment.length > 0) {
            this.bitacoraService.putReportRead(id).then(success => {
                this.messagingService.loadUnreadReplies();
            });
        }
    }

    regresar() {
        this.lista = true;
        this.detalle = false;
        this.viewmap = false;
    }

    changeResolve(report, resolved) {
        if (resolved == 0) {
            this.bitacoraService.setReopen(report.id).then(
                (success: ApiResponse) => {
                    report.resolved = success.result.resolved;
                    this.selectReport.resolved = success.result.resolved;
                }, error => {
                    if (error.status === 422) {
                        // on some data incorrect
                    } else {
                        // on general error
                    }
                }
            );
        } else {
            this.bitacoraService.setClose(report.id).then(
                (success: ApiResponse) => {
                    report.resolved = success.result.resolved;
                    this.selectReport.resolved = success.result.resolved;
                }, error => {
                    if (error.status === 422) {
                        // on some data incorrect
                    } else {
                        // on general error
                    }
                }
            );
        }
    }

    getIncidencias() {
        this.incidenciaService.getAll().then(
            success => {
                this.incidencias = success;
                this.inciden = this.incidencias.data;
                const datag = [];
                this.inciden.forEach(inciden => {
                    datag.push({ item_id: inciden.id, item_text: inciden.name });
                });
                this.dropdownList1 = datag;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getGuardias() {
        this.guardiaService.getAll().then(
            success => {
                this.guardias = success;
                this.guard = this.guardias.data;
                const datag = [];
                this.guard.forEach(guard => {
                    datag.push({ item_id: guard.id, item_text: guard.name+' '+guard.lastname });
                });
                this.dropdownList2 = datag;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    selectFilter(filter) {
        if (this.filtroSelect === 1) {
            this.guardiaSelect = 0;
            this.incidenSelect = 0;
            this.dismissLoading();
        } else if (this.filtroSelect === 2) {
            this.incidenSelect = 0;
            this.guardiaSelect = 0;
            this.dismissLoading();
        } else {
            this.incidenSelect = 0;
            this.guardiaSelect = 0;
            this.dismissLoading();
        }
        console.log(this.filtroSelect);
        this.getSearch();
    }

    selectStatus() {
        console.log(this.status);
        this.dismissLoading();
        this.getSearch();
    }

    getSearch() {
        var fecha1 = String(this.desde2);
        var valuesdate1 = fecha1.split('-');
        var year1 = valuesdate1[0];
        var month1 = valuesdate1[1];
        var day1 = valuesdate1[2];

        var fecha2 = String(this.hasta2);
        var valuesdate2 = fecha2.split('-');
        var year2 = valuesdate2[0];
        var month2 = valuesdate2[1];
        var day2 = valuesdate2[2];

        var guardia = this.selectedGuardias;
        var incidencia = this.selectedIncidencias;

        // sin filtrar
        if (this.filtroSelect == 0) {
            if (this.desde2 == '') {
                this.data = [];
            } else {
                if (this.rangeday2) {
                    if (this.status == 0) {
                        this.showLoading();
                        this.bitacoraService.getByDate(year1, month1, day1, year1, month1, day1)
                            .then(this.onListReportsSuccess.bind(this), this.onListReportsFailure.bind(this));
                    } else if (this.status == 1) {
                        this.showLoading();
                        this.bitacoraService.getOpenDate(year1, month1, day1, year1, month1, day1)
                            .then(this.onListReportsSuccess.bind(this), this.onListReportsFailure.bind(this));
                    } else if (this.status == 2) {
                        this.showLoading();
                        this.bitacoraService.getCloseDate(year1, month1, day1, year1, month1, day1)
                            .then(this.onListReportsSuccess.bind(this), this.onListReportsFailure.bind(this));
                    }
                } else {
                    if (this.hasta2 === '') {
                        this.data = [];
                    } else {
                        if (this.status == 0) {
                            this.showLoading();
                            this.bitacoraService.getByDate(year1, month1, day1, year2, month2, day2)
                                .then(this.onListReportsSuccess.bind(this), this.onListReportsFailure.bind(this));
                        } else if (this.status == 1) {
                            this.showLoading();
                            this.bitacoraService.getOpenDate(year1, month1, day1, year2, month2, day2)
                                .then(this.onListReportsSuccess.bind(this), this.onListReportsFailure.bind(this));
                        } else if (this.status == 2) {
                            this.showLoading();
                            this.bitacoraService.getCloseDate(year1, month1, day1, year2, month2, day2)
                                .then(this.onListReportsSuccess.bind(this), this.onListReportsFailure.bind(this));
                        }
                    }
                }
            }
        }

        // incidencia
        if (this.filtroSelect == 1) {
            if (this.desde2 == '') {
                this.data = [];
            } else {
                if (this.rangeday2) {
                    if (this.status == 0) {
                        if (incidencia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for (var i = 0; i < incidencia.length; i++) {
                                this.bitacoraService
                                    .getByIncidenciaDate(incidencia[i].item_id, year1, month1, day1, year1, month1, day1)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    } else if (this.status == 1) {
                        if (incidencia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for (var i = 0; i < incidencia.length; i++) {
                                this.bitacoraService
                                    .getByIncidenciaOpenDate(incidencia[i].item_id, year1, month1, day1, year1, month1, day1)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    } else if (this.status == 2) {
                        if (incidencia.length === 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for (var i = 0; i < incidencia.length; i++) {
                                this.bitacoraService
                                    .getByIncidenciaCloseDate(incidencia[i].item_id, year1, month1, day1, year1, month1, day1)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    }
                } else {
                    if (this.hasta2 === '') {
                        this.data = [];
                    } else if (this.status == 0) {
                        if (incidencia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for(var i = 0; i < incidencia.length; i++) {
                                this.bitacoraService
                                    .getByIncidenciaDate(incidencia[i].item_id, year1, month1, day1, year2, month2, day2)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    } else if (this.status == 1) {
                        if (incidencia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for (var i = 0; i < incidencia.length; i++) {
                                this.bitacoraService
                                    .getByIncidenciaOpenDate(incidencia[i].item_id, year1, month1, day1, year2, month2, day2)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    } else if (this.status == 2) {
                        if (incidencia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for(var i = 0; i < incidencia.length; i++) {
                                this.bitacoraService
                                    .getByIncidenciaCloseDate(incidencia[i].item_id, year1, month1, day1, year2, month2, day2)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    }
                }
            }
        }

        // guardias
        if (this.filtroSelect == 2) {
            if (this.desde2 == '') {
                this.data = [];
            } else {
                if (this.rangeday2) {
                    if (this.status == 0){
                        if (guardia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for (var i = 0; i < guardia.length; i++) {
                                this.bitacoraService.getByGuardiaDate(guardia[i].item_id, year1, month1, day1, year1, month1, day1)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    } else if (this.status == 1) {
                        if (guardia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for (var i = 0; i < guardia.length; i++) {
                                this.bitacoraService.getByGuardiaOpenDate(guardia[i].item_id, year1, month1, day1, year1, month1, day1)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    } else if (this.status == 2) {
                        if (guardia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for (var  i = 0; i < guardia.length; i++) {
                                this.bitacoraService.getByGuardiaCloseDate(guardia[i].item_id, year1, month1, day1, year1, month1, day1)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    }
                } else {
                    if (this.hasta2 === '') {
                        this.data = [];
                    } else if (this.status == 0) {
                        if (guardia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for(var i = 0; i < guardia.length; i++) {
                                this.bitacoraService.getByGuardiaDate(guardia[i].item_id, year1, month1, day1, year2, month2, day2)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    } else if (this.status == 1) {
                        if (guardia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for(var i = 0; i < guardia.length; i++) {
                                this.bitacoraService.getByGuardiaOpenDate(guardia[i].item_id, year1, month1, day1, year2, month2, day2)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    } else if (this.status == 2) {
                        if (guardia.length == 0) {
                            this.data = [];
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for(var i = 0; i < guardia.length; i++) {
                                this.bitacoraService.getByGuardiaCloseDate(guardia[i].item_id, year1, month1, day1, year2, month2, day2)
                                    .then(this.onListReportsBySelectedListSuccess.bind(this), this.onListReportsFailure.bind(this));
                            }
                        }
                    }
                }
            }
        }

    }

    onListReportsBySelectedListSuccess(success) {
        this.reportes = success;
        this.resultListSelected = this.resultListSelected.concat(this.reportes.data);
        this.data = this.resultListSelected;
        for (var i = 0; i < this.data.length; i++) {
            this.data[i].id = Number(this.data[i].id);
        }
        this.dismissLoading();
    }

    onListReportsSuccess(success) {
        if (this.isLoading) {
            this.reportes = success;
            this.data = this.reportes.data;
            this.dismissLoading();
        }
    }

    onListReportsFailure(error) {
        if (this.isLoading) {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
            this.dismissLoading();
        }
    }

    agregarComentario() {
        this.addcomment = true;
    }

    guardarComentario(report_id) {
        const admin: Admin = this.authService.getUser();
        const useradmin = admin.name + ' ' + admin.lastname;
        const idAdmin = admin.id;
        const report = report_id;
        const comentario = this.newcoment;
        const nuevocom: Bitacora = {
            report_id: report,
            text: comentario,
            admin_id: idAdmin,
            user_name: useradmin,
        };
        this.bitacoraService.addCommetario(nuevocom).then(
            success => {
                this.viewDetail(report_id);
                this.addcomment = false;
                this.newcoment = '';
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    //configuración de los selects
    onItemSelect1 (item:any) {
        this.getSearch();
    }

    onItemDeSelect1(item:any){
        this.getSearch();
    }

    setupDropdown1() {
        this.dropdownList1 = [];
        this.selectedIncidencias = [];
        this.dropdownSettings1 = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            searchPlaceholderText: 'Buscar Incidencia',
            itemsShowLimit: 3,
            allowSearchFilter: true,
            enableCheckAll: false,
        };
    }
    //configuración de los selects
    onItemSelect2 (item:any) {
        this.getSearch();
    }

    onItemDeSelect2 (item:any){
        this.getSearch();
    }

    setupDropdown2() {
        this.dropdownList2 = [];
        this.selectedGuardias = [];
        this.dropdownSettings2 = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            searchPlaceholderText: 'Buscar Guardia',
            itemsShowLimit: 1,
            allowSearchFilter: true,
            enableCheckAll: false,
        };
    }

    getMapAlertas() {
        this.zoom = this.globalOSM.zoom;
        this.lista = false;
        this.viewmap = true;
    }

    setupPdfAndExcelData() {
        const body = [];
        const excel = [];
        let resolve = '';
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].id = Number(this.data[i].id);
            if (this.data[i].resolved === 0) {
                resolve = 'Cerrado';
            } else {
                resolve = 'Abierto';
            }
            excel.push({
                'Puesto' : this.data[i].watch.stand_name,
                'Título': this.data[i].title,
                'Observación': this.data[i].observation,
                'Fecha': this.data[i].create_date,
                'Estado': resolve
            });
            body.push([
                this.data[i].watch.stand_name,
                this.data[i].title,
                this.data[i].observation,
                this.data[i].create_date,
                resolve
            ]);
        }
        this.contpdf = body;
        this.info = excel;
    }

    pdfDownload() {
        this.setupPdfAndExcelData();
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todos los Reportes', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['Puesto', 'Título', 'Observación', 'Fecha', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 20},
                1: {cellWidth: 24},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 20},
                4: {cellWidth: 20}
            }
        });
        doc.save('reportes.pdf');
    }

    excelDownload() {
        this.setupPdfAndExcelData();
        this.excelService.exportAsExcelFile(this.info, 'reportes');
    }

    print() {
        this.setupPdfAndExcelData();
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todos los Reportes', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['Puesto', 'Título', 'Observación', 'Fecha', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 20},
                1: {cellWidth: 24},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 20},
                4: {cellWidth: 20}
            }
        });
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

    async getPdfDetails(type: number) { // 1: for save pdf, 2 for show print
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        doc.text('Reporte Abierto', 15, 27)
        doc.text('Hora de impresión: ' + fecha, 15, 34);
        // inserting data
        doc.setTextColor(0);
        doc.setFontType('bold');
        doc.text('Fecha de creación: ', 15, 43);
        doc.setFontType('normal');
        doc.text(this.report.create_date, 58, 43);

        doc.setTextColor(0);
        doc.setFontType('bold');
        doc.text('Incidencia: ', 15, 50);
        doc.setFontType('normal');
        doc.text(this.report.title, 42, 50);

        doc.setFontType("bold");
        doc.text('Observación: ', 15, 57);
        doc.setFontType("normal");
        var splitTitle = doc.splitTextToSize(this.report.observation, 120);
        // doc.text(15, 20, splitTitle);
        doc.text(splitTitle, 50, 57);

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 71);
        doc.setFontType("normal");
        doc.text(this.report.latitude.toString(), 36, 71);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 71);
        doc.setFontType("normal");
        doc.text(this.report.longitude.toString(), 123, 71);

        let extraTop = 0;

        if (this.report.image_1) {
            let marginLeft = 15;
            const marginTop = 79;
            marginLeft = await this.getReportPhoto(this.report.image_1, doc, marginLeft, marginTop);
            marginLeft = await this.getReportPhoto(this.report.image_2, doc, marginLeft, marginTop);
            await this.getReportPhoto(this.report.image_3, doc, marginLeft, marginTop);
            extraTop = 40;
        }
        if (this.report.image_4) {
            let marginLeft = 15;
            const marginTop = 118;
            marginLeft = await this.getReportPhoto(this.report.image_4, doc, marginLeft, marginTop);
            await this.getReportPhoto(this.report.image_5, doc, marginLeft, marginTop);
            extraTop = 80;
        }
        // guardia
        doc.line(10, 77 + extraTop, 200, 77 + extraTop);

        doc.setFontType("bold");
        doc.text('Guardia', 15, 84 + extraTop);

        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 91 + extraTop);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard.name, 34, 91 + extraTop);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 91 + extraTop);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard.lastname, 123, 91 + extraTop);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 98 + extraTop);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard.dni, 34, 98 + extraTop);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 98 + extraTop);
        doc.setFontType("normal");
        doc.text(this.report.watch.guard.email, 119, 98 + extraTop);

        doc.setFontType("bold");
        doc.text('Puesto: ', 15, 105 + extraTop);
        doc.setFontType("normal");
        doc.text(this.report.watch.stand_name, 34, 105 + extraTop);
        doc.line(10, 112 + extraTop, 200, 112 + extraTop);
        for (var i = 0; i < this.coment.length; i++) {
            doc.setFontType("bold");
            doc.text('Comentario: #' + (i + 1) + ' ', 15, (119 + i * (14)) + extraTop);
            doc.setFontType("normal");
            doc.text(this.coment[i].text, 50, (119 + i * (14)) + extraTop);
            doc.setFontType("bold");
            doc.text('Usuario: ', 100, (119 + i * (14)) + extraTop);
            doc.setFontType("normal");
            doc.text(this.coment[i].user_name, 119, (119 + i * (14)) + extraTop);
        }
        if (type === 1) {
            doc.save('reporteabiertoDetail.pdf');
        }
        if (type === 2) {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }
    }

    async getReportPhoto(url: string, doc: jsPDF, marginLeft: number, marginTop: number) {
        if (url) {
            let photo = null;
            await this.toDataURL(url).then(dataUrl => {
                photo = dataUrl;
            });
            const img1 = new Image();
            const promise = new Promise(function (resolve, reject) {
                img1.onload = () => {
                    const height = 35;
                    const width = img1.width / (img1.height / height);
                    doc.addImage(photo, 'JPEG', marginLeft, marginTop, width, height);
                    resolve(photo);
                    marginLeft =  marginLeft + width + 5;
                };
            });
            img1.src = String(photo);
            await promise.then();
        }
        return marginLeft;
    }

    toDataURL = url => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        }))

    pdfDetalle() {
        this.getPdfDetails(1).then();
    }

    printDetalle() {
        this.getPdfDetails(2).then();
    }

    excelDetalle() {
        var excel = [];
        excel = [{
            'Incidencia' : this.report.title,
            'Observacion' : this.report.observation,
            'Latitud': this.report.latitude.toString(),
            'Longitud': this.report.longitude.toString(),
            'Fecha': this.report.create_date
        }];
        excel.push({
            'Incidencia': 'Guardia'
        });
        excel.push({
            'Incidencia': 'Nombre',
            'Observacion': 'Apellido',
            'Latitud': 'Cédula',
            'Longitud': 'Correo'});
        excel.push({
            'Incidencia': this.report.watch.guard.name,
            'Observacion': this.report.watch.guard.lastname,
            'Latitud': this.report.watch.guard.dni,
            'Longitud': this.report.watch.guard.email});
        excel.push({
            'Incidencia': 'Comentarios'
        });
        for(var i=0; i < this.coment.length; i++) {
            excel.push({
                'Incidencia': this.coment[i].text,
                'Observacion': this.coment[i].user_name});
        }
        this.excelService.exportAsExcelFile(excel, 'reporteabiertodetail');
    }

    public doughnutChartType:string = 'doughnut';
    public doughnutColors:any[] = [{ backgroundColor: ['#dc3545', '#ffc107'] }]

    ngOnInit() {
        this.route.url.subscribe(value => {
            const reportId = value[value.length - 1].path;
            if (Number(reportId)) {
                this.viewDetail(reportId);
            }
        });
    }
}
