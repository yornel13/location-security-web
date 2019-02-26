import {Component, ComponentFactoryResolver, Injector} from '@angular/core';
import { WatchesService } from '../../../../../model/watch/watch.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';
import {GlobalOsm} from '../../../../global.osm';
import {UtilsVehicles} from '../../../../../model/vehicle/vehicle.utils';
import {PopupWatchtComponent} from './popup.watcht.component';
import {PuestoService} from '../../../../../model/puestos/puestos.service';

@Component({
    selector: 'app-wtodas',
    templateUrl: './wtodas.component.html',
    styleUrls: ['./wtodas.component.css']
})
export class WtodasComponent {
    lista: boolean;
    detalle: boolean;
    watches: any = [];
    data: any = [];
    resultListSelected = [];
    filter: string;
    // filtro guardia
    guardias: any = [];
    guard: any = [];
    puestos: any[] = [];
    guardiaSelect = 0;
    puestoSelect = 0;
    // filtro fecha
    dateSelect: string = '';
    valueDate: any = [];
    guardia: any = [];
    numElement: number = 10;
    // exportaciones
    contpdf: any = [];
    info: any = [];

    filtroSelect = 0;
    key = 'id'; // set default
    reverse = false;
    isLoading = false;

    //map
    map: any;
    mapchart: any;
    lat = -2.0000;
    lng = -79.0000;
    viewmap = false;

    //fechas
    desde:any = "";
    hasta:any = "";
    rangeday = true;
    date:any;
    month2:any;
    day2:any;

