import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertaService } from '../../../../model/alerta/alerta.service';
import { Alerta } from '../../../../model/alerta/alerta';
import { GuardService } from '../../../../model/guard/guard.service';
import { AgmMap } from '@agm/core';

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

  constructor(private alertaService:AlertaService, private guardiaService:GuardService) { 
  	this.getAll();
  	this.getGuardias();
  	this.doughnutChartData = [3, 3];
  	this.regresar();
  }

  getAll() {
        this.alertaService.getAll().then(
            success => {
                this.alertas = success;
                this.data = this.alertas.data;
                this.doughnutChartData = this.countAlert(this.data);
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
    		values = [sos, drop];
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

	public doughnutChartLabels:string[] = ['SOS', 'Caída'];
    public doughnutChartData2:number[] = [3, 3];
    public doughnutChartType:string = 'doughnut';
    public doughnutColors:any[] = [{ backgroundColor: ['#dc3545', '#ffc107'] }]

}
