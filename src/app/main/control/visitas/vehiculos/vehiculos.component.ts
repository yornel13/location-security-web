import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitaVehiculoService } from '../../../../../model/visitavehiculo/visitavehiculo.service';
import { Vvehiculo } from '../../../../../model/visitavehiculo/visitavehiculo';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-vehiculos',
    templateUrl: './vehiculos.component.html',
    styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent {
    //general
    vehiculos:any = undefined;
    data:any = undefined;
    vehi:any = [];
    //vistas vehiculos
    lista:boolean;
    detalle:boolean;
    crear:boolean;
    editar:boolean;
    //editar
    placa:string;
    vehiculo:string;
    modelo:string;
    tipo:string;
    idEdit:number;
    errorEdit:boolean = false;
    errorEditData:boolean = false;
    errorEditMsg:string;
    //eliminar
    errorDelete:boolean = false;
    errorDeleteData:boolean = false;
    filter:string;
    numElement:number = 10;
    //exportaciones
    contpdf:any = [];
    info: any = [];

    key: string = 'id'; //set default
    reverse: boolean = true;

    constructor(public router:Router,
                private vehiculoService:VisitaVehiculoService,
                private excelService:ExcelService,
                private toastr: ToastrService) {
        this.getAll();
        this.lista = true;
        this.detalle = false;
        this.crear = false;
        this.editar = false;
    }

    sort(key){
        this.key = key;
        this.reverse = !this.reverse;
    }

    getAll() {
        this.vehiculoService.getAll().then(
            success => {
                this.vehiculos = success;
                this.data = this.vehiculos.data;
                var body = [];
                var excel = [];
                for(var i=0; i<this.data.length; i++){
                    this.data[i].id = Number(this.data[i].id);
                    excel.push({'#' : this.data[i].id, 'Placa': this.data[i].plate, 'Vehiculo':this.data[i].vehicle, 'Marca':this.data[i].model, 'Color':this.data[i].type})
                    body.push([this.data[i].id, this.data[i].plate, this.data[i].vehicle, this.data[i].model, this.data[i].type])
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

    viewDetail(id) {
        this.vehiculoService.getId(id).then(
            success => {
                this.vehi = success;
                this.lista = false;
                this.detalle = true;
                this.crear = false;
                this.editar = false;
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
        this.crear = false;
        this.editar = false;
        this.errorEditData = false;
    }

    editarVisitVehiculo(id) {
        this.vehiculoService.getId(id).then(
            success => {
                this.vehi = success;
                this.placa = this.vehi.plate;
                this.vehiculo = this.vehi.vehicle;
                this.modelo = this.vehi.model;
                this.tipo = this.vehi.type;
                this.idEdit = this.vehi.id;
                this.lista = false;
                this.detalle = false;
                this.crear = false;
                this.editar = true;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    saveEdit() {
        const editvehiculo : Vvehiculo = {
            id: this.idEdit,
            plate: this.placa,
            model: this.modelo,
            vehicle: this.vehiculo,
            type: this.tipo
        };
        this.vehiculoService.set(editvehiculo).then(
            success => {
                this.getAll();
                this.regresar();
                this.errorEditData = false;
                this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    console.log(error);
                    if(error.error.errors.plate){
                        this.errorEditMsg = error.error.errors.plate[0];
                    }
                    if(error.error.errors.model){
                        this.errorEditMsg = error.error.errors.model[0];
                    }
                    if(error.error.errors.type){
                        this.errorEditMsg = error.error.errors.type[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    deleteVehiculo(id) {
        this.vehiculoService.delete(id).then(
            success => {
                this.getAll();
                this.regresar();
                this.errorDeleteData = false;
                this.errorDelete = false;
            }, error => {
                if (error.status === 422) {
                    this.errorDeleteData = true;
                    this.toastr.info(error.error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                } else {
                    // on general error
                    this.errorDelete = true;
                }
            }
        );
    }

    pdfDownload() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Vehículos Visitantes', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa', 'Vehiculo', 'Marca', 'Color']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 18},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 'auto'}
            }
        });
        doc.save('vehiculos.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'vehiculos');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Vehículos Visitantes', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa', 'Vehiculo', 'Marca', 'Color']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
                0: {cellWidth: 18},
                1: {cellWidth: 'auto'},
                2: {cellWidth: 'auto'},
                3: {cellWidth: 'auto'},
                4: {cellWidth: 'auto'}
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
        doc.text('Vehículo Visitante', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Placa: ', 15, 100);
        doc.setFontType("normal");
        doc.text(this.vehi.plate, 32, 100);
        doc.setFontType("bold");
        doc.text('Vehículo: ', 100, 100);
        doc.setFontType("normal");
        doc.text(this.vehi.vehicle, 125, 100);

        doc.setFontType("bold");
        doc.text('Marca: ', 15, 107);
        doc.setFontType("normal");
        doc.text(this.vehi.model, 34, 107);
        doc.setFontType("bold");
        doc.text('Color: ', 100, 107);
        doc.setFontType("normal");
        doc.text(this.vehi.type, 115, 107);

        doc.setFontType("bold");
        doc.text('Fecha de creación: ', 15, 114);
        doc.setFontType("normal");
        doc.text(this.vehi.create_date, 56, 114);
        doc.setFontType("bold");
        doc.text('Última actualización: ', 100, 114);
        doc.setFontType("normal");
        doc.text(this.vehi.update_date, 146, 114);

        if (this.vehi.photo) {
            this.toDataURL(this.vehi.photo).then(dataUrl => {
                var imgData = dataUrl;
                doc.addImage(imgData, 'JPEG', 15, 45, 40, 40);
                doc.save('vehiculoDetail.pdf');
            });
        } else {
            doc.save('vehiculoDetail.pdf');
        }

    }

    toDataURL = url => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob);
        }));

    printDetalle() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Vehículo Visitante', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Placa: ', 15, 100);
        doc.setFontType("normal");
        doc.text(this.vehi.plate, 32, 100);
        doc.setFontType("bold");
        doc.text('Vehículo: ', 100, 100);
        doc.setFontType("normal");
        doc.text(this.vehi.vehicle, 125, 100);

        doc.setFontType("bold");
        doc.text('Marca: ', 15, 107);
        doc.setFontType("normal");
        doc.text(this.vehi.model, 34, 107);
        doc.setFontType("bold");
        doc.text('Color: ', 100, 107);
        doc.setFontType("normal");
        doc.text(this.vehi.type, 115, 107);

        doc.setFontType("bold");
        doc.text('Fecha de creación: ', 15, 114);
        doc.setFontType("normal");
        doc.text(this.vehi.create_date, 56, 114);
        doc.setFontType("bold");
        doc.text('Última actualización: ', 100, 114);
        doc.setFontType("normal");
        doc.text(this.vehi.update_date, 146, 114);

        if (this.vehi.photo) {
            this.toDataURL(this.vehi.photo).then(dataUrl => {
                var imgData = dataUrl;
                doc.addImage(imgData, 'JPEG', 15, 45, 40, 40);
                doc.autoPrint();
                window.open(doc.output('bloburl'), '_blank');
            });
        } else {
            doc.autoPrint();
            window.open(doc.output('bloburl'), '_blank');
        }

    }

    excelDetalle() {
        var excel = [];
        excel = [{'#' : this.vehi.id, 'Placa': this.vehi.plate, 'Vehículo':this.vehi.vehicle, 'Marca':this.vehi.model, 'Color':this.vehi.type, 'Fecha de creación':this.vehi.create_date, 'Última actualización':this.vehi.update_date}];
        this.excelService.exportAsExcelFile(excel, 'vehiculDetail');
    }

}
