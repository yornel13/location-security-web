import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitanteService } from '../../../../../model/vistavisitantes/visitantes.service';
import { Visitantes } from '../../../../../model/vistavisitantes/visitantes';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-visitantes',
  templateUrl: './visitantes.component.html',
  styleUrls: ['./visitantes.component.css']
})
export class VisitantesComponent {
  //general
  visitantes:any = undefined;
  data:any = undefined;
  visi:any = [];
  //vistas vehiculos
  lista:boolean;
  detalle:boolean;
  crear:boolean;
  editar:boolean;
  //edit
  nombre:string;
  apellido:string;
  compania:string;
  identificacion:string;
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
              private visitanteService:VisitanteService,
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
    this.visitanteService.getAll().then(
      success => {
        this.visitantes = success;
        this.data = this.visitantes.data;
        var body = [];
        var excel = [];
        for(var i=0; i<this.data.length; i++){
            this.data[i].id = Number(this.data[i].id);
            this.data[i].dni = Number(this.data[i].dni);
            excel.push({'#' : this.data[i].id, 'Cédula': this.data[i].dni, 'Nombre':this.data[i].name, 'Apellido':this.data[i].lastname, 'Compañia':this.data[i].company})
            body.push([this.data[i].id, this.data[i].dni, this.data[i].name, this.data[i].lastname, this.data[i].company])
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
    this.visitanteService.getId(id).then(
      success => {
        this.visi = success;
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

  editarAdmmin(id) {
    this.visitanteService.getId(id).then(
      success => {
        this.visi = success;
        this.nombre = this.visi.name;
        this.apellido = this.visi.lastname;
        this.compania = this.visi.company;
        this.identificacion = this.visi.dni;
        this.idEdit = this.visi.id;
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
      const editadmin : Visitantes = {
        id: this.idEdit,
        dni: this.identificacion,
        name: this.nombre,
        lastname: this.apellido,
        company: this.compania
      };
      this.visitanteService.set(editadmin).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorEditMsg = error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                      this.errorEditMsg = error.error.errors.lastname[0];
                    }
                    if(error.error.errors.company){
                      this.errorEditMsg = error.error.error.company[0];
                    }
                    if(error.error.errors.dni){
                      this.errorEditMsg = error.error.errors.dni[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    deleteVisitante(id) {
      this.visitanteService.delete(id).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorDeleteData = false;
          this.errorDelete = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
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
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Visitantes', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Cédula', 'Nombre', 'Apellido', 'Compañia']],
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
        doc.save('visitantes.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'visitantes');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Visitantes', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Cédula', 'Nombre', 'Apellido', 'Compañia']],
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
        doc.text('Visitante', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 100);
        doc.setFontType("normal");
        doc.text(this.visi.name, 34, 100);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 100);
        doc.setFontType("normal");
        doc.text(this.visi.lastname, 123, 100);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 107);
        doc.setFontType("normal");
        doc.text(this.visi.dni, 34, 107);
        doc.setFontType("bold");
        doc.text('Compañía: ', 100, 107);
        doc.setFontType("normal");
        doc.text(this.visi.company, 123, 107);

        doc.setFontType("bold");
        doc.text('Fecha de creación: ', 15, 114);
        doc.setFontType("normal");
        doc.text(this.visi.create_date, 56, 114);
        doc.setFontType("bold");
        doc.text('Última actualización: ', 100, 114);
        doc.setFontType("normal");
        doc.text(this.visi.update_date, 146, 114);

        if (this.visi.photo) {
            this.toDataURL(this.visi.photo).then(dataUrl => {
                var imgData = dataUrl;
                doc.addImage(imgData, 'JPEG', 15, 45, 40, 40);
                doc.save('visitanteDetail.pdf');
            });
        } else {
            doc.save('visitanteDetail.pdf');
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
        doc.text('Visitante', 15, 27)
        doc.text('Hora de impresión: '+ fecha, 15, 34);
        //inserting data
        doc.setTextColor(0);
        doc.setFontType("bold");
        doc.text('Nombre: ', 15, 100);
        doc.setFontType("normal");
        doc.text(this.visi.name, 34, 100);
        doc.setFontType("bold");
        doc.text('Apellido: ', 100, 100);
        doc.setFontType("normal");
        doc.text(this.visi.lastname, 123, 100);

        doc.setFontType("bold");
        doc.text('Cédula: ', 15, 107);
        doc.setFontType("normal");
        doc.text(this.visi.dni, 34, 107);
        doc.setFontType("bold");
        doc.text('Compañía: ', 100, 107);
        doc.setFontType("normal");
        doc.text(this.visi.company, 123, 107);

        doc.setFontType("bold");
        doc.text('Fecha de creación: ', 15, 114);
        doc.setFontType("normal");
        doc.text(this.visi.create_date, 56, 114);
        doc.setFontType("bold");
        doc.text('Última actualización: ', 100, 114);
        doc.setFontType("normal");
        doc.text(this.visi.update_date, 146, 114);

        if (this.visi.photo) {
            this.toDataURL(this.visi.photo).then(dataUrl => {
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
        excel = [{'#' : this.visi.id, 'Cedula': this.visi.dni, 'Nombre':this.visi.name, 'Apellido':this.visi.lastname, 'Dirección':this.visi.address, 'Fecha de creación':this.visi.create_date, 'Última actualización':this.visi.update_date}];
        this.excelService.exportAsExcelFile(excel, 'visitantedetail');
    }

}
