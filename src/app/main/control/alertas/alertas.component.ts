import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertaService } from '../../../../model/alerta/alerta.service';
import { Alerta } from '../../../../model/alerta/alerta';
import { GuardService } from '../../../../model/guard/guard.service';
import { AgmMap } from '@agm/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ExcelService } from '../../../../model/excel/excel.services';

@Component({
  selector: 'app-alertas',
  templateUrl: './alertas.component.html',
  styleUrls: ['./alertas.component.css']
})
export class AlertasComponent  {
  alertas:any = undefined;
  data:any = undefined;
  guardias:any = undefined;
  guard:any = undefined;
  numElement:number = 10;
  causes:any = undefined;
  cuase:any = [];
  detailcause:any = [];
  //filtros
  filtroSelect:number = 0;
  causaSelect:number = 0;
  causaElegida:string = "ALL";
  guardiaSelect:number = 0;
  filtro:boolean = true;
  dateSelect:string = "";
  doughnutChartData:number[] = [3,3];
  lista:boolean = true;
  detalle:boolean = false;
  //new chart
  dataSource:any = {};
  valores:number[] = [1,1,1];
  //exportaciones
  contpdf:any = [];
  info: any = [];

  key: string = 'id'; //set default
  reverse: boolean = true;

  constructor(private alertaService:AlertaService, private guardiaService:GuardService, private excelService:ExcelService) { 
  	this.getAll();
  	this.getGuardias();
  	this.doughnutChartData = [3, 3, 0];
  	this.regresar();

  	this.dataSource = {
        chart: {
            "theme": "fusion",
            "showBorder": "0",
            "bgColor": "#FFFFFF",
            "bgAlpha": "50",
        },
        // Chart Data
        "data": [{
            "label": "SOS",
            "color": "#dc3545",
            "value": this.valores[0]
        }, {
            "label": "Caída",
            "color": "#ffc107",
            "value": this.valores[1]
        }, {
            "label": "Salida del cerco",
            "color": "#28a745",
            "value": this.valores[2]
        }]
    };

  }

  	sort(key){
	  this.key = key;
	  this.reverse = !this.reverse;
	}

