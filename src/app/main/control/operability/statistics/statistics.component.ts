import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as jsPDF from 'jspdf';
import {ToastrService} from 'ngx-toastr';
import {VehiclesService} from '../../../../../model/vehicle/vehicle.service';
import {TabletService} from '../../../../../model/tablet/tablet.service';
import {OperabilityService} from '../../../../../model/operability/operability.service';
import {ExcelService} from '../../../../../model/excel/excel.services';

@Component({
    selector: 'app-devices',
    templateUrl: './statistics.component.html',
    styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
    // General
    data: any[] = [];
    devices: any[] = [];
    isLoading = false;

    filter: string;
    numElement = 10;

    key = 'id'; // set default
    reverse = true;

    // dropdown
    dropdownList = [];
    selectedDevices = [];
    dropdownSettings = {};

    from = '';
    to = '';
    fromDate = '';
    toDate = '';

    // chart
    dataSource: any = {};

    chartWidth = '800px';
    chartHeight = '400px';
    showChart = false;
    enableChart = false;

    // Exports
    contentPDF: any = [];
    contentEXCEL: any = [];

    constructor(public router: Router,
                private vehicleService: VehiclesService,
                private tabletService: TabletService,
                private operabilityService: OperabilityService,
                private excelService: ExcelService,
                private toastr: ToastrService) {
        this.getAll();
        this.setupDropdown();

        this.dataSource = {
            chart: {
                yAxisName: 'Horas de operatividad',
                yAxisMaxValue: 750
            },
            // Chart Data
            data: [
                {
                    label: 'Dispositivo',
                    color: '#dc3545',
                    value: 0
                }
            ]
        };

        const self = this;
        setTimeout(function () {
            const width = document.getElementById('container-chart').clientWidth;
            const height = document.documentElement.clientHeight;
            self.chartWidth = String(width);
            self.chartHeight = String(Number(height) * 0.6);
            self.enableChart = true;
        }, 3000);
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

    getAll() {
        this.devices = [];
        this.operabilityService.getAll().then(
            (success: any) => {
                this.devices = success.data;
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

        this.clearData();
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
            this.operabilityService.getHours(JSON.stringify(array), year, month, day, year_t, month_t, day_t)
                .then(this.onListSuccess.bind(this), this.onListFailure.bind(this));
        }
    }

    clearData() {
        this.data = [];
        this.dataSource.data = [
            {
                label: 'Dispositivo',
                    color: '#dc3545',
                value: 0
            }
        ];
    }

    onListSuccess(success) {
        if (this.isLoading) {
            success.data.sort((n1, n2) => {
                if (n1.hours_on > n2.hours_on) { return -1; }
                if (n1.hours_on < n2.hours_on) {return 1; }
                return 0;
            });
            this.data = success.data;
            this.setChart();
            this.dismissLoading();
        }
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

    setChart() {
        this.dataSource.data = [];
        if (this.data.length > 0) {
            this.data.forEach(item => {
                this.dataSource.data.push({
                    label: item.name,
                    color: item.hours_on >= 750 ? '#28a745' : '#dc3545',
                    value: item.hours_on
                });
            });
        }
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
        doc.text('Operatividad de Dispositivos', 15, 27);
        doc.text('Hora de impresión: ' + date, 15, 34);
        doc.text('Rango de fechas seleccionado: ' + this.fromDate + ' al ' + this.toDate, 15, 44);
        doc.autoTable({
            head: [['IMEI', 'Dispositivo', 'Serie', 'Operativo', 'Inoperativo']],
            body: this.contentPDF,
            startY: 48,
            columnStyles: {
                0: {cellWidth: 'auto'},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 'auto'},
            }
        });
        return doc;
    }

    setupPdfAndExcelData() {
        const body = [];
        const excel = [];
        for (let i = 0; i < this.data.length; i++) {
            excel.push({
                'IMEI': this.data[i].imei,
                'Dispositivo': this.data[i].name,
                'Serie': this.data[i].series,
                'Horas de Operativo': this.data[i].hours_on,
                'Horas de Inoperativo': this.data[i].hours_off
            });
            body.push([
                this.data[i].imei,
                this.data[i].name,
                this.data[i].series,
                this.data[i].hours_on + ' horas',
                this.data[i].hours_off + ' horas'
            ]);
        }
        this.contentPDF = body;
        this.contentEXCEL = excel;
    }
}
