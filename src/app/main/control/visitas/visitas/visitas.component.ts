import {Component, ComponentFactoryResolver, Injector} from '@angular/core';
import { Router } from '@angular/router';
import { VisitasService } from '../../../../../model/visitas/visitas.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import { VisitaVehiculoService } from '../../../../../model/visitavehiculo/visitavehiculo.service';
import { VisitanteService } from '../../../../../model/vistavisitantes/visitantes.service';
import { FuncionarioService } from '../../../../../model/funcionarios/funcionario.service';
import 'jspdf-autotable';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';
import {GlobalOsm} from '../../../../global.osm';
import {UtilsVehicles} from '../../../../../model/vehicle/vehicle.utils';
import {PopupVisitComponent} from './popup.visit.component';
import {VisitPrint} from '../visit.print';
import {ExcelService} from '../../../../../model/excel/excel.services';

@Component({
    selector: 'app-visitas',
    templateUrl: './visitas.component.html',
    styleUrls: ['./visitas.component.css']
})
export class VisitasComponent {
    //general
    visitas:any = undefined;
    data: any[] = undefined;
    visi:any = [];
    modalimg:any = [];
    dateSelect:any = '';
    nomat:boolean;
    //vistas vehiculos
    lista:boolean;
    detalle:boolean;
    //filtro
    filtroSelect:number = 0;
    filtro:number = 1;
    //guardias
    guardias:any = [];
    guard:any = [];
    guardiaSelect:number = 0;
    //vehiculos
    vehiculos:any = [];
    vehi:any = [];
    vehiculoSelect:number=0;
    //visitanta
    visitantes:any = [];
    visit:any = [];
    visitanteSelect:number=0;
    //funcionario
    funcionarios:any = [];
    funcio:any = [];
    funcionarioSelect:number=0;
    valueDate:any = [];
    filter:string;
    numElement:number = 10;
    //exportaciones
    contpdf:any = [];
    info: any = [];

    key: string = 'id'; //set default
    reverse: boolean = true;

    //map
    map: any;
    mapchart: any;
    lat:number= -2.0000;
    lng:number = -79.0000;
    viewmap:boolean = false;

    //fechas
    desde:any = "";
    hasta:any = "";
    rangeday:boolean=true;
    date:any;
    month2:any;
    day2:any;

    //dropdow
    dropdownList1 = [];
    selectedVehiculos = [];
    dropdownSettings1 = {};

    dropdownList2 = [];
    selectedGuardias = [];
    dropdownSettings2 = {};

    dropdownList3 = [];
    selectedVisitantes = [];
    dropdownSettings3 = {};

    dropdownList4 = [];
    selectedFuncionarios = [];
    dropdownSettings4 = {};

    zoom;
    center = L.latLng(([ this.lat, this.lng ]));
    marker = L.marker([this.lat, this.lng], {draggable: false});
    markerOut = L.marker([this.lat, this.lng], {draggable: false});
    markerClusterData: any[] = [];
    markerClusterOptions: L.MarkerClusterGroupOptions;
    layersControlOptions;
    baseLayers;
    options;

    constructor(
            private resolver: ComponentFactoryResolver,
            private globalOSM: GlobalOsm,
            private injector: Injector,
            private utilVehicle: UtilsVehicles,
            public router: Router,
            private visitasService: VisitasService,
            private guardiaService: GuardService,
            private vehiculoService: VisitaVehiculoService,
            private visitanteService: VisitanteService,
            public excelService: ExcelService,
            private funcionarioService: FuncionarioService,
            private visitPrint: VisitPrint) {
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = this.globalOSM.defaultOptions;
        this.lista = true;
        this.detalle = false;
        this.getToday();
        this.getGuard();
        this.getVehiculos();
        this.getVisitantes();
        this.getFuncionarios();
        this.setupDropdown1();
        this.setupDropdown2();
        this.setupDropdown3();
        this.setupDropdown4();
    }

