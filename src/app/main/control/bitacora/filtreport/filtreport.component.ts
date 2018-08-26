import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BitacoraService } from '../../../../../model/bitacora/bitacora.service';
import { Bitacora } from '../../../../../model/bitacora/bitacora';
import { GuardService } from '../../../../../model/guard/guard.service';
import { IncidenciasService } from '../../../../../model/incidencias/incidencia.service';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../../model/excel/excel.services';

@Component({
  selector: 'app-filtreport',
  templateUrl: './filtreport.component.html',
  styleUrls: ['./filtreport.component.css']
})
export class FiltreportComponent {
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
  incidencias:any = [];
  inciden:any = [];
  incidenSelect:number = 0;
  haycomentarios:boolean = false;
  valueDate:any = [];
  dateSelect:any = '';
  filtro:boolean = true;
  guardiaSelect:number = 0;
  filtroSelect:number = 0;
  guardias:any = [];
  guard:any = [];
  //vistas
  lista:boolean;
  detalle:boolean;
  //comentario
  newcoment:string = '';
  addcomment:boolean = false;
  //status
  status:number = 0;
  numElement:number = 10;
  //new chart
  dataSource:any = {};
  valores:number[] = [2,2];
  names:string[] = ["Robo", "Incendio"];
  datos:any = [{"label": "Robo",
                "value": 2},
                {"label": "Incendio",
                "value": 2}];
  //exportaciones
  contpdf:any = [];
  info: any = [];
  //order table
  key: string = 'id';
  reverse: boolean = true;
  //filter chart
  rangeday:boolean = true;
  desde:string = "";
  hasta:string = "";
  chartreportes:any = [];
  chartdata:any = [];

  constructor(public router:Router, private bitacoraService:BitacoraService, private guardiaService:GuardService, 
    private incidenciaService:IncidenciasService, private excelService:ExcelService) { 
  	this.getIncidencias();
    this.getAll();
  	this.getGuardias();
    this.lista = true;
    this.detalle = false;
    this.dataSource = {
            chart: {
                "theme": "fusion",
                "showBorder": "0",
                "bgColor": "#FFFFFF",
                "bgAlpha": "50",
            },
            // Chart Data
            "data": this.datos
        };
  }

  sort(key){
    this.key = key;
    this.reverse = !this.reverse;
  }

