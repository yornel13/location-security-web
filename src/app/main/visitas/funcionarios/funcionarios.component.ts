import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { FuncionarioService } from '../../../../model/funcionarios/funcionario.service';
import { Funcionario } from '../../../../model/funcionarios/funcionario';

@Component({
  selector: 'app-funcionarios',
  templateUrl: './funcionarios.component.html',
  styleUrls: ['./funcionarios.component.css']
})
export class FuncionariosComponent {
  //general
  funcionarios:any = undefined;
  data:any = undefined;
  funcio:any = [];
  error: string;
  //vistas admin
  lista:boolean;
  detalle:boolean;
  crear:boolean;
  editar:boolean;
  //editar
  nombre:string;
  apellido:string;
  direccion:string;
  identificacion:string;
  idEdit:number;
  errorEdit:boolean = false;
  errorEditData:boolean = false;
  errorEditMsg:string;
  //crear
  namea:string;
  lastnamea:string;
  addressa:string;
  dnia:string;
  passworda:string;
  errorSave:boolean = false;
  errorSaveData:boolean = false;
  errorNewMsg:string;
  //eliminar
  errorDelete:boolean = false;
  errorDeleteData:boolean = false;

  constructor(public router:Router, private funcionarioService:FuncionarioService) { 
  	this.getAll();
    this.lista = true;
    this.detalle = false;
    this.crear = false;
    this.editar = false;
  }

	getAll() {
		this.funcionarioService.getAll().then(
			success => {
				this.funcionarios = success;
				this.data = this.funcionarios.data;
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
	  this.funcionarioService.getId(id).then(
	    success => {
	      this.funcio = success;
	      this.lista = false;
	      this.detalle = true;
	      this.crear = false;
	      this.editar = false;
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
	}

	editarFuncionario(id) {
      this.funcionarioService.getId(id).then(
        success => {
          this.funcio = success;
          this.nombre = this.funcio.name;
          this.apellido = this.funcio.lastname;
          this.direccion = this.funcio.address;
          this.identificacion = this.funcio.dni;
          this.idEdit = this.funcio.id;
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
      const editfuncionario : Funcionario = {
        id: this.idEdit,
        dni: this.identificacion,
        name: this.nombre,
        lastname: this.apellido,
        address: this.direccion
      };
      this.funcionarioService.set(editfuncionario).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorEditMsg = "NOMBRE "+error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                      this.errorEditMsg = "APELLIDO "+error.error.errors.lastname[0];
                    }
                    if(error.error.errors.address){
                      this.errorEditMsg = "DIRECCIÓN "+error.error.errors.address[0];
                    }
                    if(error.error.errors.dni){
                      this.errorEditMsg = "DNI "+error.error.errors.dni[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    crearFuncionario() {
      this.lista = false;
      this.detalle = false;
      this.crear = true;
      this.editar = false;
    }


    saveNewFuncionario() {
      const createfuncionario : Funcionario = {
        dni: this.dnia,
        name: this.namea,
        lastname: this.lastnamea,
        address: this.addressa
      };
      this.funcionarioService.add(createfuncionario).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
          this.dnia = '';
	      this.namea = '';
	      this.lastnamea = '';
	      this.addressa = '';
	      this.errorSave = false;
  		  this.errorSaveData = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorNewMsg = "NOMRBE "+error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                      this.errorNewMsg = "APELLIDO "+error.error.errors.lastname[0];
                    }
                    if(error.error.errors.address){
                      this.errorNewMsg = "DIRECCION "+error.error.errors.email[0];
                    }
                    if(error.error.errors.dni){
                      this.errorNewMsg = "DNI "+error.error.errors.dni[0];
                    }
                    this.errorSaveData = true;
                } else {
                    // on general error
                    this.errorSave = true;
                }
            }
        );
    }

    deleteFuncionario(id) {
      this.funcionarioService.delete(id).then(
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
