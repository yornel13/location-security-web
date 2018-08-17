import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitanteService } from '../../../../model/vistavisitantes/visitantes.service';
import { Visitantes } from '../../../../model/vistavisitantes/visitantes';

@Component({
  selector: 'app-visitantes',
  templateUrl: './visitantes.component.html',
  styleUrls: ['./visitantes.component.css']
})
export class VisitantesComponent {
  //general
  visitantes:any = undefined;
  data:any = undefined;
  visi:any = [];
  //vistas vehiculos
  lista:boolean;
  detalle:boolean;
  crear:boolean;
  editar:boolean;
  //editar
  nombre:string;
  apellido:string;
  compania:string;
  identificacion:string;
  idEdit:number;
  errorEdit:boolean = false;
  errorEditData:boolean = false;
  errorEditMsg:string;
  //eliminar
  errorDelete:boolean = false;
  errorDeleteData:boolean = false;

  
  constructor(public router:Router, private visitanteService:VisitanteService) { 
    this.getAll();
  	this.lista = true;
    this.detalle = false;
    this.crear = false;
    this.editar = false;
  }

  getAll() {
    this.visitanteService.getAll().then(
      success => {
        this.visitantes = success;
        this.data = this.visitantes.data;
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
    this.visitanteService.getId(id).then(
      success => {
        this.visi = success;
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

  editarAdmmin(id) {
    this.visitanteService.getId(id).then(
      success => {
        this.visi = success;
        this.nombre = this.visi.name;
        this.apellido = this.visi.lastname;
        this.compania = this.visi.company;
        this.identificacion = this.visi.dni;
        this.idEdit = this.visi.id;
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
      const editadmin : Visitantes = {
        id: this.idEdit,
        dni: this.identificacion,
        name: this.nombre,
        lastname: this.apellido,
        company: this.compania
      };
      this.visitanteService.set(editadmin).then(
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
                    if(error.error.errors.lastname){
                      this.errorEditMsg = error.error.errors.lastname[0];
                    }
                    if(error.error.errors.company){
                      this.errorEditMsg = error.error.error.company[0];
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

    deleteVisitante(id) {
      this.visitanteService.delete(id).then(
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
