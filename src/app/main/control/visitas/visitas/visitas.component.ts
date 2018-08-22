import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitasService } from '../../../../../model/visitas/visitas.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import { VisitaVehiculoService } from '../../../../../model/visitavehiculo/visitavehiculo.service';
import { VisitanteService } from '../../../../../model/vistavisitantes/visitantes.service';
import { FuncionarioService } from '../../../../../model/funcionarios/funcionario.service';

@Component({
  selector: 'app-visitas',
  templateUrl: './visitas.component.html',
  styleUrls: ['./visitas.component.css']
})
export class VisitasComponent {
  //general
  visitas:any = undefined;
  data:any = undefined;
  visi:any = [];
  modalimg:any = [];
  dateSelect:any = '';
  nomat:boolean;
  //vistas vehiculos
  lista:boolean;
  detalle:boolean;
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
  userFilter: any = { "plate": "" };

  constructor(public router:Router, private visitasService:VisitasService, private guardiaService:GuardService,
  	private vehiculoService:VisitaVehiculoService, private visitanteService:VisitanteService, private funcionarioService:FuncionarioService) { 
  	this.lista = true;
    this.detalle = false;
  	this.getAll();
  	this.getGuard();
  	this.getVehiculos();
  	this.getVisitantes();
  	this.getFuncionarios();
  }

  getAll(){
  	this.visitasService.getAll().then(
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

  getByVehiculo(id){
  	var fecha = String(this.dateSelect);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];

  	if(this.dateSelect == ''){
  		if(id == 0){
  			this.getAll();
  		}else{
  			this.visitasService.getByVehiculo(id).then(
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
  			this.visitasService.getByDate(year, month, day).then(
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
  			this.visitasService.getByVehiculoDate(id, year, month, day).then(
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
  			this.getAll();
  		}else{
  			this.visitasService.getByGuard(id).then(
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
  			this.visitasService.getByDate(year, month, day).then(
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
  			this.visitasService.getByGuardDate(id, year, month, day).then(
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
  			this.getAll();
  		}else{
  			this.visitasService.getByVisitante(id).then(
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
  			this.visitasService.getByDate(year, month, day).then(
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
  			this.visitasService.getByVisitanteDate(id, year, month, day).then(
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
  			this.getAll();
  		}else{
  			this.visitasService.getByFuncionario(id).then(
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
  			this.visitasService.getByDate(year, month, day).then(
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
  			this.visitasService.getByFuncionarioDate(id, year, month, day).then(
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

  getByDate(date){
  	var fecha = String(date);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];
	//Vehiculo
  	if(this.filtroSelect == 0){
  		if(date == ''){
  			if(this.vehiculoSelect ==0 ){
  				this.getAll();
  			}else{
  				this.visitasService.getByVehiculo(this.vehiculoSelect).then(
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
  			if(this.vehiculoSelect == 0){
  				this.visitasService.getByDate(year, month, day).then(
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
  				this.visitasService.getByVehiculoDate(this.vehiculoSelect, year, month, day).then(
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
  	//Guardia
  	if(this.filtroSelect == 1){
  		if(date == ''){
  			if(this.guardiaSelect ==0 ){
  				this.getAll();
  			}else{
  				this.visitasService.getByGuard(this.guardiaSelect).then(
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
  			if(this.guardiaSelect == 0){
  				this.visitasService.getByDate(year, month, day).then(
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
  				this.visitasService.getByGuardDate(this.guardiaSelect, year, month, day).then(
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
  	//Visitantes
  	if(this.filtroSelect == 2){
  		if(date == ''){
  			if(this.visitanteSelect ==0 ){
  				this.getAll();
  			}else{
  				this.visitasService.getByVisitante(this.visitanteSelect).then(
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
  			if(this.visitanteSelect == 0){
  				this.visitasService.getByDate(year, month, day).then(
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
  				this.visitasService.getByVisitanteDate(this.visitanteSelect, year, month, day).then(
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
  	//Funcionario
  	if(this.filtroSelect == 3){
  		if(date == ''){
  			if(this.funcionarioSelect ==0 ){
  				this.getAll();
  			}else{
  				this.visitasService.getByFuncionario(this.funcionarioSelect).then(
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
  			if(this.funcionarioSelect == 0){
  				this.visitasService.getByDate(year, month, day).then(
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
  				this.visitasService.getByFuncionarioDate(this.funcionarioSelect, year, month, day).then(
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
  }

  viewDetail(id) {
    this.visitasService.getId(id).then(
      success => {
        this.visi = success;
        console.log(this.visi);
        this.modalimg = [];
        this.modalimg.push(this.visi.image_1);
        this.modalimg.push(this.visi.image_2);
        this.modalimg.push(this.visi.image_3);
        this.modalimg.push(this.visi.image_4);
        this.modalimg.push(this.visi.image_5);
        this.visi.observation = JSON.parse(this.visi.observation);
        if(this.visi.observation){
          if(this.visi.observation.length == 0){
            this.nomat = true
          }else{
            this.nomat = false;
          }
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


}
