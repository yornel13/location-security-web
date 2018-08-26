import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { FuncionarioService } from '../../../../../model/funcionarios/funcionario.service';
import { Funcionario } from '../../../../../model/funcionarios/funcionario';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent {
  //general
  funcionarios:any = undefined;
  data:any = undefined;
  funcio:any = [];
  error: string;
  //vistas admin
  lista:boolean;
  detalle:boolean;
  crear:boolean;
  editar:boolean;
  //editar
  nombre:string;
  apellido:string;
  direccion:string;
  identificacion:string;
  idEdit:number;
  errorEdit:boolean = false;
  errorEditData:boolean = false;
  errorEditMsg:string;
  //createBoundView
  namea:string;
  lastnamea:string;
  addressa:string;
  dnia:string;
  passworda:string;
  errorSave:boolean = false;
  errorSaveData:boolean = false;
  errorNewMsg:string;
  //eliminar
  errorDelete:boolean = false;
  errorDeleteData:boolean = false;
  funcionarioFilter: any = { "dni": ""};
  numElement:number = 10;
  //exportaciones
  contpdf:any = [];
  info: any = [];

  constructor(public router:Router, private funcionarioService:FuncionarioService, private excelService:ExcelService) { 
  	this.getAll();
    this.lista = true;
    this.detalle = false;
    this.crear = false;
    this.editar = false;
  }

	getAll() {
		this.funcionarioService.getAll().then(
			success => {
				this.funcionarios = success;
				this.data = this.funcionarios.data;
        var body = [];
        var excel = [];
        for(var i=0; i<this.data.length; i++){
            excel.push({'#' : this.data[i].id, 'Cédula': this.data[i].dni, 'Nombre':this.data[i].name, 'Apellido':this.data[i].lastname, 'Dirección':this.data[i].address})
            body.push([this.data[i].id, this.data[i].dni, this.data[i].name, this.data[i].lastname, this.data[i].address])
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
	  this.funcionarioService.getId(id).then(
	    success => {
	      this.funcio = success;
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

	editarFuncionario(id) {
      this.funcionarioService.getId(id).then(
        success => {
          this.funcio = success;
          this.nombre = this.funcio.name;
          this.apellido = this.funcio.lastname;
          this.direccion = this.funcio.address;
          this.identificacion = this.funcio.dni;
          this.idEdit = this.funcio.id;
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
      const editfuncionario : Funcionario = {
        id: this.idEdit,
        dni: this.identificacion,
        name: this.nombre,
        lastname: this.apellido,
        address: this.direccion
      };
      this.funcionarioService.set(editfuncionario).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorEditMsg = "NOMBRE "+error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                      this.errorEditMsg = "APELLIDO "+error.error.errors.lastname[0];
                    }
                    if(error.error.errors.address){
                      this.errorEditMsg = "DIRECCIÓN "+error.error.errors.address[0];
                    }
                    if(error.error.errors.dni){
                      this.errorEditMsg = "DNI "+error.error.errors.dni[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    crearFuncionario() {
      this.lista = false;
      this.detalle = false;
      this.crear = true;
      this.editar = false;
    }


    saveNewFuncionario() {
      const createfuncionario : Funcionario = {
        dni: this.dnia,
        name: this.namea,
        lastname: this.lastnamea,
        address: this.addressa
      };
      this.funcionarioService.add(createfuncionario).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
          this.dnia = '';
	      this.namea = '';
	      this.lastnamea = '';
	      this.addressa = '';
	      this.errorSave = false;
  		  this.errorSaveData = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorNewMsg = "NOMRBE "+error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                      this.errorNewMsg = "APELLIDO "+error.error.errors.lastname[0];
                    }
                    if(error.error.errors.address){
                      this.errorNewMsg = "DIRECCION "+error.error.errors.email[0];
                    }
                    if(error.error.errors.dni){
                      this.errorNewMsg = "DNI "+error.error.errors.dni[0];
                    }
                    this.errorSaveData = true;
                } else {
                    // on general error
                    this.errorSave = true;
                }
            }
        );
    }

    deleteFuncionario(id) {
      this.funcionarioService.delete(id).then(
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
        doc.text('Funcionarios', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Cédula', 'Nombre', 'Apellido', 'Dirección']],
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
        doc.save('funcionarios.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'funcionarios');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Funcionarios', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Cédula', 'Nombre', 'Apellido', 'Dirección']],
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
