import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WatchesService } from '../../../../../model/watch/watch.service';
import { Watch } from '../../../../../model/watch/watch';
import { GuardService } from '../../../../../model/guard/guard.service';

@Component({
  selector: 'app-wactivas',
  templateUrl: './wactivas.component.html',
  styleUrls: ['./wactivas.component.css']
})
export class WactivasComponent {
  lista:boolean;
  detalle:boolean;
  watches:any = undefined;
  data:any = undefined;
  guardiaFilter: any = { "guard":{ "dni" : ""}};
  //filtro guardia
  guardias:any = [];
  guard:any = [];
  guardiaSelect:number = 0;
  //filtro fecha
  dateSelect:string = '';
  valueDate:any = [];
  guardia:any = [];
  hay:boolean;
  numElement:number = 10;

  constructor(public router:Router, private watchesService:WatchesService, private guardiasService:GuardService) { 
  	this.getAll();
  	this.getGuard();
  	this.lista = true;
  	this.detalle = false;
  }

  getAll() {
  	this.watchesService.getActive().then(
        success => {
            this.watches = success;
            this.data = this.watches.data;
            if (this.watches.total == 0){
              this.hay = false;
            }else{
              this.hay = true;
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

  getGuard() {
  	this.guardiasService.getAll().then(
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

  guardFilert(id) {  
		if(id == 0){
      this.getAll();
    }else{
      this.watchesService.getActiveByGuard(id).then(
        success => {
            this.watches = success;
            this.data = this.watches.data;
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
  }

  viewDetail(id){
  	this.watchesService.getById(id).then(
        success => {
          this.guardia = success;
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


}
