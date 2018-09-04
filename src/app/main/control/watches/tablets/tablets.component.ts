import { Component, OnInit } from '@angular/core';
import { TabletService } from '../../../../../model/tablet/tablet.service';

@Component({
  selector: 'app-tablets',
  templateUrl: './tablets.component.html',
  styleUrls: ['./tablets.component.css']
})

export class TabletsComponent  {
  lista:boolean = true;
  tablets:any = [];
  data:any = [];
  filter:string;

  constructor(private tabletService:TabletService) { 
  	this.getAll();
  }

  getAll(){
  	this.tabletService.getAll().then(
        success => {
            this.tablets = success;
            this.data = this.tablets.data;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  activarTablet(id){
  	this.tabletService.setStatus(id, 1).then(
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

  desactivarTablet(id){
  	this.tabletService.setStatus(id, 0).then(
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

  deleteTablet(id){
  	this.tabletService.delete(id).then(
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
