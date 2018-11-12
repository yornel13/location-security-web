import {Component, ComponentFactoryResolver, Injector} from '@angular/core';
import { Router } from '@angular/router';
import { VisitasService } from '../../../../../model/visitas/visitas.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import { VisitaVehiculoService } from '../../../../../model/visitavehiculo/visitavehiculo.service';
import { VisitanteService } from '../../../../../model/vistavisitantes/visitantes.service';
import { FuncionarioService } from '../../../../../model/funcionarios/funcionario.service';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';
import {GlobalOsm} from '../../../../global.osm';
import {UtilsVehicles} from '../../../../../model/vehicle/vehicle.utils';
import {PopupVisitComponent} from '../visitas/popup.visit.component';
import {VisitPrint} from '../visit.print';

@Component({
    selector: 'app-visitasactivas',
    templateUrl: './visitasactivas.component.html',
    styleUrls: ['./visitasactivas.component.css']
})
export class VisitasactivasComponent {
    /*general*/
    visitas:any = undefined;
    data:any = undefined;
    visi:any = [];
    searchString: string;
    filter:string;
    //vistas vehiculos
    lista:boolean;
    detalle:boolean;
    nomat:boolean;
    //filtro
    filtroSelect = 0;
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
    dateSelect:any = '';
    nohay:boolean = false;
    numElement:number = 10;
    //exportaciones
    contpdf:any = [];
    info: any = [];
    key: string = 'id'; //set default
    reverse: boolean = false;

    //map
    map: any;
    mapchart: any;
    lat:number= -2.0000;
    lng:number = -79.0000;
    viewmap:boolean = false;

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
            private excelService: ExcelService,
            private visitPrint: VisitPrint,
            private vehiculoService: VisitaVehiculoService,
            private visitanteService: VisitanteService,
            private funcionarioService: FuncionarioService) {
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = this.globalOSM.defaultOptions;
        this.lista = true;
        this.detalle = false;
        this.getActives();
        this.getGuard();
        this.getVehiculos();
        this.getVisitantes();
        this.getFuncionarios();
        this.setupDropdown1();
        this.setupDropdown2();
        this.setupDropdown3();
        this.setupDropdown4();
        this.sort('create_date');
    }

    onMapReady(map: L.Map) {
        this.map = map;
        this.globalOSM.setupLayer(this.map);
        this.zoom = this.globalOSM.fullZoom;
        this.center = L.latLng(([ this.lat, this.lng ]));
        this.marker = L.marker([this.lat, this.lng], { icon: L.icon({iconUrl: './assets/alerts/visitors.png'})} );
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

    getActives() {
        this.visitasService.getActive().then(
            success => {
                this.visitas = success;
                this.data = this.visitas.data;
                var body = [];
                var excel = [];
                for(var i=0; i<this.data.length; i++){
                    this.data[i].id = Number(this.data[i].id);
                    this.data[i].visitor_dni = Number(this.data[i].visitor_dni);
                    excel.push({'#' : this.data[i].id, 'Placa del Vehículo': this.data[i].plate, 'Visitante':this.data[i].visitor_name+' '+this.data[i].visitor_lastname, 'Cédula del visitante':this.data[i].visitor_dni, 'Entrada':this.data[i].create_date})
                    body.push([this.data[i].id, this.data[i].plate, this.data[i].visitor_name+' '+this.data[i].visitor_lastname, this.data[i].visitor_dni, this.data[i].create_date])
                }
                this.contpdf = body;
                this.info = excel;
                if(this.data.length == 0){
                    this.nohay = true;
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

    viewDetail(id) {
        this.visitasService.getId(id).then(
            success => {
                this.visi = success;
                this.visi.observation = JSON.parse(this.visi.observation);
                if (this.visi.observation.length == 0){
                    this.nomat = true;
                } else {
                    this.nomat = false;
                }
                this.visi.latitude = this.lat = Number(this.visi.latitude);
                this.visi.longitude = this.lng = Number(this.visi.longitude);
                this.zoom = this.globalOSM.fullZoom;
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

    getByVehiculo(){
        var vehiculo = this.selectedVehiculos;
        if(this.dateSelect == ''){
            if( vehiculo.length == 0){
                this.data = [];
            }else{
                var result = [];
                for(var i=0;i<vehiculo.length;i++){
                    this.visitasService.getByVehiculo(vehiculo[i].item_id, '1').then(
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

    getByGuardia(){
        var guardia = this.selectedGuardias;
        if(this.dateSelect == ''){
            if(guardia.length == 0){
                this.data = [];
            }else{
                var result = [];
                for(var i=0;i<guardia.length;i++){
                    this.visitasService.getByGuard(guardia[i].item_id, '1').then(
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

    getByVisitante(){
        var visitante = this.selectedVisitantes;
        if(this.dateSelect == ''){
            if(visitante.length == 0){
                this.data = [];
            }else{
                var result = []
                for(var i=0;i<visitante.length;i++){
                    this.visitasService.getByVisitante(visitante[i].item_id, '1').then(
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

    getByFuncionario(){
        var funcionario = this.selectedFuncionarios;
        if(this.dateSelect == ''){
            if(funcionario.length == 0){
                this.data = [];
            }else{
                var result = [];
                for(var i=0;i<funcionario.length;i++){
                    this.visitasService.getByFuncionario(funcionario[i].item_id, '1').then(
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


    selectFilert(id){
        if(id == 1){
            this.guardiaSelect = 0;
            this.visitanteSelect = 0;
            this.funcionarioSelect = 0;
            this.getByVehiculo();
        }else if(id == 2){
            this.vehiculoSelect = 0;
            this.visitanteSelect = 0;
            this.funcionarioSelect = 0;
            this.getByGuardia();
        }else if(id == 3){
            this.vehiculoSelect = 0;
            this.guardiaSelect = 0;
            this.funcionarioSelect = 0;
            this.getByVisitante();
        }else if(id == 4){
            this.vehiculoSelect = 0;
            this.guardiaSelect = 0;
            this.funcionarioSelect = 0;
            this.getByFuncionario();
        } else {
            this.guardiaSelect = 0;
            this.visitanteSelect = 0;
            this.funcionarioSelect = 0;
            this.vehiculoSelect = 0;
            this.getActives();
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
        this.getByVehiculo();
    }

    onItemDeSelect1(item:any){
        this.getByVehiculo();
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
        this.getByGuardia();
    }

    onItemDeSelect2 (item:any){
        this.getByGuardia();
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
    //configuración de los selects
    onItemSelect3 (item:any) {
        this.getByVisitante();
    }

    onItemDeSelect3 (item:any){
        this.getByVisitante();
    }

    setupDropdown3() {
        this.dropdownList3 = [];
        this.selectedVisitantes = [];
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
    //configuración de los selects
    onItemSelect4 (item:any) {
        this.getByFuncionario();
    }

    onItemDeSelect4 (item:any){
        this.getByFuncionario();
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

    getMapAlertas(){
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
