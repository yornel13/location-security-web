import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuardService } from '../../../../model/guard/guard.service';
import { Guard } from '../../../../model/guard/guard';

@Component({
  selector: 'app-guardia',
  templateUrl: './guardia.component.html',
  styleUrls: ['./guardia.component.css']
})
export class GuardiaComponent {
  //general
  guardias:any = undefined;
  data:any = undefined;
  guardia:any = [];
  //vistas admin
  lista:boolean;
  detalle:boolean;
  crear:boolean;
  editar:boolean;
  //editar
  nombre:string;
  apellido:string;
  correo:string;
  identificacion:string;
  contrasena:string = "password";
  idEdit:number;
  errorEdit:boolean = false;
  errorEditData:boolean = false;
  errorEditMsg:string;
  //crear
  namea:string;
  lastnamea:string;
  emaila:string;
  dnia:string;
  passworda:string;
  errorSave:boolean = false;
  errorSaveData:boolean = false;
  errorNewMsg:string;
  //eliminar
  errorDelete:boolean = false;
  errorDeleteData:boolean = false;
  guardFilter: any = { "dni": ""};


  constructor(public router:Router, private guardService:GuardService) { 
  	this.getAll();
  	this.regresar();
  }

  getAll() {
    	this.guardService.getAll().then(
    		success => {
    			this.guardias = success;
    			this.data = this.guardias.data;
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
    }

    viewDetail(id) {
      this.guardService.getId(id).then(
        success => {
          this.guardia = success;
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

    editarGuardia(id) {
      this.guardService.getId(id).then(
        success => {
          this.guardia = success;
          this.nombre = this.guardia.name;
          this.apellido = this.guardia.lastname;
          this.correo = this.guardia.email;
          this.identificacion = this.guardia.dni;
          this.idEdit = this.guardia.id;
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

    getValueEdit(){
      if(this.contrasena == "password"){
          console.log("Entra aquí");
          const editadmin : Guard = {
          id: this.idEdit,
          dni: this.identificacion,
          name: this.nombre,
          lastname: this.apellido,
          email: this.correo
        }
        return editadmin;
      }else{
          const editadmin : Guard = {
          id: this.idEdit,
          dni: this.identificacion,
          name: this.nombre,
          lastname: this.apellido,
          email: this.correo,
          password: this.contrasena
        }
        return editadmin;
      }
    }

    saveEdit() {
      var valores = this.getValueEdit();

      this.guardService.set(valores).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorEditMsg = "Su nombre "+error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                      this.errorEditMsg = "Su apellido "+error.error.errors.lastname[0];
                    }
                    if(error.error.errors.email){
                      this.errorEditMsg = "Su contraseña"+error.error.errors.email[0];
                    }
                    if(error.error.errors.dni){
                      this.errorEditMsg = error.error.errors.dni[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    crearGuardia() {
      this.lista = false;
      this.detalle = false;
      this.crear = true;
      this.editar = false;
    }

    saveNewGuardia() {
      const createguard : Guard = {
        dni: this.dnia,
        name: this.namea,
        lastname: this.lastnamea,
        email: this.emaila,
        password: this.passworda
      };
      this.guardService.add(createguard).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if(error.error.errors.name){
                      this.errorNewMsg = error.error.errors.name[0];
                    }
                    if(error.error.errors.lastname){
                      this.errorNewMsg = error.error.errors.lastname[0];
                    }
                    if(error.error.errors.email){
                      this.errorNewMsg = error.error.errors.email[0];
                    }
                    if(error.error.errors.dni){
                      this.errorNewMsg = error.error.errors.dni[0];
                    }
                    this.errorSaveData = true;
                } else {
                    // on general error
                    this.errorSave = true;
                }
            }
        );
    }

    deleteGuardia(id) {
      this.guardService.delete(id).then(
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

    activarGuardia(id) {
        this.guardService.activeGuard(id).then(
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

    desactivarGuardia(id) {
        this.guardService.desactiveGuard(id).then(
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
