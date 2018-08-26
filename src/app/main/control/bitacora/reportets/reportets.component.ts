import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BitacoraService } from '../../../../../model/bitacora/bitacora.service';
import { Bitacora } from '../../../../../model/bitacora/bitacora';
import { GuardService } from '../../../../../model/guard/guard.service';
import { AgmMap } from '@agm/core';
import { IncidenciasService } from '../../../../../model/incidencias/incidencia.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';

@Component({
  selector: 'app-reportets',
  templateUrl: './reportets.component.html',
  styleUrls: ['./reportets.component.css']
})
export class ReportetsComponent {
  //general
  reportes:any = [];
  data:any = [];
  open:any = [];
  reopen:any = [];
  report:any = [];
  comentarios:any = [];
  coment:any = [];
  resolved:number = 0;
  change:any = [];
  haycomentarios:boolean = false;
  incidencias:any = [];
  inciden:any = [];
  incidenSelect:number = 0;
  //vistas
  lista:boolean;
  detalle:boolean;
  //comentario
  newcoment:string = '';
  addcomment:boolean = false;
  lat: number = 0;
  lng: number = 0;
  valueDate:any = [];
  dateSelect:any = '';
  filtro:boolean = true;
  guardiaSelect:number = 0;
  filtroSelect:number = 0;
  guardias:any = [];
  guard:any = [];
  //status
  status:number = 0;
  hay: boolean;
  numElement:number = 10;
  //exportaciones
  contpdf:any = [];
  info: any = [];

  key: string = 'id'; //set default
  reverse: boolean = true;


  constructor(public router:Router, private bitacoraService:BitacoraService, private guardiaService:GuardService, 
    private incidenciaService:IncidenciasService, private excelService:ExcelService ) { 
  	this.getOpenAll();
    this.getIncidencias();
    this.getGuardias();
    this.lista = true;
    this.detalle = false;
  }

  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

