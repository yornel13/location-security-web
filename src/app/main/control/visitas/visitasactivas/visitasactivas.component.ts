import { Component, OnInit } from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { VisitasService } from '../../../../../model/visitas/visitas.service';

@Component({
  selector: 'app-visitasactivas',
  templateUrl: './visitasactivas.component.html',
  styleUrls: ['./visitasactivas.component.css']
})
export class VisitasactivasComponent {
  //general
  visitas:any = undefined;
  data:any = undefined;
  visi:any = [];
  searchString: string;
  userFilter: any = { "vehicle": {"plate": ""} };
  //vistas vehiculos
  lista:boolean;
  detalle:boolean;
  nomat:boolean;

  constructor(public router:Router, private visitasService:VisitasService) { 
  	this.lista = true;
    this.detalle = false;
  	this.getActives();
  }


  getActives() {
  	this.visitasService.getActive().then(
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

  viewDetail(id) {
    this.visitasService.getId(id).then(
      success => {
        this.visi = success;
        this.visi.observation = JSON.parse(this.visi.observation);
        if(this.visi.observation.length == 0){
          this.nomat = true
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


}
