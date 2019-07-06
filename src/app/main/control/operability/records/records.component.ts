import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import {ToastrService} from 'ngx-toastr';
import {OperabilityService} from '../../../../../model/operability/operability.service';
import {ExcelService} from '../../../../../model/excel/excel.services';
import {PuestoService} from '../../../../../model/puestos/puestos.service';

@Component({
    selector: 'app-devices',
    templateUrl: './records.component.html',
    styleUrls: ['./records.component.css']
})
export class RecordsComponent {
    // General
    data: any[] = [];
    devices: any[] = [];
    stands: any[] = [];
    isLoading = false;

    filter: string;
    numElement = 10;

    key = 'time'; // set default
    reverse = true;

    // dropdown
    dropdownList = [];
    selectedDevices = [];
    dropdownSettings = {};

    from = '';
    to = '';
    fromDate = '';
    toDate = '';
    p;

    // Exports
    contentPDF: any = [];
    contentEXCEL: any = [];

    constructor(public router: Router,
                private operabilityService: OperabilityService,
                private standService: PuestoService,
                private excelService: ExcelService,
                private toastr: ToastrService) {
        this.getAllStands();
        this.setupDropdown();
    }

    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    setupDropdown() {
        this.dropdownList = [];
        this.selectedDevices = [];
        this.dropdownSettings = {
            singleSelection: false,
            idField: 'item_id',
            textField: 'item_text',
            selectAllText: 'Seleccionar todo',
            unSelectAllText: 'Deseleccionar todo',
            searchPlaceholderText: 'Buscar dispositivos...',
            itemsShowLimit: 100,
            allowSearchFilter: true,
            enableCheckAll: true,
        };
    }