  	getAll() {
    	this.bitacoraService.getAll().then(
    		success => {
    			this.reportes = success;
    			this.data = this.reportes.data;

          this.incidenciaService.getAll().then(
          success => {
            this.incidencias = success;
            this.inciden = this.incidencias.data;
            //exports files
            var body = [];
            var excel = [];
            var resolve = "";
            for(var i=0; i<this.data.length; i++){
                this.data[i].id = Number(this.data[i].id);
                if(this.data[i].resolved == 0){
                  resolve = "Cerrado";
                }else if(this.data[i].resolved == 1){
                  resolve = "Abierto";
                }else{
                  resolve = "Reabierto";
                }
                excel.push({'#' : this.data[i].id, 'Título': this.data[i].title, 'Observación':this.data[i].observation, 'Fecha':this.data[i].create_date, 'Status':resolve})
                body.push([this.data[i].id, this.data[i].title, this.data[i].observation, this.data[i].create_date, resolve])
            }
            this.contpdf = body;
            this.info = excel;
            //chart
            var hola = [];
            var nombres = [];
            var valores = [];
            nombres = this.nameInciden();
            valores = this.countInciden(this.data);
            for(var i=0; i<this.incidencias.total; i++){
              if(nombres[i] != "General"){
                hola.push({"label":nombres[i], "value":valores[i]})
              }
            }
            this.datos = hola;
            this.dataSource.data = this.datos;
              }, error => {
                  if (error.status === 422) {
                      // on some data incorrect
                  } else {
                      // on general error
                  }
              }
          );
          
          for(var i = 0; i < this.data.length; i++){
            if(this.data[i].resolved == 0){
              this.change[i] = 0;
            }else{
              this.change[i] = 1;
            }
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

    countInciden(data){
      var value = []
      if(data.length == 0){
        value = [];
        return value;
      }else{
        for(var j=0; j<this.incidencias.total; j++){
          var hola = 0;
            for(var i=0; i<data.length; i++){
              if(data[i].incidence_id == this.inciden[j].id){
                hola++;
              }
            }
          value[j] = hola; 
      }
      return value;
    }
  }

    countIncidenDate(data){
        var value = []

        var fecha1 = String(this.desde);
        var valueDate1 = fecha1.split('-');
        var year1 = valueDate1[0];
        var month1 = valueDate1[1];
        var day1 = valueDate1[2];

        var fecha2 = String(this.hasta);
        var valueDate2 = fecha2.split('-');
        var year2 = valueDate2[0];
        var month2 = valueDate2[1];
        var day2 = valueDate2[2];

        var date1 = fecha1.replace('-','');
        var date11 = Number(date1.replace('-',''));
        var date2 = fecha2.replace('-','');
        var date22 = Number(date2.replace('-',''));        

        if(data.length == 0){
          value = [];
          return value;
        }else{
          for(var j=0; j<this.incidencias.total; j++){
            var hola = 0;
              for(var i=0; i<data.length; i++){
                var date = String(this.chartdata[i].create_date);
                var valueDate = date.split(' ');
                var fecha = valueDate[0].toString();
                var fecha1 = fecha.replace('-','');
                var fecha11 = Number(fecha1.replace('-',''));
                console.log(fecha11);
                console.log(date11);
                console.log(date22);

                if(fecha11 >= date11 && fecha11 <= date22){
                  if(data[i].incidence_id == this.inciden[j].id){
                    hola++;
                  }
                }                
              }
            value[j] = hola; 
        }
        return value;
      }
    }

    nameInciden(){
      var name = [];
      for(var i=0; i<this.incidencias.total; i++){
        name[i] = this.inciden[i].name;
      }
      return name;
    }

    getChartDate(){
      var fecha1 = String(this.desde);
      var valueDate1 = fecha1.split('-');
      var year1 = valueDate1[0];
      var month1 = valueDate1[1];
      var day1 = valueDate1[2];

      var fecha2 = String(this.hasta);
      var valueDate2 = fecha2.split('-');
      var year2 = valueDate2[0];
      var month2 = valueDate2[1];
      var day2 = valueDate2[2];

      var date1 = fecha1.replace('-','');
      var date11 = Number(date1.replace('-',''));
      var date2 = fecha2.replace('-','');
      var date22 = Number(date2.replace('-',''));

      if(this.rangeday){
        if(this.desde == ""){
          this.bitacoraService.getAll().then(
          success => {
            this.chartreportes = success;
            this.chartdata = this.chartreportes.data;
            //chart
            var hola = [];
            var nombres = [];
            var valores = [];
            nombres = this.nameInciden();
            valores = this.countInciden(this.chartdata);
            for(var i=0; i<this.incidencias.total; i++){
              if(nombres[i] != "General"){
                hola.push({"label":nombres[i], "value":valores[i]})
              }
            }
            this.datos = hola;
            this.dataSource.data = hola;
              }, error => {
                  if (error.status === 422) {
                      // on some data incorrect
                  } else {
                      // on general error
                  }
              }
          );
        }else{
          this.bitacoraService.getByDate(year1, month1, day1).then(
          success => {
            this.chartreportes = success;
            this.chartdata = this.chartreportes.data;
            //chart
            var hola = [];
            var nombres = [];
            var valores = [];
            nombres = this.nameInciden();
            valores = this.countInciden(this.chartdata);
            for(var i=0; i<this.incidencias.total; i++){
              if(nombres[i] != "General"){
                hola.push({"label":nombres[i], "value":valores[i]})
              }
            }
            this.datos = hola;
            this.dataSource.data = hola;
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
        if(this.desde == ""){
          this.hasta = "";
          this.bitacoraService.getAll().then(
          success => {
            this.chartreportes = success;
            this.chartdata = this.chartreportes.data;
            //chart
            var hola = [];
            var nombres = [];
            var valores = [];
            nombres = this.nameInciden();
            valores = this.countInciden(this.chartdata);
            for(var i=0; i<this.incidencias.total; i++){
              if(nombres[i] != "General"){
                hola.push({"label":nombres[i], "value":valores[i]})
              }
            }
            this.datos = hola;
            this.dataSource.data = hola;
              }, error => {
                  if (error.status === 422) {
                      // on some data incorrect
                  } else {
                      // on general error
                  }
              }
          );
        }else{
          if(this.hasta != ""){
            this.bitacoraService.getAll().then(
            success => {
              this.chartreportes = success;
              this.chartdata = this.chartreportes.data;
              //chart
              var hola = [];
              var nombres = [];
              var valores = [];
              nombres = this.nameInciden();
              valores = this.countIncidenDate(this.chartdata);
              for(var i=0; i<this.incidencias.total; i++){
                if(nombres[i] != "General"){
                  hola.push({"label":nombres[i], "value":valores[i]})                
                }
              }
              console.log(hola);
              this.datos = hola;
              this.dataSource.data = hola;
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
            this.getAll();
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
          this.getAll();
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
            this.getAll();
          }else{
            this.bitacoraService.getByDate(year, month, day).then(
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
            this.bitacoraService.getByIncidenAll(id).then(
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
    	this.bitacoraService.getByIncidenciaDate(id, year, month, day).then(
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
    		this.getAll();
    	}else{
    		this.incidenSelect = 0;
    		this.guardiaSelect = 0;
    		this.dateSelect = '';
    		this.filtro = false;
    		this.getAll();
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
            this.getAll();
          }else{
            this.bitacoraService.getByDate(year, month, day).then(
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
            this.bitacoraService.getByGuardiaAll(id).then(
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
    	this.bitacoraService.getByGuardiaDate(id, year, month, day).then(
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
        doc.text('Todos los Reportes', 15, 27)
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
        doc.save('reportes.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'reportes');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Todos los Reportes', 15, 27)
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

    selectRange(id){
      if(id == 1){
        this.rangeday = true;
        this.desde = "";
        this.hasta = "";
      }else{
        this.rangeday = false;
        this.desde = "";
        this.hasta = "";
      }
    }

    public doughnutChartType:string = 'doughnut';
    public doughnutColors:any[] = [{ backgroundColor: ['#dc3545', '#ffc107'] }]

}