  getAll() {
        this.alertaService.getAll().then(
            success => {
                this.alertas = success;
                this.data = this.alertas.data;
                this.valores = this.countAlert(this.data);
                this.dataSource.data[0].value = this.valores[0];
	            this.dataSource.data[1].value = this.valores[1];
	            this.dataSource.data[2].value = this.valores[2];
	            var body = [];
		        var excel = [];
		        var status = "";
		        var cause = "";
		        for(var i=0; i<this.data.length; i++){
		        	this.data[i].id = Number(this.data[i].id);
		        	
		        	if(this.data[i].status == 1){
		        		status = "Activa"
		        	}else{
		        		status = "Aceptada"
		        	}

					if(this.data[i].cause == "SOS1"){
						cause = "SOS";
					}else if(this.data[i].cause == "DROP"){
						cause = "Caída";
					}else if(this.data[i].cause == "OUT_BOUNDS"){
						cause = "Salida del cerco";
					}else if(this.data[i].cause == "GENERAL"){
						cause = "General";
					}

		            excel.push({'#' : this.data[i].id, 'Causa': cause, 'Descripción':this.data[i].message, 'Generado por':this.data[i].guard_name+' '+this.data[i].guard_lastname, 'Fecha':this.data[i].create_date, 'Status':status})
		            body.push([this.data[i].id, cause, this.data[i].message, this.data[i].guard_name+' '+this.data[i].guard_lastname, this.data[i].create_date, status])
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

    viewDetail(id){
    	this.alertaService.getId(id).then(
            success => {
                this.detailcause = success;
                this.lista = false;
                this.detalle = true;
                this.detailcause.latitude = Number(this.detailcause.latitude);
          		this.detailcause.longitude = Number(this.detailcause.longitude);
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    regresar(){
    	this.lista = true;
    	this.detalle = false;
    }

    countAlert(data){
    	var values = [];
    	var sos = 0;
    	var drop = 0;
    	if(data.length == 0){
    		values = [0, 0];
    		return values;
    	}else{
    		for(var i=0; i<data.length; i++){
    			if(data[i].cause == "SOS1"){
    				sos++;
    			}
    			if(data[i].cause == "DROP"){
    				drop++;
    			}
    		}
    		values = [sos, drop, 0];
    		return values;
    	}
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

	solveAlert(id) {
		this.alertaService.solveAlert(id).then(
	    success => {
	      this.getAlerts();
	        }, error => {
	            if (error.status === 422) {
	                // on some data incorrect
	            } else {
	                // on general error
	            }
	        }
	    );
	}

	getAlerts() {
		//formateo de causas
		var cause = "all";
		if(this.causaSelect == 0){
			cause = "all";
		}else if(this.causaSelect == 1){
			cause = "SOS1";
		}else if(this.causaSelect == 2){
			cause = "DROP";
		}else if(this.causaSelect == 3){
			cause = "OUT_BOUNDS";
		}else if(this.causaSelect == 4){
			cause = "GENERAL";
		}
		//formateo de fecha
		var fecha = String(this.dateSelect);
        var valueDate = fecha.split('-');
        var year = valueDate[0];
        var month = valueDate[1];
        var day = valueDate[2];
        //formateo de guardias
        var guardia = this.guardiaSelect;

        //Iniciar búsqueda
		if(fecha == ""){
			if(cause == "all"){
				if(guardia == 0){
					this.getAll();
				}else{
					this.alertaService.getByGuard(guardia).then(
				    success => {
				      this.alertas = success;
			          this.data = this.alertas.data;
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
				if(guardia == 0){
					this.alertaService.getByCause(cause).then(
				    success => {
				      this.alertas = success;
			          this.data = this.alertas.data;
				        }, error => {
				            if (error.status === 422) {
				                // on some data incorrect
				            } else {
				                // on general error
				            }
				        }
				    );
				}else{
					this.alertaService.getByGuardCause(guardia, cause).then(
				    success => {
				      this.alertas = success;
			          this.data = this.alertas.data;
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
		}else{
			if(cause == "all"){
				if(guardia == 0){
					this.alertaService.getByCauseDate(cause, year, month, day).then(
				    success => {
				      this.alertas = success;
			          this.data = this.alertas.data;
				        }, error => {
				            if (error.status === 422) {
				                // on some data incorrect
				            } else {
				                // on general error
				            }
				        }
				    );
				}else{
					this.alertaService.getByGuardDate(guardia, year, month, day).then(
				    success => {
				      this.alertas = success;
			          this.data = this.alertas.data;
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
				if(guardia == 0){
					this.alertaService.getByCauseDate(cause, year, month, day).then(
				    success => {
				      this.alertas = success;
			          this.data = this.alertas.data;
				        }, error => {
				            if (error.status === 422) {
				                // on some data incorrect
				            } else {
				                // on general error
				            }
				        }
				    );
				}else{
					this.alertaService.getByGuardCaseDate(guardia, cause, year, month, day).then(
				    success => {
				      this.alertas = success;
			          this.data = this.alertas.data;
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

	pdfDownload() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Alertas', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Causa', 'Descripción', 'Generado por', 'Fecha', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
            	0: {columnWidth: 10},
			    1: {columnWidth: 20},
			    2: {columnWidth: 'auto'},
			    3: {columnWidth: 'auto'},
			    4: {columnWidth: 'auto'},
			    5: {columnWidth: 20},
            }
        });   
        doc.save('alertas.pdf');
    }

    excelDownload() {
        this.excelService.exportAsExcelFile(this.info, 'visitas');
    }

    print() {
        var doc = new jsPDF();
        doc.setFontSize(20)
        doc.text('ICSSE Seguridad', 15, 20)
        doc.setFontSize(12)
        doc.setTextColor(100)
        var d = new Date();
        var fecha = d.getDate()+'/'+d.getMonth()+'/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        doc.text('Alertas', 15, 27)
        doc.text('Fecha: '+ fecha, 15, 34)
        doc.autoTable({
            head: [['#', 'Causa', 'Descripción', 'Generado por', 'Fecha', 'Status']],
            body: this.contpdf,
            startY: 41,
            columnStyles: {
            	0: {columnWidth: 10},
			    1: {columnWidth: 20},
			    2: {columnWidth: 'auto'},
			    3: {columnWidth: 'auto'},
			    4: {columnWidth: 'auto'},
			    5: {columnWidth: 20},
            }
        });   
        doc.autoPrint();
        window.open(doc.output('bloburl'), '_blank');
    }

}
