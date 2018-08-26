import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WatchesService } from '../../../../../model/watch/watch.service';
import { Watch } from '../../../../../model/watch/watch';
import { GuardService } from '../../../../../model/guard/guard.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';

@Component({
  selector: 'app-wtodas',
  templateUrl: './wtodas.component.html',
  styleUrls: ['./wtodas.component.css']
})
export class WtodasComponent {
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
  numElement:number = 10;
  //exportaciones
  contpdf:any = [];
  info: any = [];

  key: string = 'id'; //set default
  reverse: boolean = false;

  constructor(public router:Router, private watchesService:WatchesService, private guardiasService:GuardService, private excelService:ExcelService) { 
  	this.getAll();
  	this.getGuard();
  	this.lista = true;
  	this.detalle = false;
  }

  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  getAll() {
  	this.watchesService.getAll().then(
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
                  this.data[i].update_date = "--";
                }
                excel.push({'#' : this.data[i].id, 'Nombre del Guardia': this.data[i].guard_name+' '+this.data[i].guard_lastname, 'Cédula del Guardia':this.data[i].guard_dni, 'Hora de inicio':this.data[i].create_date, 'Hora de finalización':this.data[i].update_date, 'Status':status})
                body.push([this.data[i].id, this.data[i].guard_name+' '+this.data[i].guard_lastname, this.data[i].guard_dni, this.data[i].create_date, this.data[i].update_date, status]);
                this.data[i].id = Number(this.data[i].id);
                this.data[i].guard_dni = Number(this.data[i].guard_dni);
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

  regresar() {
  	this.lista = true;
  	this.detalle = false;
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
  	var fecha = String(this.dateSelect);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];
  	if (id == 0){
  		if (this.dateSelect == ''){
  			this.getAll();
  		}else{
  			this.watchesService.getByDate(year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
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
  		if(this.dateSelect == ''){
  			this.watchesService.getByGuard(id).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}else{
  			this.watchesService.getByGuardDate(id, year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
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

  getByDate(date) {
  	var fecha = String(date);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];
	if (this.guardiaSelect == 0){
  		if (this.dateSelect == ''){
  			this.getAll();
  		}else{
  			this.watchesService.getByDate(year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
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
  		if(this.dateSelect == ''){
  			this.watchesService.getByGuard(this.guardiaSelect).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}else{
  			this.watchesService.getByGuardDate(this.guardiaSelect, year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
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

  viewDetail(id){
  	this.watchesService.getById(id).then(
        success => {
          this.guardia = success;
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

  pdfDownload() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todas las Guardias', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio', 'Hora de finalización', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 'auto'},
              5: {columnWidth: 20}
            }
        });   
        doc.save('guardias.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'guardias');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todas las Guardias', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio', 'Hora de finalización', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 'auto'},
              5: {columnWidth: 20}
            }
        });   
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }


}
