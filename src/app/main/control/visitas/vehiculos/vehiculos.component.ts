import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitaVehiculoService } from '../../../../../model/visitavehiculo/visitavehiculo.service';
import { Vvehiculo } from '../../../../../model/visitavehiculo/visitavehiculo';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';

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

  constructor(public router:Router, private vehiculoService:VisitaVehiculoService, private excelService:ExcelService) {
  	this.getAll();
  	this.lista = true;
    this.detalle = false;
    this.crear = false;
    this.editar = false;
  }

  getAll() {
    	this.vehiculoService.getAll().then(
    		success => {
    			this.vehiculos = success;
    			this.data = this.vehiculos.data;
          var body = [];
          var excel = [];
          for(var i=0; i<this.data.length; i++){
              excel.push({'#' : this.data[i].id, 'Placa': this.data[i].plate, 'Vehiculo':this.data[i].vehicle, 'Modelo':this.data[i].model, 'Tipo':this.data[i].type})
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
                    // on some data incorrect
                    this.errorDeleteData = true;
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
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Vehículos Visitantes', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa', 'Vehiculo', 'Modelo', 'Tipo']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 'auto'}
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
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Vehículos Visitantes', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa', 'Vehiculo', 'Modelo', 'Tipo']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 'auto'}
            }
        });   
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }


}
