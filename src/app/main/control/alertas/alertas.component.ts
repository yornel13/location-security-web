import {Component, ComponentFactoryResolver, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AlertaService } from '../../../../model/alerta/alerta.service';
import { Alerta } from '../../../../model/alerta/alerta';
import { GuardService } from '../../../../model/guard/guard.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import * as geolib from 'geolib';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {PopupAlertComponent} from '../../monitoring/map/popup.alert.component';
import {GlobalOsm} from '../../../global.osm';
import {UtilsVehicles} from '../../../../model/vehicle/vehicle.utils';
import {environment} from '../../../../environments/environment';


@Component({
    selector: 'app-alertas',
    templateUrl: './alertas.component.html',
    styleUrls: ['./alertas.component.css']
})
export class AlertasComponent implements OnInit {

    readonly alertCollection: AngularFirestoreCollection<Alerta>;

    alertas:any = undefined;
    data: any = [];
    guardias:any = undefined;
    guard:any = undefined;
    numElement:number = 10;
    causes:any = undefined;
    cuase:any = [];
    detailcause: Alerta;
    //filtros
    causaSelect = 5;
    causaElegida:string = "ALL";
    guardiaSelect:number = 0;
    filtro:boolean = true;
    dateSelect:string = "";
    doughnutChartData:number[] = [3,3];
    lista:boolean = true;
    detalle:boolean = false;
    //new chart
    dataSource:any = {};
    valores:number[] = [1,1,1];
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

    //fechas
    desde:any = "";
    hasta:any = "";
    rangeday:boolean=true;
    date:any;
    month2:any;
    day2:any;

    // dropdown
    dropdownList = [];
    selectedGuardias = [];
    dropdownSettings = {};

