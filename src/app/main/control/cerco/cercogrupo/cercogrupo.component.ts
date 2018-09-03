import { Component, OnInit, ViewChild } from '@angular/core';
import {GrupoService} from '../../../../../model/grupos/grupo.service';
import {Grupos} from '../../../../../model/grupos/grupos';
import {VehiclesService} from '../../../../../model/vehicle/vehicle.service';
import {CercoService} from '../../../../../model/cerco/cerco.service';

export class VechicleS {
    id: number;
    constructor () {}
}

@Component({
  selector: 'app-cercogrupo',
  templateUrl: './cercogrupo.component.html',
  styleUrls: ['./cercogrupo.component.css']
})
export class CercogrupoComponent {

  lista:boolean = true;
  detalle:boolean = false;
  filter:string; 
  grupos:any = [];
  data:any = [];
  cercos:any = [];
  cercosList:any = [];
  newname:string = "";
  editname:string = "";
  editid:number;
  detallename:string = "";
  vehiclesList:any = [];
  bounds:any = [];
  vehiclesInBound:any;
  cercosbuound:any = [];
  cercosb:any = [];
  //array
  cerc = {id: [], name: []};



  @ViewChild('vehicleChecked') vehicleChecked: any;

  constructor(private grupoService: GrupoService, private vehiclesService:VehiclesService, private cercoService: CercoService) { 
  	this.getAll();

  }

  getAll(){
  	this.grupoService.getAll().then(
        success => {
            this.grupos = success;
            this.data = this.grupos.data;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  guardarGrupo(){
  	const savegrupo : Grupos = {
        name: this.newname
    }
    this.grupoService.add(savegrupo).then(
        success => {
            this.getAll();
            this.newname = "";
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  deleteGrupo(id){
  	this.grupoService.delete(id).then(
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

  editGrupo(grupo){
  	const editgrupo : Grupos = {
  		id: grupo.id,
        name: this.editname
    }
    this.grupoService.set(editgrupo).then(
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

  setName(nombre){
  	this.editname = nombre;
  }

  regresar(){
  	this.detalle = false;
  	this.lista = true;
  }

  getGrupo(grupo){
  	this.detalle = true;
  	this.lista = false;
  	this.editname = grupo.name;
  	this.editid = grupo.id;
  	this.getCercosInBound(grupo.id);
  	this.loadCercosListModal();
  }

    getCercosInBound(id){
    	console.log(id);
    	this.grupoService.getCercoGrupo(id).then(
        success => {
            this.cercosb = success;
            this.cercosbuound = this.cercosb.data;
            console.log(this.cercosbuound);
        });
    }

    loadCercosListModal(){
    	this.cercoService.getAll().then(
            success => {
                this.cercos = success;
                this.cercosList = this.cercos.data;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getCercosByChecked(cerco) {
        const index = this.cerc.id.indexOf(cerco.id);
        if  (index > -1) {
            this.cerc.id.splice(index, 1);
            this.cerc.name.splice(index, 1);
            console.log('se borro', cerco.id);

        } else {
            this.cerc.id.push(cerco.id);
            this.cerc.name.push(cerco.name);
            console.log('se agrego!', this.cerc.id);
        }
        this.cerc.id.forEach( data => {
            console.log('cercos-> ', data);
        });
    }

    addCercosToGrupo(id){
    	const array = [];
    	console.log(id);
        this.cerc.id.forEach( data => {
            const vehicler: VechicleS = new VechicleS();
            vehicler.id = data;
            array.push(vehicler);
        });

        this.grupoService.addCercosToGroup(id, JSON.stringify(array))
            .then( sucess => {
                this.getCercosInBound(this.editid);
            },  error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            });
    }

    deleteCerco(id){
    	this.grupoService.deleteCercoGrupo(id)
	        .then( sucess => {
	            this.getCercosInBound(this.editid);
	        },  error => {
	            if (error.status === 422) {
	                // on some data incorrect
	            } else {
	                // on general error
	            }
	     });
    }

}