    onMapReady(map: L.Map) {
        this.map = map;
        this.globalOSM.setupLayer(this.map);
        this.zoom = this.globalOSM.fullZoom;
        this.center = L.latLng(([ this.lat, this.lng ]));
        this.marker = L.marker([this.lat, this.lng], { icon: L.icon({iconUrl: './assets/alerts/visit_in.png'})} );
        this.marker.addTo(this.map);
        if (this.visi && this.visi.f_latitude && this.visi.f_longitude) {
            this.markerOut = L.marker([Number(this.visi.f_latitude), this.visi.f_longitude],
                { icon: L.icon({iconUrl: './assets/alerts/visit_out.png'})});
            this.markerOut.addTo(this.map);
        }
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
            this.data.forEach((visita: any) => {
                const lat = Number(visita.latitude);
                const lng = Number(visita.longitude);
                const maker = L.marker([lat, lng], {icon: L.icon({iconUrl: './assets/alerts/visitors.png'})});
                const factory = this.resolver.resolveComponentFactory(PopupVisitComponent);
                const component = factory.create(this.injector);
                const popupContent = component.location.nativeElement;
                component.instance.visit = visita;
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

    getAll() {
        this.visitasService.getAll().then(
            success => {
                this.visitas = success;
                this.data = this.visitas.data;
                var body = [];
                var excel = [];
                for(var i=0; i<this.data.length; i++){
                    this.data[i].id = Number(this.data[i].id);
                    this.data[i].visitor_dni = Number(this.data[i].visitor_dni);
                    excel.push({'#' : this.data[i].id, 'Placa del Vehículo': this.data[i].plate, 'Visitante':this.data[i].visitor_name+' '+this.data[i].visitor_lastname, 'Cédula del visitante':this.data[i].visitor_dni, 'Entrada':this.data[i].create_date, 'Salida':this.data[i].finish_date})
                    body.push([this.data[i].id, this.data[i].plate, this.data[i].visitor_name+' '+this.data[i].visitor_lastname, this.data[i].visitor_dni, this.data[i].create_date, this.data[i].finish_date])
                }
                this.contpdf = body;
                this.info = excel;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getToday() {
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth() + 1;
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
        this.desde =this.date;

        this.visitasService.getByDate(year, this.month2, this.day2, 'all', year, this.month2, this.day2).then(
            success => {
                this.visitas = success;
                this.data = this.visitas.data;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );

    }

    selectRange(id){
        if(id == 1){
            this.rangeday = true;
            this.desde = "";
            this.hasta = "";
            this.getSearch();
        }else{
            this.rangeday = false;
            this.desde = "";
            this.hasta = "";
            this.getSearch();
        }
    }

    getSearch(){
        var fecha1 = String(this.desde);
        var valuesdate1 = fecha1.split('-');
        var year1 = valuesdate1[0];
        var month1 = valuesdate1[1];
        var day1 = valuesdate1[2];

        var fecha2 = String(this.hasta);
        var valuesdate2 = fecha2.split('-');
        var year2 = valuesdate2[0];
        var month2 = valuesdate2[1];
        var day2 = valuesdate2[2];

        var vehiculo = this.selectedVehiculos;
        var guardia = this.selectedGuardias;
        var visitante = this.selectedVisitantes;
        var funcionario = this.selectedFuncionarios;
        //Vehiculo
        if(this.filtroSelect == 0){
            if(this.desde == ""){
                if(vehiculo.length ==0){
                    this.getAll();
                }else{
                    var result = [];
                    for(var i=0;i<vehiculo.length;i++){
                        this.visitasService.getByVehiculo(vehiculo[i].item_id, 'all').then(
                            success => {
                                this.visitas = success;
                                result = result.concat(this.visitas.data);
                                this.data = result;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
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
            }else{
                if(this.rangeday){
                    if(vehiculo.length == 0){
                        this.visitasService.getByDate(year1, month1, day1, 'all', year1, month1, day1).then(
                            success => {
                                this.visitas = success;
                                this.data = this.visitas.data;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
                            }, error => {
                                if (error.status === 422) {
                                    // on some data incorrect
                                } else {
                                    // on general error
                                }
                            }
                        );
                    }else{
                        var result = [];
                        for(var i=0;i<vehiculo.length;i++){
                            this.visitasService.getByVehiculoDate(vehiculo[i].item_id, year1, month1, day1, 'all', year1, month1, day1).then(
                                success => {
                                    this.visitas = success;
                                    result = result.concat(this.visitas.data);
                                    this.data = result;
                                    for(var i=0; i<this.data.length; i++){
                                        this.data[i].id = Number(this.data[i].id);
                                    }
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
                }else{
                    if(vehiculo.length == 0){
                        this.visitasService.getByDate(year1, month1, day1, 'all', year2, month2, day2).then(
                            success => {
                                this.visitas = success;
                                this.data = this.visitas.data;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
                            }, error => {
                                if (error.status === 422) {
                                    // on some data incorrect
                                } else {
                                    // on general error
                                }
                            }
                        );
                    }else{
                        var result = [];
                        for(var i=0;i<vehiculo.length;i++){
                            this.visitasService.getByVehiculoDate(vehiculo[i].item_id, year1, month1, day1, 'all', year2, month2, day2).then(
                                success => {
                                    this.visitas = success;
                                    result = result.concat(this.visitas.data);
                                    this.data = result;
                                    for(var i=0; i<this.data.length; i++){
                                        this.data[i].id = Number(this.data[i].id);
                                    }
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
        }
        //Guardia
        if(this.filtroSelect == 1){
            if(this.desde == ''){
                if(guardia.length ==0 ){
                    this.getAll();
                }else{
                    var result = [];
                    for(var i=0;i<guardia.length;i++){
                        this.visitasService.getByGuard(guardia[i].item_id, 'all').then(
                            success => {
                                this.visitas = success;
                                result = result.concat(this.visitas.data);
                                this.data = result;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
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
            }else{
                if(this.rangeday){
                    if(guardia.length == 0){
                        this.visitasService.getByDate(year1, month1, day1, 'all', year1, month1, day1).then(
                            success => {
                                this.visitas = success;
                                this.data = this.visitas.data;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
                            }, error => {
                                if (error.status === 422) {
                                    // on some data incorrect
                                } else {
                                    // on general error
                                }
                            }
                        );
                    }else{
                        var result = [];
                        for(var i=0;i<guardia.length;i++){
                            this.visitasService.getByGuardDate(guardia[i].item_id, year1, month1, day1, 'all', year1, month1, day1).then(
                                success => {
                                    this.visitas = success;
                                    result = result.concat(this.visitas.data);
                                    this.data = result;
                                    for(var i=0; i<this.data.length; i++){
                                        this.data[i].id = Number(this.data[i].id);
                                    }
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
                }else{
                    if(guardia.length == 0){
                        this.visitasService.getByDate(year1, month1, day1, 'all', year2, month2, day2).then(
                            success => {
                                this.visitas = success;
                                this.data = this.visitas.data;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
                            }, error => {
                                if (error.status === 422) {
                                    // on some data incorrect
                                } else {
                                    // on general error
                                }
                            }
                        );
                    }else{
                        var result = [];
                        for(var i=0;i<guardia.length;i++){
                            this.visitasService.getByGuardDate(guardia[i].item_id, year1, month1, day1, 'all', year2, month2, day2).then(
                                success => {
                                    this.visitas = success;
                                    result = result.concat(this.visitas.data);
                                    this.data = result;
                                    for(var i=0; i<this.data.length; i++){
                                        this.data[i].id = Number(this.data[i].id);
                                    }
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
        }
        //visitante
        if(this.filtroSelect == 2){
            if(this.desde == ''){
                if(visitante.length ==0 ){
                    this.getAll();
                }else{
                    var result = [];
                    for(var i=0;i<visitante.length;i++){
                        this.visitasService.getByVisitante(visitante[i].item_id, 'all').then(
                            success => {
                                this.visitas = success;
                                result = result.concat(this.visitas.data);
                                this.data = result;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
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
            }else{
                if(this.rangeday){
                    if(visitante.length == 0){
                        this.visitasService.getByDate(year1, month1, day1, 'all', year1, month1, day1).then(
                            success => {
                                this.visitas = success;
                                this.data = this.visitas.data;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
                            }, error => {
                                if (error.status === 422) {
                                    // on some data incorrect
                                } else {
                                    // on general error
                                }
                            }
                        );
                    }else{
                        var result = [];
                        for(var i=0;i<visitante.length;i++){
                            this.visitasService.getByVisitanteDate(visitante[i].item_id, year1, month1, day1, 'all', year1, month1, day1).then(
                                success => {
                                    this.visitas = success;
                                    result = result.concat(this.visitas.data);
                                    this.data = result;
                                    for(var i=0; i<this.data.length; i++){
                                        this.data[i].id = Number(this.data[i].id);
                                    }
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
                }else{
                    if(visitante.length == 0){
                        this.visitasService.getByDate(year1, month1, day1, 'all', year2, month2, day2).then(
                            success => {
                                this.visitas = success;
                                this.data = this.visitas.data;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
                            }, error => {
                                if (error.status === 422) {
                                    // on some data incorrect
                                } else {
                                    // on general error
                                }
                            }
                        );
                    }else{
                        var result = [];
                        for(var i=0;i<visitante.length;i++){
                            this.visitasService.getByVisitanteDate(visitante[i].item_id, year1, month1, day1, 'all', year2, month2, day2).then(
                                success => {
                                    this.visitas = success;
                                    result = result.concat(this.visitas.data);
                                    this.data = result;
                                    for(var i=0; i<this.data.length; i++){
                                        this.data[i].id = Number(this.data[i].id);
                                    }
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
        }
        //Funcionario
        if(this.filtroSelect == 3){
            if(this.desde == ''){
                if(funcionario.length ==0 ){
                    this.getAll();
                }else{
                    var result = [];
                    for(var i=0;i<funcionario.length;i++){
                        this.visitasService.getByFuncionario(funcionario[i].item_id, 'all').then(
                            success => {
                                this.visitas = success;
                                result = result.concat(this.visitas.data);
                                this.data = result;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
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
            }else{
                if(this.rangeday){
                    if(funcionario.length == 0){
                        this.visitasService.getByDate(year1, month1, day1, 'all', year1, month1, day1).then(
                            success => {
                                this.visitas = success;
                                this.data = this.visitas.data;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
                            }, error => {
                                if (error.status === 422) {
                                    // on some data incorrect
                                } else {
                                    // on general error
                                }
                            }
                        );
                    }else{
                        var result = [];
                        for(var i=0;i<funcionario.length;i++){
                            this.visitasService.getByFuncionarioDate(funcionario[i].item_id, year1, month1, day1, 'all', year1, month1, day1).then(
                                success => {
                                    this.visitas = success;
                                    result = result.concat(this.visitas.data);
                                    this.data = result;
                                    for(var i=0; i<this.data.length; i++){
                                        this.data[i].id = Number(this.data[i].id);
                                    }
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
                }else{
                    if(funcionario.length == 0){
                        this.visitasService.getByDate(year1, month1, day1, 'all', year2, month2, day2).then(
                            success => {
                                this.visitas = success;
                                this.data = this.visitas.data;
                                for(var i=0; i<this.data.length; i++){
                                    this.data[i].id = Number(this.data[i].id);
                                }
                            }, error => {
                                if (error.status === 422) {
                                    // on some data incorrect
                                } else {
                                    // on general error
                                }
                            }
                        );
                    }else{
                        var result = [];
                        for(var i=0; i<funcionario.length;i++){
                            this.visitasService.getByFuncionarioDate(this.funcionarioSelect, year1, month1, day1, 'all', year2, month2, day2).then(
                                success => {
                                    this.visitas = success;
                                    result = result.concat(this.visitas.data);
                                    this.data = result;
                                    for(var i=0; i<this.data.length; i++){
                                        this.data[i].id = Number(this.data[i].id);
                                    }
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
        }
    }

    viewDetail(id) {
        this.visitasService.getId(id).then(
            (success: any) => {
                // success.image_1 = 'http://www.casasparaconstruir.com/projetos/115/01.jpg'; // TODO borrar
                this.visi = success;
                console.log(this.visi);
                this.modalimg = [];
                this.modalimg.push(this.visi.image_1);
                this.modalimg.push(this.visi.image_2);
                this.modalimg.push(this.visi.image_3);
                this.modalimg.push(this.visi.image_4);
                this.modalimg.push(this.visi.image_5);
                this.visi.observation = JSON.parse(this.visi.observation);
                this.visi.latitude = this.lat = Number(this.visi.latitude);
                this.visi.longitude = this.lng = Number(this.visi.longitude);
                if (this.visi.f_latitude != null && this.visi.f_longitude != null) {
                    this.markerOut = L.marker([this.visi.f_latitude, this.visi.f_longitude],
                        { icon: L.icon({iconUrl: './assets/alerts/visit_out.png'})});
                    if (this.map !== undefined) {
                        this.markerOut.addTo(this.map);
                    }
                }
                this.zoom = this.globalOSM.fullZoom;
                if (this.visi.observation) {
                    if (this.visi.observation.length == 0) {
                        this.nomat = true;
                    } else {
                        this.nomat = false;
                    }
                }
                this.lista = false;
                this.detalle = true;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    regresar() {
        this.lista = true;
        this.detalle = false;
        this.viewmap = false;
    }

    selectFilert(id){
        if(id == 0){
            this.filtro = 1;
            this.guardiaSelect = 0;
            this.visitanteSelect = 0;
            this.funcionarioSelect = 0;
            this.getSearch();
        }else if(id == 1){
            this.filtro = 2;
            this.vehiculoSelect = 0;
            this.visitanteSelect = 0;
            this.funcionarioSelect = 0;
            this.getSearch();
        }else if(id == 2){
            this.filtro = 3;
            this.vehiculoSelect = 0;
            this.guardiaSelect = 0;
            this.funcionarioSelect = 0;
            this.getSearch();
        }else if(id == 3){
            this.filtro = 4;
            this.vehiculoSelect = 0;
            this.guardiaSelect = 0;
            this.funcionarioSelect = 0;
            this.getSearch();
        }
    }

    getGuard(){
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

    getVehiculos(){
        this.vehiculoService.getAll().then(
            success => {
                this.vehiculos = success;
                this.vehi = this.vehiculos.data;
                const datag = [];
                this.vehi.forEach(vehi => {
                    datag.push({ item_id: vehi.id, item_text: vehi.plate});
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

    getVisitantes(){
        this.visitanteService.getAll().then(
            success => {
                this.visitantes = success;
                this.visit = this.visitantes.data;
                const datag = [];
                this.visit.forEach(visit => {
                    datag.push({ item_id: visit.id, item_text: visit.name+' '+visit.lastname });
                });
                this.dropdownList3 = datag;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getFuncionarios(){
        this.funcionarioService.getAll().then(
            success => {
                this.funcionarios = success;
                this.funcio = this.funcionarios.data;
                const datag = [];
                this.funcio.forEach(funcio => {
                    datag.push({ item_id: funcio.id, item_text: funcio.name+' '+funcio.lastname });
                });
                this.dropdownList4 = datag;
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
        this.selectedVehiculos = [];
        this.dropdownSettings1 = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            searchPlaceholderText: 'Buscar Vehículo',
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
        this.selectedVehiculos = [];
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
    //configuración de los selects
    onItemSelect3 (item:any) {
        this.getSearch();
    }

    onItemDeSelect3 (item:any){
        this.getSearch();
    }

    setupDropdown3() {
        this.dropdownList3 = [];
        this.selectedVehiculos = [];
        this.dropdownSettings3 = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            searchPlaceholderText: 'Buscar Visitante',
            itemsShowLimit: 1,
            allowSearchFilter: true,
            enableCheckAll: false,
        };
    }
    // configuración de los selects
    onItemSelect4 (item:any) {
        this.getSearch();
    }

    onItemDeSelect4 (item:any){
        this.getSearch();
    }

    setupDropdown4() {
        this.dropdownList4 = [];
        this.selectedFuncionarios = [];
        this.dropdownSettings4 = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            searchPlaceholderText: 'Buscar Funcionario',
            itemsShowLimit: 1,
            allowSearchFilter: true,
            enableCheckAll: false,
        };
    }

    getMapAlertas() {
        this.zoom = 12;
        this.lista = false;
        this.viewmap = true;
    }


    excelList() {
        this.visitPrint.downloadVisitListExcel(this.data, this.excelService);
    }

    pdfList() {
        this.visitPrint.createVisitListPDF(this.data, 1).then();
    }

    printList() {
        this.visitPrint.createVisitListPDF(this.data, 2).then();
    }

    excelDetails() {
        this.visitPrint.downloadVisitDetailsExcel(this.visi, this.excelService);
    }

    pdfDetails() {
        this.visitPrint.createVisitDetailsPDF(this.visi, 1).then();
    }

    printDetails() {
        this.visitPrint.createVisitDetailsPDF(this.visi, 2).then();
    }

}