    isLoading = false;
    resultListSelected = [];

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
        private alertaService: AlertaService,
        private guardiaService: GuardService,
        private excelService: ExcelService,
        private db: AngularFirestore,
        private route: ActivatedRoute) {
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = this.globalOSM.defaultOptions;
        this.getGuardias();
        this.setupDropdown();
        this.putTodayFecha();
        this.getAlerts();
        this.doughnutChartData = [3, 3, 0];
        this.regresar();

        this.dataSource = {
            chart: {
                "yAxisName": "Cantidad de alertas",
                "yAxisMaxValue": Math.max(...this.valores)+5
            },
            // Chart Data
            "data": [{
                "label": "SOS",
                "color": "#dc3545",
                "value": this.valores[0]
            }, {
                "label": "Caída",
                "color": "#ffc107",
                "value": this.valores[1]
            }, {
                "label": "Salida del cerco",
                "color": "#28a745",
                "value": this.valores[2]
            }]
        };
        this.alertCollection = db.collection<Alerta>(environment.ALERTS_PATH);
        this.sort('create_date');
    }

    onMapReady(map: L.Map) {
        this.map = map;
        this.globalOSM.setupLayer(this.map);
        this.zoom = this.globalOSM.fullZoom;
        this.center = L.latLng(([ this.lat, this.lng ]));
        this.marker = L.marker([this.lat, this.lng], this.getIcon(this.detailcause));
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
            this.data.forEach((alert: Alerta) => {
                const lat = Number(alert.latitude);
                const lng = Number(alert.longitude);
                const maker = L.marker([lat, lng], this.getIcon(alert));
                const factory = this.resolver.resolveComponentFactory(PopupAlertComponent);
                const component = factory.create(this.injector);
                const popupContent = component.location.nativeElement;
                component.instance.alert = alert;
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

    getIcon(alert) {
        let imageIcon;
        if (alert.type === this.globalOSM.DROP) {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/falldown.png'})};
        } else if (alert.type === this.globalOSM.SOS1) {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/sos.png'})};
        } else if (alert.type === this.globalOSM.IGNITION_ON) {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/on.png'})};
        } else if (alert.type === this.globalOSM.IGNITION_OFF) {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/off.png'})};
        } else if (alert.type === this.globalOSM.SPEED_MAX) {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/speed.png'})};
        } else if (alert.type === this.globalOSM.INIT_WATCH) {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/watch_start.png'})};
        } else if (alert.type === this.globalOSM.FINISH_WATCH) {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/watch_end.png'})};
        } else if (alert.type === this.globalOSM.OUT_BOUNDS) {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/outside.png'})};
        } else if (alert.type === this.globalOSM.IN_BOUNDS) {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/inside.png'})};
        } else {
            imageIcon = {icon: L.icon({iconUrl: './assets/alerts/report.png'})};
        }
        return imageIcon;
    }

    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    getAll() {
        this.alertaService.getAll().then(
            success => {
                this.alertas = success;
                this.data = this.alertas.data;
                this.valores = this.countAlert(this.data);
                this.dataSource.chart.yAxisMaxValue = Math.max(...this.valores) + 5;
                this.dataSource.data[0].value = this.valores[0];
                this.dataSource.data[1].value = this.valores[1];
                this.dataSource.data[2].value = this.valores[2];
                var body = [];
                var excel = [];
                var status = "";
                var cause = "";
                for(var i=0; i<this.data.length; i++){
                    this.data[i].id = Number(this.data[i].id);

                    if(this.data[i].status == 1){
                        status = "Activa"
                    }else{
                        status = "Aceptada"
                    }

                    if(this.data[i].cause == "SOS1"){
                        cause = "SOS";
                    }else if(this.data[i].cause == "DROP"){
                        cause = "Caída";
                    }else if(this.data[i].cause == "OUT_BOUNDS"){
                        cause = "Salida del cerco";
                    }else if(this.data[i].cause == "GENERAL"){
                        cause = "General";
                    }

                    excel.push({
                        '#' : this.data[i].id,
                        'Causa': cause,
                        'Descripción': this.data[i].message,
                        'Generado por': this.data[i].guard ? this.data[i].guard.name + ' ' + this.data[i].guard.lastname : '',
                        'Fecha': this.data[i].create_date,
                        'Status': status
                    });
                    body.push([
                        this.data[i].id,
                        cause,
                        this.data[i].message,
                        this.data[i].guard ? this.data[i].guard.name + ' ' + this.data[i].guard.lastname : '',
                        this.data[i].create_date, status]);
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

    showLoading() {
        this.isLoading = true;
        this.data = [];
    }

    dismissLoading() {
        this.isLoading = false;
    }

    putTodayFecha() {
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
        this.desde =this.date;
    }

    getToday() {
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
        this.desde =this.date;

        this.alertaService.getByCauseDate('all', year, this.month2, this.day2, year, this.month2, this.day2).then(
            success => {
                this.alertas = success;
                this.data = this.alertas.data;
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
        this.alertaService.getId(id).then(
            success => {
                this.detailcause = success;
                this.lat = Number(this.detailcause.latitude);
                this.lng = Number(this.detailcause.longitude);
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

    countAlert(data) {
        var values = [];
        var sos = 0;
        var drop = 0;
        if(data.length == 0){
            values = [0, 0];
            return values;
        }else{
            for(var i=0; i<data.length; i++){
                if(data[i].cause == "SOS1"){
                    sos++;
                }
                if(data[i].cause == "DROP"){
                    drop++;
                }
            }
            values = [sos, drop, 0];
            return values;
        }
    }

    getGuardias() {
        this.guardiaService.getAll().then(
            success => {
                this.guardias = success;
                this.guard = this.guardias.data;
                const datag = [];
                this.guard.forEach(guard => {
                    datag.push({ item_id: guard.id, item_text: guard.name + ' ' + guard.lastname });
                });
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

    onItemSelect (item: any) {
        this.getAlerts();
    }

    onItemDeSelect(item: any) {
        this.getAlerts();
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
    }

    solveAlert(alert: Alerta) {
        this.alertaService.solveAlert(alert.id).then(
            (success: any) => {
                this.alertCollection.doc(String(alert.id)).update({'status': 0}).then();
                alert.status = success.result.status;
                if (this.lista) {
                    this.getAlerts();
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

    selectRange(id) {
        if (id == 1) {
            this.rangeday = true;
            this.desde = '';
            this.hasta = '';
            this.getAlerts();
        } else {
            this.rangeday = false;
            this.desde = '';
            this.hasta = '';
            this.getAlerts();
        }
    }

    getAlerts() {
        // format of causes
        var cause = 'all';
        if (this.causaSelect == 0) {
            cause = 'all';
        } else if (this.causaSelect == 1) {
            cause = 'SOS1';
        } else if (this.causaSelect == 2) {
            cause = 'DROP';
        } else if (this.causaSelect == 3) {
            cause = 'OUT_BOUNDS';
        } else if (this.causaSelect == 4) {
            cause = 'GENERAL';
        } else if (this.causaSelect == 5) {
            cause = 'INCIDENCE';
        }
        // format of dates
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
        // format of guards
        var guardia = this.selectedGuardias;
        console.log(guardia);
        // Init search
        if (this.desde == '') {
            this.data = [];
        } else {
            if (this.rangeday) {
                if (cause == 'all') {
                    if (guardia.length == 0) {
                        this.showLoading();
                        this.alertaService.getByCauseDate(cause, year1, month1, day1, year1, month1, day1)
                                .then(this.onListAlertsSuccess.bind(this), this.onListAlertsFailure.bind(this));
                    } else {
                        this.resultListSelected = [];
                        this.showLoading();
                        for (var i = 0; i < guardia.length; i++) {
                            this.alertaService.getByGuardDate(guardia[i].item_id, year1, month1, day1, year1, month1, day1)
                                .then(this.onListAlertsBySelectedListSuccess.bind(this), this.onListAlertsFailure.bind(this));
                        }
                    }
                } else {
                    if (guardia.length == 0) {
                        this.showLoading();
                        this.alertaService.getByCauseDate(cause, year1, month1, day1, year1, month1, day1)
                            .then(this.onListAlertsSuccess.bind(this), this.onListAlertsFailure.bind(this));
                    } else {
                        this.resultListSelected = [];
                        this.showLoading();
                        for (var i = 0; i < guardia.length; i++) {
                            this.alertaService.getByGuardCaseDate(guardia[i].item_id, cause, year1, month1, day1, year1, month1, day1)
                                .then(this.onListAlertsBySelectedListSuccess.bind(this), this.onListAlertsFailure.bind(this));
                        }
                    }
                }
            } else {
                if (this.hasta === '') {
                    this.data = [];
                } else {
                    if (cause == 'all') {
                        if (guardia.length == 0) {
                            this.showLoading();
                            this.alertaService.getByCauseDate(cause, year1, month1, day1, year2, month2, day2)
                                .then(this.onListAlertsSuccess.bind(this), this.onListAlertsFailure.bind(this));
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for (var i = 0; i < guardia.length; i++) {
                                this.alertaService.getByGuardDate(guardia[i].item_id, year1, month1, day1, year2, month2, day2)
                                    .then(this.onListAlertsBySelectedListSuccess.bind(this), this.onListAlertsFailure.bind(this));
                            }
                        }
                    } else {
                        if (guardia.length == 0) {
                            this.showLoading();
                            this.alertaService.getByCauseDate(cause, year1, month1, day1, year2, month2, day2)
                                .then(this.onListAlertsSuccess.bind(this), this.onListAlertsFailure.bind(this));
                        } else {
                            this.resultListSelected = [];
                            this.showLoading();
                            for (var i = 0; i < guardia.length; i++) {
                                this.alertaService.getByGuardCaseDate(guardia[i].item_id, cause, year1, month1, day1, year2, month2, day2)
                                    .then(this.onListAlertsBySelectedListSuccess.bind(this), this.onListAlertsFailure.bind(this));
                            }
                        }
                    }
                }
            }
        }
    }

    onListAlertsBySelectedListSuccess(success) {
        this.alertas = success;
        this.resultListSelected = this.resultListSelected.concat(this.alertas.data);
        this.data = this.resultListSelected;
        for (var i = 0; i < this.data.length; i++) {
            this.data[i].id = Number(this.data[i].id);
        }
        this.dismissLoading();
    }

    onListAlertsSuccess(success) {
        if (this.isLoading) {
            this.alertas = success;
            this.data = this.alertas.data;
            this.dismissLoading();
        }
    }

    onListAlertsFailure(error) {
        if (this.isLoading) {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
            this.dismissLoading();
        }
    }

    getMapAlertas() {
        this.zoom = 12;
        this.lista = false;
        this.viewmap = true;
    }

    getListPdf(): jsPDF {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Alertas', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Causa', 'Descripción', 'Generado por', 'Fecha']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 18},
                1: {cellWidth: 20},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 'auto'},
            }
        });
        return doc;
    }

    excelDownload() {
        this.setupPdfAndExcelData();
        this.excelService.exportAsExcelFile(this.info, 'visitas');
    }

    pdfDownload() {
        this.setupPdfAndExcelData();
        const doc = this.getListPdf();
        doc.save('alertas.pdf');
    }

    print() {
        this.setupPdfAndExcelData();
        const doc = this.getListPdf();
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

    setupPdfAndExcelData() {
        const body = [];
        const excel = [];
        let status = '';
        let cause = '';
        for (let i = 0; i < this.data.length; i++) {
            this.data[i].id = Number(this.data[i].id);

            if (this.data[i].status === 1) {
                status = 'Activa';
            } else {
                status = 'Aceptada';
            }

            if (this.data[i].cause === 'SOS1') {
                cause = 'SOS';
            } else if (this.data[i].cause === 'DROP') {
                cause = 'Caída';
            } else if (this.data[i].cause === 'OUT_BOUNDS') {
                cause = 'Salida del cerco';
            } else if (this.data[i].cause === 'GENERAL') {
                cause = 'General';
            } else if (this.data[i].cause === 'INCIDENCE') {
                cause = 'Incidencia';
            }
            excel.push({
                '#' : this.data[i].id,
                'Causa': cause,
                'Descripción': this.data[i].message,
                'Generado por': (this.data[i].guard ? this.data[i].guard.name + ' ' + this.data[i].guard.lastname : ''),
                'Fecha': this.data[i].create_date,
                'Status': status,
            });
            body.push([
                this.data[i].id,
                cause,
                this.data[i].message,
                this.data[i].guard ? this.data[i].guard.name + ' ' + this.data[i].guard.lastname : '',
                this.data[i].create_date
            ]);
        }
        this.contpdf = body;
        this.info = excel;
    }

    getPdfDetails(): jsPDF {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Alertas del sistema', 15, 27)
        doc.text('Hora de impresión: ' + fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Causa: ', 15, 50);
        doc.setFontType("normal");
        doc.text(this.detailcause.cause, 32, 50);
        doc.setFontType("bold");
        doc.text('Descripción: ', 15, 57);
        doc.setFontType("normal");
        doc.text(this.detailcause.message, 42, 57);

        doc.setFontType("bold");
        doc.text('Fecha: ', 15, 64);
        doc.setFontType("normal");
        doc.text(this.detailcause.create_date, 32, 64);
        doc.setFontType("bold");
        doc.text('Status: ', 100, 64);
        doc.setFontType("normal");
        var status = "";
        if (this.detailcause.status == 0){
            status = "Finalizado";
        }else{
            status = "Activa";
        }
        doc.text(status, 119, 64);

        doc.setFontType("bold");
        doc.text('Latitud: ', 15, 71);
        doc.setFontType("normal");
        doc.text(this.detailcause.latitude.toString(), 36, 71);
        doc.setFontType("bold");
        doc.text('Longitud: ', 100, 71);
        doc.setFontType("normal");
        doc.text(this.detailcause.longitude.toString(), 123, 71);

        doc.setFontType("bold");
        doc.text('Imei: ', 15, 78);
        doc.setFontType("normal");
        doc.text(this.detailcause.imei, 36, 78);

        if (this.detailcause.guard) {
            doc.setFontType("bold");
            doc.text('Guardia: ', 15, 85);
            doc.setFontType("normal");
            doc.text(this.detailcause.guard.name + ' ' + this.detailcause.guard.lastname, 36, 85);
        }

        return doc;
    }

    pdfDetalle() {
        const doc = this.getPdfDetails();
        doc.save('alertaDetail.pdf');
    }

    printDetalle() {
        const doc = this.getPdfDetails();
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');

    }

    excelDetalle() {
        var excel = [];
        var status = "";
        if (this.detailcause.status == 0){
            status = "Finalizado";
        }else{
            status = "Activa";
        }
        excel = [{'Causa': this.detailcause.cause, 'Descripción':this.detailcause.message, 'Fecha':this.detailcause.create_date, 'Status':status, 'Longitud':this.detailcause.longitude.toString(), 'Latitud':this.detailcause.latitude.toString()}];
        this.excelService.exportAsExcelFile(excel, 'admindetail');
    }

    ngOnInit() {
        this.route.url.subscribe(value => {
            const alertId = value[value.length - 1].path;
            if (Number(alertId)) {
                this.viewDetail(alertId);
            }
        });
    }

}
