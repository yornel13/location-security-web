import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WatchesService } from '../../../../../model/watch/watch.service';
import { Watch } from '../../../../../model/watch/watch';
import { GuardService } from '../../../../../model/guard/guard.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';

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
  guardiaFilter: any = { "guard":{ "dni" : ""}};
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

  constructor(public router:Router, private watchesService:WatchesService, private guardiasService:GuardService, private excelService:ExcelService) { 
  	this.getAll();
  	this.getGuard();
  	this.lista = true;
  	this.detalle = false;
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
                excel.push({'#' : this.data[i].id, 'Nombre del Guardia': this.data[i].guard.name+' '+this.data[i].guard.lastname, 'Cédula del Guardia':this.data[i].guard.dni, 'Hora de inicio':this.data[i].create_date, 'Status':status})
                body.push([this.data[i].id, this.data[i].guard.name+' '+this.data[i].guard.lastname, this.data[i].guard.dni, this.data[i].create_date, status])
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
        doc.text('Guardias Activas', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 20}
            }
        });   
        doc.save('guardiasactivas.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'guardiasactivas');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Guardias Activas', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Nombre del Guardia', 'Cédula del Guardia', 'Hora de inicio', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
              0: {columnWidth: 10},
              1: {columnWidth: 'auto'},
              2: {columnWidth: 'auto'},
              3: {columnWidth: 'auto'},
              4: {columnWidth: 20}
            }
        });   
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }


}