    // dropdow
    dropdownList = [];
    dropdownListStand = [];
    selectedGuardias = [];
    selectedStands = [];
    dropdownSettings = {};
    dropdownSettingsStand = {};

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
            private watchesService: WatchesService,
            private guardiasService: GuardService,
            private puestoService: PuestoService,
            private excelService: ExcelService) {
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = this.globalOSM.defaultOptions;
        this.getToday();
        this.getGuard();
        this.getPuestos();
        this.setupDropdown();
        this.lista = true;
        this.detalle = false;
        this.sort('create_date');
    }

    onMapReady(map: L.Map) {
        this.map = map;
        this.globalOSM.setupLayer(this.map);
        this.zoom = 12;
        this.center = L.latLng(([ this.lat, this.lng ]));
        this.marker = L.marker([this.lat, this.lng], { icon: L.icon({iconUrl: './assets/maps/watch.png'})} );
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
            this.data.forEach((watch: any) => {
                const lat = Number(watch.latitude);
                const lng = Number(watch.longitude);
                const maker = L.marker([lat, lng], {icon: L.icon({iconUrl: './assets/maps/watch.png'})});
                const factory = this.resolver.resolveComponentFactory(PopupWatchtComponent);
                const component = factory.create(this.injector);
                const popupContent = component.location.nativeElement;
                component.instance.watch = watch;
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

    showLoading() {
        this.isLoading = true;
        this.data = [];
    }

    dismissLoading() {
        this.isLoading = false;
    }

    onListWatchesBySelectedListSuccess(success) {
        this.watches = success;
        this.resultListSelected = this.resultListSelected.concat(this.watches.data);
        this.data = this.resultListSelected;
        for (var i = 0; i < this.data.length; i++) {
            this.data[i].id = Number(this.data[i].id);
        }
        this.dismissLoading();
    }

    onListWatchesSuccess(success) {
        if (this.isLoading) {
            this.watches = success;
            this.data = this.watches.data;
            this.dismissLoading();
        }
    }

    onListWatchesFailure(error) {
        if (this.isLoading) {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
            this.dismissLoading();
        }
    }

    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    selectFilert(filter) {
        if (filter === 0) {
            this.guardiaSelect = 0;
            this.puestoSelect = 0;
            this.desde = '';
            this.hasta = '';
        } else {
            this.puestoSelect = 0;
            this.guardiaSelect = 0;
            this.desde = '';
            this.hasta = '';
        }
        this.getSearch();
    }

    getAll() {
        this.watchesService.getAll().then(
            success => {
                this.watches = success;
                this.data = this.watches.data;
                console.log(this.data);
                console.log(this.watches.total);
                var body = [];
                var excel = [];
                var status = "";
                for(var i=0; i<this.data.length; i++){
                    if(this.data[i].status == 0){
                        status = "Finalizada";
                    }else if(this.data[i].status == 1){
                        status = "Activa";
                        this.data[i].update_date = "--";
                    }
                    excel.push({
                        '#' : this.data[i].id,
                        'Nombre del Guardia': this.data[i].guard.name + ' ' + this.data[i].guard.lastname,
                        'Cédula del Guardia': this.data[i].guard.dni,
                        'Hora de inicio': this.data[i].create_date,
                        'Hora de finalización': this.data[i].update_date, 'Status': status
                    });
                    body.push([
                        this.data[i].id,
                        this.data[i].guard.name + ' ' + this.data[i].guard.lastname,
                        this.data[i].guard.dni,
                        this.data[i].create_date,
                        this.data[i].update_date, status]);
                    this.data[i].id = Number(this.data[i].id);
                    this.data[i].guard.dni = Number(this.data[i].guard.dni);
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
        this.desde = this.date;

        this.getSearch();
    }

    selectRange(id) {
        if (id === 1) {
            this.rangeday = true;
            this.desde = '';
            this.hasta = '';
            this.getSearch();
        } else {
            this.rangeday = false;
            this.desde = '';
            this.hasta = '';
            this.getSearch();
        }
    }

    regresar() {
        this.lista = true;
        this.detalle = false;
        this.viewmap = false;
    }

    getGuard() {
        this.guardiasService.getAll().then(
            success => {
                this.guardias = success;
                this.guard = this.guardias.data;
                const datag = [];
                this.guard.forEach(guard => {
                    datag.push({ item_id: guard.id, item_text: guard.name+' '+guard.lastname });
                });
                console.log(datag);
                this.dropdownList = datag;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getPuestos() {
        this.puestoService.getAll().then(
            (success: any) => {
                this.puestos = success.data;
                const datag = [];
                this.puestos.forEach(stand => {
                    datag.push({ item_id: stand.id, item_text: stand.name });
                });
                this.dropdownListStand = datag;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    onItemSelect (item: any) {
        console.log(item);
        console.log(this.selectedGuardias);
        this.getSearch();
    }

    onItemDeSelect(item: any) {
        console.log(item);
        console.log(this.selectedGuardias);
        this.getSearch();
    }

    onItemSelect2(item: any) {
        console.log(item);
        console.log(this.selectedStands);
        this.getSearch();
    }

    onItemDeSelect2(item: any) {
        console.log(item);
        console.log(this.selectedStands);
        this.getSearch();
    }

    setupDropdown() {
        this.dropdownList = [];
        this.selectedGuardias = [];
        this.dropdownSettings = {
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

        this.dropdownListStand = [];
        this.selectedStands = [];
        this.dropdownSettingsStand = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            searchPlaceholderText: 'Buscar Pusto',
            itemsShowLimit: 1,
            allowSearchFilter: true,
            enableCheckAll: false,
        };
    }

    getSearch() {
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

        var guardia = this.selectedGuardias;
        var puesto = this.selectedStands;

        if (this.desde === '') {
            this.data = [];
        } else {
            if (this.filtroSelect === 0) {
                if (this.rangeday) {
                    this.showLoading();
                    this.watchesService.getByDate(year1, month1, day1, year1, month1, day1)
                        .then(this.onListWatchesSuccess.bind(this), this.onListWatchesFailure.bind(this));
                } else {
                    this.showLoading();
                    this.watchesService.getByDate(year1, month1, day1, year2, month2, day2)
                        .then(this.onListWatchesSuccess.bind(this), this.onListWatchesFailure.bind(this));
                }
            } else if (this.filtroSelect === 1) {
                if (guardia.length === 0) {
                    this.data = [];
                }
                if (this.rangeday) {
                    this.resultListSelected = [];
                    this.showLoading();
                    for (var i = 0; i < guardia.length; i++) {
                        this.watchesService.getByGuardDate(guardia[i].item_id, year1, month1, day1, year1, month1, day1)
                            .then(this.onListWatchesBySelectedListSuccess.bind(this), this.onListWatchesFailure.bind(this));
                    }
                } else {
                    this.resultListSelected = [];
                    this.showLoading();
                    for (var i = 0; i < guardia.length; i++) {
                        this.watchesService.getByGuardDate(guardia[i].item_id, year1, month1, day1, year2, month2, day2)
                            .then(this.onListWatchesBySelectedListSuccess.bind(this), this.onListWatchesFailure.bind(this));
                    }
                }
            } else if (this.filtroSelect === 2) {
                if (puesto.length === 0) {
                    this.data = [];
                }
                if (this.rangeday) {
                    this.resultListSelected = [];
                    this.showLoading();
                    for (var i = 0; i < puesto.length; i++) {
                        this.watchesService.getByStandDate(puesto[i].item_id, year1, month1, day1, year1, month1, day1)
                            .then(this.onListWatchesBySelectedListSuccess.bind(this), this.onListWatchesFailure.bind(this));
                    }
                } else {
                    this.resultListSelected = [];
                    this.showLoading();
                    for (var i = 0; i < puesto.length; i++) {
                        this.watchesService.getByStandDate(puesto[i].item_id, year1, month1, day1, year2, month2, day2)
                            .then(this.onListWatchesBySelectedListSuccess.bind(this), this.onListWatchesFailure.bind(this));
                    }
                }
            }
        }
    }

    viewDetail(id) {
        this.watchesService.getById(id).then(
            success => {
                this.guardia = success;
                this.guardia.latitude = this.lat = Number(this.guardia.latitude);
                this.guardia.longitude = this.lng = Number(this.guardia.longitude);
                this.lista = false;
                this.detalle = true;
                this.zoom = 14;
                this.center = L.latLng(([ this.lat, this.lng ]));
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getMapAlertas() {
        this.zoom = 12;
        this.lista = false;
        this.viewmap = true;
    }

    setupPdfAndExcelData() {
        const body = [];
        const excel = [];
        let status = '';
        for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].status === '0') {
                status = 'Finalizada';
            } else {
                status = 'Activa';
                this.data[i].update_date = '--';
            }
            excel.push({
                'Puesto' : this.data[i].stand_name,
                'Nombre del Guardia': this.data[i].guard.name + ' ' + this.data[i].guard.lastname,
                'Cédula del Guardia': this.data[i].guard.dni,
                'Hora de inicio': this.data[i].create_date,
                'Hora de finalización': this.data[i].update_date === '0000-00-0000:00:00' || this.data[i].update_date === null ? '--' : this.data[i].update_date,
                'Estado': status
            });
            body.push([
                this.data[i].stand_name,
                this.data[i].guard.name + ' ' + this.data[i].guard.lastname,
                this.data[i].guard.dni,
                this.data[i].create_date,
                this.data[i].update_date,
                status
            ]);
            this.data[i].id = Number(this.data[i].id);
            this.data[i].guard_dni = Number(this.data[i].guard_dni);
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
        doc.text('Todas las Guardias', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['Puesto', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio', 'Hora de finalización', 'Estado']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 20},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 'auto'},
                5: {cellWidth: 20}
            }
        });
        doc.save('guardias.pdf');
    }

    excelDownload() {
        this.setupPdfAndExcelData();
        this.excelService.exportAsExcelFile(this.info, 'guardias');
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
        doc.text('Todas las Guardias', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['Puesto', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio', 'Hora de finalización', 'Estado']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 20},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 'auto'},
                5: {cellWidth: 20}
            }
        });
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

    getPdfDetails(): jsPDF {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Guardia', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Hora de inicio: ', 15, 50);
        doc.setFontType("normal");
        doc.text(this.guardia.create_date, 50, 50);
        doc.setFontType("bold");
        doc.text('Hora de finalización: ', 100, 50);
        doc.setFontType("normal");
        var time = "";
        if(this.guardia.status == 0){
            time = this.guardia.update_date;
        }else{
            time = "--";
        }
        doc.text(time, 147, 50);

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 57);
        doc.setFontType("normal");
        doc.text(this.guardia.latitude.toString(), 36, 57);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 57);
        doc.setFontType("normal");
        doc.text(this.guardia.longitude.toString(), 123, 57);

        //guardia
        doc.line(10, 63, 200, 63);

        doc.setFontType("bold");
        doc.text('Guardia', 15, 70);

        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 77);
        doc.setFontType("normal");
        doc.text(this.guardia.guard.name, 34, 77);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 77);
        doc.setFontType("normal");
        doc.text(this.guardia.guard.lastname, 123, 77);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 84);
        doc.setFontType("normal");
        doc.text(this.guardia.guard.dni, 34, 84);
        doc.setFontType("bold");
        doc.text('Correo: ', 100, 84);
        doc.setFontType("normal");
        doc.text(this.guardia.guard.email, 119, 84);

        doc.setFontType("bold");
        doc.text('Puesto: ', 15, 91);
        doc.setFontType("normal");
        doc.text(this.guardia.stand_name, 34, 91);


        doc.setFontType("bold");
        doc.text('Tablet: ', 15, 98);
        doc.setFontType("normal");
        doc.text(this.guardia.tablet_imei, 34, 98);

        return doc;
    }

    pdfDetalle() {
        const doc = this.getPdfDetails();
        doc.save('guardiaDetail.pdf');

    }

    printDetalle() {
        const doc = this.getPdfDetails();
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');

    }

    excelDetalle() {
        var excel = [];
        var time = "";
        if(this.guardia.status == 0){
            time = this.guardia.update_date;
        }else{
            time = "--";
        }
        excel = [{'Hora de inicio' : this.guardia.create_date, 'Hora de finalización' : time, 'Latitud': this.guardia.latitude.toString(), 'Longitud':this.guardia.longitude.toString()}];
        excel.push({'Hora de inicio':'Guardia'});
        excel.push({'Hora de inicio':'Nombre', 'Hora de finalización':'Apellido', 'Latitud':'Cédula', 'Longitud':'Correo'});
        excel.push({'Hora de inicio':this.guardia.guard.name, 'Hora de finalización':this.guardia.guard.lastname, 'Latitud':this.guardia.guard.dni, 'Longitud':this.guardia.guard.email});
        this.excelService.exportAsExcelFile(excel, 'guardiadetail');
    }

}
