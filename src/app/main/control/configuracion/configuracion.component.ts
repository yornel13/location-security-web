import { Component, OnInit } from '@angular/core';
import { ConfiguracionService } from '../../../../model/configuracion/configuracion.service';
import { Configuracion } from '../../../../model/configuracion/configuracion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent  {
  //general
  configuraciones:any = [];
  data:any = {};
  configid:any = [];
  lista:boolean;
  detalle:boolean;
  editar:boolean;
  crear:boolean;
  //editar
  nombre:string;
  valor:string;
  idEdit:number;
  errorEdit:boolean = false;
  errorEditData:boolean = false;
  errorEditMsg:string;
  //crear
  namea:string;
  valora:string = '';
  errorSave:boolean = false;
  errorSaveData:boolean = false;
  errorNewMsg:string;
  //eliminar
  errorDelete:boolean = false;
  errorDeleteData:boolean = false;

  constructor(public router:Router, private configuracionService:ConfiguracionService) { 
  	this.getTablet();
  	this.regresar();
  }

  getAll() {
    	this.configuracionService.getAll().then(
    		success => {
    			this.configuraciones = success;
    			this.data = this.configuraciones.data;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }


    getTablet() {
      this.configuracionService.getTablet().then(
        success => {
          this.configuraciones = success;
          this.data = this.configuraciones;
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
	  this.editar = false;
	  this.errorEditData = false;
      this.errorEdit = false;
	}

	editarConfiguracion(id) {
      this.configuracionService.getId(id).then(
        success => {
          this.configid = success;
          this.nombre = this.configid.name;
          this.valor = this.configid.value;
          this.idEdit = this.configid.id;
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
      const editincidencia : Configuracion = {
        id: this.idEdit,
        value: this.valor,
        name: this.nombre
      };
      this.configuracionService.set(editincidencia).then(
        success => {
          this.getTablet();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    console.log(error.error);
                    if(error.error.errors.name){
                      this.errorEditMsg = error.error.errors.name[0];
                    }
                    if(error.error.errors.value){
                      this.errorEditMsg = error.error.errors.value[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    crearConfiguracion() {
      this.lista = false;
      this.detalle = false;
      this.crear = true;
      this.editar = false;
    }

    saveNewConfiguracion() {
      const createadmin : Configuracion = {
        name: this.namea,
        value: this.valora.toString()
      };
      if(this.valora == ''){
        this.errorSave = true;
      }else{
        this.configuracionService.add(createadmin).then(
        success => {
          this.getTablet();
          this.regresar();
          this.namea = '';
          this.valora = '';
          this.errorSave = false;
          this.errorSaveData = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                    this.errorSave = true;
                }
            }
        );
      }
    }

    deleteConfiguracion(id) {
      this.configuracionService.delete(id).then(
        success => {
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

}
