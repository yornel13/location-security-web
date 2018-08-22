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
  guardiaFilter: any = { "guard_dni": ""};
  //filtro guardia
  guardias:any = [];
  guard:any = [];
  guardiaSelect:number = 0;
  //filtro fecha
  dateSelect:string = '';
  valueDate:any = [];
  guardia:any = [];
  hay:boolean;

  constructor(public router:Router, private watchesService:WatchesService, private guardiasService:GuardService) { 
  	this.getAll();
  	this.getGuard();
  	this.lista = true;
  	this.detalle = false;
  }

  getAll() {
  	this.watchesService.getAll().then(
        success => {
            this.watches = success;
            this.data = this.watches.data;
            this.hay = this.verifyActive(this.data);
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  verifyActive(data) {
    var valid = 0;
    if(data.length == 0){
      return false;
    }else{
      for(var i = 0; i < data.length; i++){
        if(data[i].status == 1) {
          valid ++;
        }
      }
      if(valid == 0){
        return false;
      }else{
        return true;
      }
    }
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
  	var fecha = String(this.dateSelect);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];
  	if (id == 0){
  		if (this.dateSelect == ''){
  			this.getAll();
  		}else{
  			this.watchesService.getByDate(year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
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
  		if(this.dateSelect == ''){
  			this.watchesService.getByGuard(id).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}else{
  			this.watchesService.getByGuardDate(id, year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
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

  getByDate(date) {
  	var fecha = String(date);
	this.valueDate = fecha.split('-');
	var year = this.valueDate[0];
	var month = this.valueDate[1];
	var day = this.valueDate[2];
	if (this.guardiaSelect == 0){
  		if (this.dateSelect == ''){
  			this.getAll();
  		}else{
  			this.watchesService.getByDate(year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
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
  		if(this.dateSelect == ''){
  			this.watchesService.getByGuard(this.guardiaSelect).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
		        }, error => {
		            if (error.status === 422) {
		                // on some data incorrect
		            } else {
		                // on general error
		            }
		        }
		    );
  		}else{
  			this.watchesService.getByGuardDate(this.guardiaSelect, year, month, day).then(
		        success => {
		            this.watches = success;
		            this.data = this.watches.data;
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
