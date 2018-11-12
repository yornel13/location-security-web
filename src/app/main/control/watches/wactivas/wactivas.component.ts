import { Component, OnInit } from '@angular/core';
import { WatchesService } from '../../../../../model/watch/watch.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {GlobalOsm} from '../../../../global.osm';

@Component({
    selector: 'app-wactivas',
    templateUrl: './wactivas.component.html',
    styleUrls: ['./wactivas.component.css']
})
export class WactivasComponent {
    lista:boolean;
    detalle:boolean;
    watches:any = undefined;
    data:any = undefined;
    filter:string;
    //filtro guardia
    guardias:any = [];
    guard:any = [];
    guardiaSelect:number = 0;
    //filtro fecha
    dateSelect:string = '';
    valueDate:any = [];
    guardia:any = [];
    hay:boolean;
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

    zoom = 14;
    center = L.latLng(([ this.lat, this.lng ]));
    marker = L.marker([this.lat, this.lng], {draggable: false});
    layersControlOptions;
    baseLayers;
    options;

    constructor(
            private watchesService: WatchesService,
            private globalOSM: GlobalOsm,
            private guardiasService: GuardService,
            private excelService: ExcelService) {
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = this.globalOSM.defaultOptions;
        this.getAll();
        this.getGuard();
        this.lista = true;
        this.detalle = false;
    }

    onMapReady(map: L.Map) {
        this.map = map;
        this.globalOSM.setupLayer(this.map);
        this.zoom = 15;
        this.center = L.latLng(([ this.lat, this.lng ]));
        this.marker = L.marker([this.lat, this.lng], { icon: L.icon({iconUrl: './assets/maps/watch.png'})} );
        this.marker.addTo(this.map);
    }

    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    getAll() {
        this.watchesService.getActive().then(
            success => {
                this.watches = success;
                this.data = this.watches.data;
                var body = [];
                var excel = [];
                var status = "";
                for(var i=0; i<this.data.length; i++){
                    if(this.data[i].status == 0){
                        status = "Finalizada";
                    }else if(this.data[i].status == 1){
                        status = "Activa";
                    }
                    excel.push({
                        '#' : this.data[i].id,
                        'Nombre del Guardia': this.data[i].guard.name + ' ' + this.data[i].guard.lastname,
                        'Cédula del Guardia': this.data[i].guard.dni,
                        'Hora de inicio': this.data[i].create_date,
                        'Status': status
                    })
                    body.push([
                        this.data[i].id,
                        this.data[i].guard.name + ' ' + this.data[i].guard.lastname,
                        this.data[i].guard.dni,
                        this.data[i].create_date,
                        status]);
                    this.data[i].id = Number(this.data[i].id);
                    this.data[i].guard.dni = Number(this.data[i].guard.dni);
                }
                this.contpdf = body;
                this.info = excel;
                if (this.watches.total == 0){
                    this.hay = false;
                }else{
                    this.hay = true;
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
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    guardFilert(id) {
        if(id == 0){
            this.getAll();
        }else{
            this.watchesService.getActiveByGuard(id).then(
                success => {
                    this.watches = success;
                    this.data = this.watches.data;
                    console.log(this.data);
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

    viewDetail(id){
        this.watchesService.getById(id).then(
            success => {
                this.guardia = success;
                this.lista = false;
                this.detalle = true;
                this.guardia.latitude = this.lat = Number(this.guardia.latitude);
                this.guardia.longitude = this.lng = Number(this.guardia.longitude);
                this.zoom = 12;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getMapAlertas(){
        this.zoom = 12;
        this.lista = false;
        this.viewmap = true;
    }

    setupPdfAndExcelData() {
        const body = [];
        const excel = [];
        for (let i = 0; i < this.data.length; i++) {
            excel.push({
                'Puesto' : this.data[i].stand_name,
                'Nombre del Guardia': this.data[i].guard.name + ' ' + this.data[i].guard.lastname,
                'Cédula del Guardia': this.data[i].guard.dni,
                'Hora de inicio': this.data[i].create_date,
            });
            body.push([
                this.data[i].stand_name,
                this.data[i].guard.name + ' ' + this.data[i].guard.lastname,
                this.data[i].guard.dni,
                this.data[i].create_date,
            ]);
            this.data[i].id = Number(this.data[i].id);
            this.data[i].guard.dni = Number(this.data[i].guard.dni);
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
        doc.text('Guardias Activas', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['Puesto', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 'auto'},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
            }
        });
        doc.save('guardiasactivas.pdf');
    }

    excelDownload() {
        this.setupPdfAndExcelData();
        this.excelService.exportAsExcelFile(this.info, 'guardiasactivas');
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
        doc.text('Guardias Activas', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['Puesto', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 'auto'},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
            }
        });
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

    pdfDetalle() {
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

        doc.save('guardiaDetail.pdf');

    }

    printDetalle() {
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

        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');

    }

    excelDetalle() {
        var excel = [];
        excel = [{'Hora de inicio' : this.guardia.create_date, 'Latitud': this.guardia.latitude.toString(), 'Longitud':this.guardia.longitude.toString(), '':''}];
        excel.push({'Hora de inicio':'Guardia'});
        excel.push({'Hora de inicio':'Nombre', 'Latitud':'Apellido', 'Longitude':'Cédula', '':'Correo'});
        excel.push({'Hora de inicio':this.guardia.guard.name, 'Latitud':this.guardia.guard.lastname, 'Longitude':this.guardia.guard.dni, '':this.guardia.guard.email});
        this.excelService.exportAsExcelFile(excel, 'guardiadetail');
    }
}
