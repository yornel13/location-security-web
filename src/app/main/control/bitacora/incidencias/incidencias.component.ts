import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IncidenciasService } from '../../../../../model/incidencias/incidencia.service';
import { Incidencia } from '../../../../../model/incidencias/incidencia';

@Component({
  selector: 'app-incidencias',
  templateUrl: './incidencias.component.html',
  styleUrls: ['./incidencias.component.css']
})
export class IncidenciasComponent {
  //general
  incidencias:any = [];
  data:any = undefined;
  incid:any = [];
  //vistas admin
  lista:boolean;
  detalle:boolean;
  crear:boolean;
  editar:boolean;
  //editar
  nombre:string;
  nivel:string;
  idEdit:number;
  errorEdit:boolean = false;
  errorEditData:boolean = false;
  errorEditMsg:string;
  //createBoundView
  namea:string;
  nivela:number = 0;
  errorSave:boolean = false;
  errorSaveData:boolean = false;
  errorNewMsg:string;
  //eliminar
  errorDelete:boolean = false;
  errorDeleteData:boolean = false;

  constructor(public router:Router, private incidenciaService:IncidenciasService) { 
  	this.getAll();
  	this.regresar();
  }
  	getAll() {
    	this.incidenciaService.getAll().then(
    		success => {
    			this.incidencias = success;
    			this.data = this.incidencias.data;
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

  	regresar() {
	  this.lista = true;
	  this.detalle = false;
	  this.crear = false;
	  this.editar = false;
	  this.errorEditData = false;
      this.errorEdit = false;
	}

	editarIncidencia(id) {
      this.incidenciaService.getId(id).then(
        success => {
          this.incid = success;
          this.nombre = this.incid.name;
          this.nivel = this.incid.level;
          this.idEdit = this.incid.id;
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
      const editincidencia : Incidencia = {
        id: this.idEdit,
        level: this.nivel,
        name: this.nombre
      };
      this.incidenciaService.set(editincidencia).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorEditMsg = error.error.errors.name[0];
                    }
                    if(error.error.errors.level){
                      this.errorEditMsg = error.error.errors.level[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    crearIncidencia() {
      this.lista = false;
      this.detalle = false;
      this.crear = true;
      this.editar = false;
    }

    saveNewIncidencia() {
      const createadmin : Incidencia = {
        name: this.namea,
        level: this.nivela.toString()
      };
      if(this.nivela == 0){
        this.errorSave = true;
      }else{
        this.incidenciaService.add(createadmin).then(
        success => {
          this.getAll();
          this.regresar();
          this.namea = '';
          this.nivela = 0;
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

    deleteIncidencia(id) {
      this.incidenciaService.delete(id).then(
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
}