    getAllStands() {
        this.devices = [];
        this.standService.getAll().then(
            (success: any) => {
                this.stands = success.data;
                this.getAllOperability();
            }, error => {
                this.isLoading = false;
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                }
            }
        );
    }

    getAllOperability() {
        this.operabilityService.getAll().then(
            (success: any) => {
                this.devices = success.data;
                this.devices.forEach(device => {
                    this.stands.forEach(stand => {
                        if (device.imei == stand.id) {
                            device.name = stand.name;
                            device.address = stand.address;
                        }
                    });
                });
                const data = [];
                this.devices.forEach(device => {
                    data.push({ item_id: device.imei, item_text: device.name });
                });
                this.dropdownList = data;
                this.isLoading = false;
            }, error => {
                this.isLoading = false;
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
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

    search() {
        // format of dates
        const fromString = String(this.from);
        const valueFrom = fromString.split('-');
        const year = valueFrom[0];
        const month = valueFrom[1];
        const day = valueFrom[2];

        const toString = String(this.to);
        const valueTo = toString.split('-');
        const year_t = valueTo[0];
        const month_t = valueTo[1];
        const day_t = valueTo[2];

        this.fromDate = day + '/' + month + '/' + year;
        this.toDate = day_t + '/' + month_t + '/' + year_t;

        if (this.from == '' || this.to == '') {
            this.toastr.info('Selecciona el rango de fechas', 'Error',
                { positionClass: 'toast-bottom-center'});
        } else if (this.selectedDevices.length == 0) {
            this.toastr.info('Selecciona los dispositivos a consultar', 'Error',
                { positionClass: 'toast-bottom-center'});
        } else {
            const array = [];
            this.selectedDevices.forEach(device => {
                array.push({imei: device.item_id});
            });
            this.showLoading();
            this.operabilityService.getRecords(JSON.stringify(array), year, month, day, year_t, month_t, day_t)
                .then(this.onListSuccess.bind(this), this.onListFailure.bind(this));
        }
    }

    onListSuccess(success) {
        if (this.isLoading) {
            this.data = success.data;
            this.data.forEach(stop => {
                this.devices.forEach(stand => {
                    if (stand.imei == stop.imei) {
                        stop.name = stand.name;
                        stop.address = stand.address;
                    }
                    stop.date = stop.time;
                    stop.hour = stop.time;
                    if (stop.time_init == null || stop.time_init == undefined) {
                        stop.time_init = null;
                    } else {
                        stop.date_init = stop.time_init;
                        stop.hour_init = stop.time_init;
                    }
                    if (stop.cause == null) {
                        stop.cause = 'STOP AUTOMATICO';
                    }
                    stop.duration = this.diffMinutes(stop.time_init, stop.time);
                });
            });
            this.dismissLoading();
        }
    }

    diffMinutes(dt2, dt1) {
        if (dt2 == null) {
            return 'Desconocido';
        }
        dt2 = new Date(dt2);
        dt1 = new Date(dt1);
        let diff = (dt2.getTime() - dt1.getTime()) / 1000;
        diff /= 60;
        return Math.abs(Math.round(diff)) + ' min';
    }

    onListFailure(error) {
        if (this.isLoading) {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
            this.dismissLoading();
            this.toastr.info(error.message, 'Error',
                { positionClass: 'toast-bottom-center'});
        }
    }

    onItemSelect(item: any) {

    }

    onItemDeSelect(item: any) {
    }

    onSelectAll(items: any) {

    }

    onDeSelectAll(items: any) {

    }

    excelDownload() {
        this.setupPdfAndExcelData();
        this.excelService.exportAsExcelFile(this.contentEXCEL, 'operatividad');
    }

    pdfDownload() {
        this.setupPdfAndExcelData();
        const doc = this.getListPdf();
        doc.save('operatividad.pdf');
    }

    print() {
        this.setupPdfAndExcelData();
        const doc = this.getListPdf();
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

    getListPdf(): jsPDF {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text('ICSSE Seguridad', 15, 20);
        doc.setFontSize(12);
        doc.setTextColor(100);
        const d = new Date();
        const date = d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear()
            + ' ' + d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        doc.text('Historial de Stops Realizados', 15, 27);
        doc.text('Hora de impresión: ' + date, 15, 34);
        doc.text('Rango de fechas seleccionado: ' + this.fromDate + ' al ' + this.toDate, 15, 44);
        doc.autoTable({
            head: [['Puesto', 'F. Stop', 'H. Stop', 'Motivo Stop', 'F. Inicio', 'H. Inicio', 'Duracion']],
            body: this.contentPDF,
            startY: 48,
            columnStyles: {
                0: {cellWidth: 'auto'},
                1: {cellWidth: 20},
                2: {cellWidth: 20},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 20},
                5: {cellWidth: 20},
                6: {cellWidth: 20}
            }
        });
        return doc;
    }

    setupPdfAndExcelData() {
        const body = [];
        const excel = [];
        for (let i = 0; i < this.data.length; i++) {
            const ds = new Date(this.data[i].time);
            const dateStop = ds.getDate() + '/' + (ds.getMonth() + 1) + '/' + ds.getFullYear();
            const hourStop = ds.getHours() + ':' + ds.getMinutes() + ':' + ds.getSeconds();
            let dateInit = 'No Regis';
            let hourInit = 'No Regis';
            if (this.data[i].time_init != null) {
                const dsInit = new Date(this.data[i].time_init);
                dateInit = dsInit.getDate() + '/' + (dsInit.getMonth() + 1) + '/' + dsInit.getFullYear();
                hourInit = dsInit.getHours() + ':' + dsInit.getMinutes() + ':' + dsInit.getSeconds();
            }
            excel.push({
                'Puesto': this.data[i].name,
                'Descripcion': this.data[i].address,
                'Fecha Stop': dateStop,
                'Hora Stop': hourStop,
                'Motivo Stop': this.data[i].cause,
                'Fecha Inicio': dateInit,
                'Hora Inicio': hourInit,
                'Duracion': this.data[i].duration
            });
            body.push([
                this.data[i].name,
                dateStop,
                hourStop,
                this.data[i].cause,
                dateInit,
                hourInit,
                this.data[i].duration == 'Desconocido' ? '--' : this.data[i].duration
            ]);
        }
        this.contentPDF = body;
        this.contentEXCEL = excel;
    }
}
