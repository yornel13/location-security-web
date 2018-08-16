import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitaVehiculoService } from '../../../../model/visitavehiculo/visitavehiculo.service';
import { Vvehiculo } from '../../../../model/visitavehiculo/visitavehiculo';

@Component({
  selector: 'app-vehiculos',
  templateUrl: './vehiculos.component.html',
  styleUrls: ['./vehiculos.component.css']
})
export class VehiculosComponent {
  //general
  vehiculos:any = undefined;
  data:any = undefined;
  vehi:any = [];
  //vistas vehiculos
  lista:boolean;
  detalle:boolean;
  crear:boolean;
  editar:boolean;
  //editar
  placa:string;
  vehiculo:string;
  modelo:string;
  tipo:string;
  idEdit:number;
  errorEdit:boolean = false;
  errorEditData:boolean = false;
  errorEditMsg:string;
  //eliminar
  errorDelete:boolean = false;
  errorDeleteData:boolean = false;

  constructor(public router:Router, private vehiculoService:VisitaVehiculoService) {
  	this.getAll();
  	this.lista = true;
    this.detalle = false;
    this.crear = false;
    this.editar = false;
  }

  getAll() {
    	this.vehiculoService.getAll().then(
    		success => {
    			this.vehiculos = success;
    			this.data = this.vehiculos.data;
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
      this.vehiculoService.getId(id).then(
        success => {
          this.vehi = success;
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

    editarVisitVehiculo(id) {
      this.vehiculoService.getId(id).then(
        success => {
          this.vehi = success;
          this.placa = this.vehi.plate;
          this.vehiculo = this.vehi.vehicle;
          this.modelo = this.vehi.model;
          this.tipo = this.vehi.type;
          this.idEdit = this.vehi.id;
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
      const editvehiculo : Vvehiculo = {
        id: this.idEdit,
        plate: this.placa,
        model: this.modelo,
        vehicle: this.vehiculo,
        type: this.tipo
      };
      this.vehiculoService.set(editvehiculo).then(
        success => {
          this.getAll();
          this.regresar();
          this.errorEditData = false;
          this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    console.log(error);
                    if(error.error.errors.plate){
                      this.errorEditMsg = error.error.errors.plate[0];
                    }
                    if(error.error.errors.model){
                      this.errorEditMsg = error.error.errors.model[0];
                    }
                    if(error.error.errors.type){
                      this.errorEditMsg = error.error.errors.type[0];
                    }
                    this.errorEditData = true;
                } else {
                    // on general error
                    this.errorEdit = true;
                }
            }
        );
    }

    deleteVehiculo(id) {
      this.vehiculoService.delete(id).then(
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
