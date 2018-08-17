import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BitacoraService } from '../../../../../model/bitacora/bitacora.service';
import { Bitacora } from '../../../../../model/bitacora/bitacora';
import { GuardService } from '../../../../../model/guard/guard.service';
import { IncidenciasService } from '../../../../../model/incidencias/incidencia.service';

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

  constructor(public router:Router, private bitacoraService:BitacoraService, private guardiaService:GuardService, private incidenciaService:IncidenciasService ) { 
  	this.getAll();
  	this.getIncidencias();
  	this.getGuardias();
    this.lista = true;
    this.detalle = false;
  }

  	getAll() {
    	this.bitacoraService.getAll().then(
    		success => {
    			this.reportes = success;
    			this.data = this.reportes.data;
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

    viewDetail(id) {
      this.bitacoraService.getId(id).then(
        success => {
          this.report = success;
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
    	if(id == 0){
    		if(this.dateSelect == ''){
    			this.getAll();
    		}else{
    			this.getByDate(this.dateSelect);
    		}
    	}else{
    		if(this.dateSelect == ''){
    			this.bitacoraService.getByInciden(id).then(
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
    			var fecha = String(this.dateSelect);
		    	this.valueDate = fecha.split('-');
		    	var year = this.valueDate[0];
		    	var month = this.valueDate[1];
		    	var day = this.valueDate[2];
    			this.getByIncidenciaDate(id, year, month, day);
    		}
    		
    	}
    }

    getByDate(date) {
    	var fecha = String(date);
    	this.valueDate = fecha.split('-');
    	var year = this.valueDate[0];
    	var month = this.valueDate[1];
    	var day = this.valueDate[2];
    	if(date == ''){
    		if(this.filtro){
    			if(this.incidenSelect == 0){
    				this.getAll();
    			}else{
    				this.getByIncidencia(this.incidenSelect);
    			}
    		}else{
    			if(this.guardiaSelect == 0){
    				this.getAll();
    			}else{
    				this.getByGuardia(this.guardiaSelect);
    			}
    		}
    	}else{
    		if(this.filtro){
    			if(this.incidenSelect == 0){
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
    			}else{
    				this.getByIncidenciaDate(this.incidenSelect, year, month, day);
    			}
    		}else{
    			if(this.guardiaSelect == 0){
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
    			}else{
    				this.getByGuardiaDate(this.guardiaSelect, year, month, day);
    			}
    		}
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
    	if(id == 0){
    		if(this.dateSelect == ''){
    			this.getAll();
    		}else{
    			this.getByDate(this.dateSelect);
    		}
    	}else{
    		if(this.dateSelect == ''){
    			this.bitacoraService.getByGuardia(id).then(
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
    			var fecha = String(this.dateSelect);
		    	this.valueDate = fecha.split('-');
		    	var year = this.valueDate[0];
		    	var month = this.valueDate[1];
		    	var day = this.valueDate[2];
    			this.getByGuardiaDate(id, year, month, day);
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

}
