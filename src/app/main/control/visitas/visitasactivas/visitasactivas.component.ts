import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitasService } from '../../../../../model/visitas/visitas.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import { VisitaVehiculoService } from '../../../../../model/visitavehiculo/visitavehiculo.service';
import { VisitanteService } from '../../../../../model/vistavisitantes/visitantes.service';
import { FuncionarioService } from '../../../../../model/funcionarios/funcionario.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';

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
  dateSelect:any = '';
  nohay:boolean = false;
  numElement:number = 10;
  //exportaciones
  contpdf:any = [];
  info: any = [];
  key: string = 'id'; //set default
  reverse: boolean = false;

  constructor(public router:Router, private visitasService:VisitasService, private guardiaService:GuardService, private excelService:ExcelService, 
    private vehiculoService:VisitaVehiculoService, private visitanteService:VisitanteService, private funcionarioService:FuncionarioService) { 
  	this.lista = true;
    this.detalle = false;
  	this.getActives();
    this.getGuard();
    this.getVehiculos();
    this.getVisitantes();
    this.getFuncionarios();
  }

  sort(key){
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
        if(this.visi.observation.length == 0){
          this.nomat = true;
        }else{
          this.nomat = false;
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
  }

  getByVehiculo(id){
    var fecha = String(this.dateSelect);
    this.valueDate = fecha.split('-');
    var year = this.valueDate[0];
    var month = this.valueDate[1];
    var day = this.valueDate[2];

    if(this.dateSelect == ''){
      if(id == 0){
        this.getActives();
      }else{
        this.visitasService.getByVehiculo(id, '1').then(
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
    }else{
      if(id ==0){
        this.visitasService.getByDate(year, month, day, '1').then(
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
      }else{
        this.visitasService.getByVehiculoDate(id, year, month, day, '1').then(
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
    }
  }

  getByGuardia(id){
    var fecha = String(this.dateSelect);
  this.valueDate = fecha.split('-');
  var year = this.valueDate[0];
  var month = this.valueDate[1];
  var day = this.valueDate[2];

    if(this.dateSelect == ''){
      if(id == 0){
        this.getActives();
      }else{
        this.visitasService.getByGuard(id, '1').then(
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
    }else{
      if(id ==0){
        this.visitasService.getByDate(year, month, day, '1').then(
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
      }else{
        this.visitasService.getByGuardDate(id, year, month, day, '1').then(
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
    }
  }

  getByVisitante(id){
    var fecha = String(this.dateSelect);
  this.valueDate = fecha.split('-');
  var year = this.valueDate[0];
  var month = this.valueDate[1];
  var day = this.valueDate[2];

    if(this.dateSelect == ''){
      if(id == 0){
        this.getActives();
      }else{
        this.visitasService.getByVisitante(id, '1').then(
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
    }else{
      if(id ==0){
        this.visitasService.getByDate(year, month, day, '1').then(
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
      }else{
        this.visitasService.getByVisitanteDate(id, year, month, day, '1').then(
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
    }
  }

  getByFuncionario(id){
    var fecha = String(this.dateSelect);
  this.valueDate = fecha.split('-');
  var year = this.valueDate[0];
  var month = this.valueDate[1];
  var day = this.valueDate[2];

    if(this.dateSelect == ''){
      if(id == 0){
        this.getActives();
      }else{
        this.visitasService.getByFuncionario(id, '1').then(
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
    }else{
      if(id ==0){
        this.visitasService.getByDate(year, month, day, '1').then(
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
      }else{
        this.visitasService.getByFuncionarioDate(id, year, month, day, '1').then(
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
    }
  }


  selectFilert(id){
    if(id == 0){
      this.filtro = 1;
      this.guardiaSelect = 0;
      this.visitanteSelect = 0;
      this.funcionarioSelect = 0;
      this.getByVehiculo(this.vehiculoSelect);
    }else if(id == 1){
      this.filtro = 2;
      this.vehiculoSelect = 0;
      this.visitanteSelect = 0;
      this.funcionarioSelect = 0;
      this.getByGuardia(this.guardiaSelect);
    }else if(id == 2){
      this.filtro = 3;
      this.vehiculoSelect = 0;
      this.guardiaSelect = 0;
      this.funcionarioSelect = 0;
      this.getByVisitante(this.visitanteSelect);
    }else if(id == 3){
      this.filtro = 4;
      this.vehiculoSelect = 0;
      this.guardiaSelect = 0;
      this.funcionarioSelect = 0;
      this.getByFuncionario(this.funcionarioSelect);
    }
  }

  getGuard(){
    this.guardiaService.getAll().then(
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

  getVehiculos(){
    this.vehiculoService.getAll().then(
    success => {
      this.vehiculos = success;
      this.vehi = this.vehiculos.data;
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
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
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
        doc.text('Visitas activas', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa del Vehículo', 'Visitante', 'Cédula del visitante', 'Entrada']],
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
        doc.save('visitasactivas.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'visitasActivas');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Visitas activas', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Placa del Vehículo', 'Visitante', 'Cédula del visitante', 'Entrada']],
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