    getOpenAll() {
      this.bitacoraService.getOpenAll().then(
        success => {
          this.reportes = success;
          this.data = this.reportes.data;
          var body = [];
          var excel = [];
          var resolve = "";
          for(var i=0; i<this.data.length; i++){
              if(this.data[i].resolved == 0){
                resolve = "Cerrado";
              }else if(this.data[i].resolved == 1){
                resolve = "Abierto";
              }else{
                resolve = "Reabierto";
              }
              this.data[i].id = Number(this.data[i].id);
              excel.push({'#' : this.data[i].id, 'Título': this.data[i].title, 'Observación':this.data[i].observation, 'Fecha':this.data[i].create_date, 'Status':resolve})
              body.push([this.data[i].id, this.data[i].title, this.data[i].observation, this.data[i].create_date, resolve])
          }
          this.contpdf = body;
          this.info = excel;
          if(this.reportes.total == 0){
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

    viewDetail(id) {
      this.bitacoraService.getId(id).then(
        success => {
          this.report = success;
          this.report.latitude = Number(this.report.latitude);
          this.report.longitude = Number(this.report.longitude);
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

      this.bitacoraService.getComentarios(id).then(
        success => {
          this.comentarios = success;
          this.coment = this.comentarios.data;
          if(this.coment.length == 0){
            this.haycomentarios = false;
          }else{
            this.haycomentarios = true;
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

    changeResolve(id, resolved) {
      if(resolved == 0){
        this.bitacoraService.setReopen(id).then(
          succcess =>{
            this.getOpenAll();
          }, error=>{
            if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
          }
        );
      }else{
        this.bitacoraService.setClose(id).then(
        success => {
          this.getOpenAll();
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


    getIncidencias() {
      this.incidenciaService.getAll().then(
        success => {
          this.incidencias = success;
          this.inciden = this.incidencias.data;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getGuardias() {
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
    getByIncidencia(id) {
      var fecha = String(this.dateSelect);
      this.valueDate = fecha.split('-');
      var year = this.valueDate[0];
      var month = this.valueDate[1];
      var day = this.valueDate[2];
      //Todos
      if(this.status == 0){
        if(id == 0){
          if(this.dateSelect == ''){
            this.getOpenAll();
          }else{
            this.bitacoraService.getOpenDate(year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
            this.bitacoraService.getByIncidenciaOpen(id).then(
              success => {
                this.reportes = success;
              this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.getByIncidenciaDate(id, year, month, day);
          }
        }
        //Abiertos
      }else if(this.status == 1){
        if(id == 0){
          if(this.dateSelect == ''){
            this.bitacoraService.getOpenAll().then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.bitacoraService.getOpenDate(year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
            this.bitacoraService.getByIncidenciaOpen(id).then(
              success => {
                this.reportes = success;
              this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.bitacoraService.getByIncidenciaOpenDate(id, year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
        //Cerrados
      }else{
        if(id == 0){
          if(this.dateSelect == ''){
            this.bitacoraService.getCloseAll().then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.bitacoraService.getCloseDate(year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
            this.bitacoraService.getByIncidenciaClose(id).then(
              success => {
                this.reportes = success;
              this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.bitacoraService.getByIncidenciaCloseDate(id, year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
    }

    getByDate() {
      if(this.filtroSelect == 0){
        this.getByIncidencia(this.incidenSelect);
      }else{
        this.getByGuardia(this.guardiaSelect);
      }
    }

    getByIncidenciaDate(id, year, month, day) {
      this.bitacoraService.getByIncidenciaOpenDate(id, year, month, day).then(
          success => {
            this.reportes = success;
          this.data = this.reportes.data;
              }, error => {
                  if (error.status === 422) {
                      // on some data incorrect
                  } else {
                      // on general error
                  }
              }
          );
    }

    getByStatus(status){
      if(this.filtroSelect == 0){
        this.getByIncidencia(this.incidenSelect);
      }else{
        this.getByGuardia(this.guardiaSelect);
      }
    }

    selectFilert(filter) {
      if (filter == 0){
        this.guardiaSelect = 0;
        this.incidenSelect = 0;
        this.dateSelect = '';
        this.filtro = true;
        this.getOpenAll();
      }else{
        this.incidenSelect = 0;
        this.guardiaSelect = 0;
        this.dateSelect = '';
        this.filtro = false;
        this.getOpenAll();
      }
    }

    getByGuardia(id) {
      var fecha = String(this.dateSelect);
      this.valueDate = fecha.split('-');
      var year = this.valueDate[0];
      var month = this.valueDate[1];
      var day = this.valueDate[2];
      //Todos
      if(this.status == 0){
        if(id == 0){
          if(this.dateSelect == ''){
            this.getOpenAll();
          }else{
            this.bitacoraService.getOpenDate(year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
            this.bitacoraService.getByGuardiaOpen(id).then(
              success => {
                this.reportes = success;
              this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.getByGuardiaDate(id, year, month, day);
          }
        }
        //Abiertos
      }else if(this.status == 1){
        if(id == 0){
          if(this.dateSelect == ''){
            this.bitacoraService.getOpenAll().then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.bitacoraService.getOpenDate(year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
            this.bitacoraService.getByGuardiaOpen(id).then(
              success => {
                this.reportes = success;
              this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.bitacoraService.getByGuardiaOpenDate(id, year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
        //Cerrados
      }else{
        if(id == 0){
          if(this.dateSelect == ''){
            this.bitacoraService.getCloseAll().then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.bitacoraService.getCloseDate(year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
            this.bitacoraService.getByGuardiaClose(id).then(
              success => {
                this.reportes = success;
              this.data = this.reportes.data;
                  }, error => {
                      if (error.status === 422) {
                          // on some data incorrect
                      } else {
                          // on general error
                      }
                  }
              );
          }else{
            this.bitacoraService.getByGuardiaCloseDate(id, year, month, day).then(
              success => {
                this.reportes = success;
                this.data = this.reportes.data;
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
    }

    getByGuardiaDate(id, year, month, day) {
      this.bitacoraService.getByGuardiaOpenDate(id, year, month, day).then(
          success => {
            this.reportes = success;
          this.data = this.reportes.data;
              }, error => {
                  if (error.status === 422) {
                      // on some data incorrect
                  } else {
                      // on general error
                  }
              }
          );
    }

    agregarComentario(){
        this.addcomment = true;
    }

    guardarComentario(report_id){
      var useradmin = "Usuario Admin";
      var idAdmin = "1";
      var report = report_id;
      var comentario = this.newcoment;
      const nuevocom : Bitacora = {
        report_id: report,
        text: comentario,
        admin_id: idAdmin,
        user_name: useradmin,
      };
      this.bitacoraService.addCommetario(nuevocom).then(
        success => {
          this.viewDetail(report_id);
          this.addcomment = false;
          this.newcoment = '';
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
        doc.text('Reportes Abiertos', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Título', 'Observación', 'Fecha', 'Status']],
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
        doc.save('reportesopen.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'reportesopen');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Reportes Abiertos', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Título', 'Observación', 'Fecha', 'Status']],
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
