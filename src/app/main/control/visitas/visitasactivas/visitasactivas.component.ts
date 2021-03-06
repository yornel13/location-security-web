import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitasService } from '../../../../../model/visitas/visitas.service';
import { GuardService } from '../../../../../model/guard/guard.service';
import { VisitaVehiculoService } from '../../../../../model/visitavehiculo/visitavehiculo.service';
import { VisitanteService } from '../../../../../model/vistavisitantes/visitantes.service';
import { FuncionarioService } from '../../../../../model/funcionarios/funcionario.service';

@Component({
  selector: 'app-visitasactivas',
  templateUrl: './visitasactivas.component.html',
  styleUrls: ['./visitasactivas.component.css']
})
export class VisitasactivasComponent {
  /*general*/
    visitas:any = undefined;
  data:any = undefined;
  visi:any = [];
  searchString: string;
  userFilter: any = { "plate": "" };
  //vistas vehiculos
  lista:boolean;
  detalle:boolean;
  nomat:boolean;
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
  dateSelect:any = '';
  nohay:boolean = false;
  numElement:number = 10;

  constructor(public router:Router, private visitasService:VisitasService, private guardiaService:GuardService,
    private vehiculoService:VisitaVehiculoService, private visitanteService:VisitanteService, private funcionarioService:FuncionarioService) { 
  	this.lista = true;
    this.detalle = false;
  	this.getActives();
    this.getGuard();
    this.getVehiculos();
    this.getVisitantes();
    this.getFuncionarios();
  }


  getActives() {
  	this.visitasService.getActive().then(
      success => {
        this.visitas = success;
        this.data = this.visitas.data;
        if(this.data.length == 0){
          this.nohay = true;
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
    this.visitasService.getId(id).then(
      success => {
        this.visi = success;
        this.visi.observation = JSON.parse(this.visi.observation);
        if(this.visi.observation.length == 0){
          this.nomat = true;
        }else{
          this.nomat = false;
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

  getByVehiculo(id){
    var fecha = String(this.dateSelect);
    this.valueDate = fecha.split('-');
    var year = this.valueDate[0];
    var month = this.valueDate[1];
    var day = this.valueDate[2];

    if(this.dateSelect == ''){
      if(id == 0){
        this.getActives();
      }else{
        this.visitasService.getByVehiculo(id, '1').then(
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
        this.visitasService.getByDate(year, month, day, '1').then(
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
        this.visitasService.getByVehiculoDate(id, year, month, day, '1').then(
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
        this.getActives();
      }else{
        this.visitasService.getByGuard(id, '1').then(
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
        this.visitasService.getByDate(year, month, day, '1').then(
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
        this.visitasService.getByGuardDate(id, year, month, day, '1').then(
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
        this.getActives();
      }else{
        this.visitasService.getByVisitante(id, '1').then(
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
        this.visitasService.getByDate(year, month, day, '1').then(
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
        this.visitasService.getByVisitanteDate(id, year, month, day, '1').then(
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
        this.getActives();
      }else{
        this.visitasService.getByFuncionario(id, '1').then(
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
        this.visitasService.getByDate(year, month, day, '1').then(
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
        this.visitasService.getByFuncionarioDate(id, year, month, day, '1').then(
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
