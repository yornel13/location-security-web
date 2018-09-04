import { Component, OnInit, ViewChild } from '@angular/core';
import { PuestoService } from '../../../../../model/puestos/puestos.service';
import { Puesto } from '../../../../../model/puestos/puesto';
import { TabletService } from '../../../../../model/tablet/tablet.service';
import { GuardService } from '../../../../../model/guard/guard.service';

export class TabasS {
    id: number;
    constructor () {}
}

export class GuardS {
    id: number;
    constructor () {}
}

@Component({
  selector: 'app-puestos',
  templateUrl: './puestos.component.html',
  styleUrls: ['./puestos.component.css']
})

export class PuestosComponent {

  lista:boolean = true;
  detalle:boolean = false;
  filter:string;
  puestos:any = [];
  data:any = [];
  newaddress:string;
  newname:string;
  editname:string;
  editaddress:string;
  tablets:any = [];
  tabletsList:any = [];
  guardias:any = [];
  guardiasList:any = [];
  tabletspuesto:any = [];
  tabpuesto:any = [];
  guardiaspuesto:any = [];
  guardpuesto:any = [];
  //edit
  editid:any;
  editnombre:any;
  viewpuesto:string;

  tabl = {id: [], name: []};
  guardl = {id: [], name: []};

  @ViewChild('tabletChecked') tabletChecked: any;
  @ViewChild('guardiaChecked') guardiaChecked: any;

  constructor(private puestoService:PuestoService, private tabletService:TabletService, private guardiaService:GuardService) {
  	this.getAll();
  }

  getAll(){
  	this.puestoService.getAll().then(
        success => {
            this.puestos = success;
            this.data = this.puestos.data;
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  guardarPuesto(){
  	const savepuesto : Puesto = {
        name: this.newname,
        address: this.newaddress
    }
    this.puestoService.add(savepuesto).then(
        success => {
            this.getAll();
            this.newname = "";
            this.newaddress = "";
        }, error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        }
    );
  }

  setValues(puesto){
  	this.editname = puesto.name;
  	this.editaddress = puesto.address;
  }

  regresar(){
  	this.detalle = false;
  	this.lista = true;
  }

  editPuesto(id){
  	const savepuesto : Puesto = {
  		id: id,
        name: this.editname,
        address: this.editaddress
    }
    this.puestoService.set(savepuesto).then(
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

    deletePuesto(id){
    	this.puestoService.delete(id)
	        .then( sucess => {
	            this.getAll();
	        },  error => {
	            if (error.status === 422) {
	                // on some data incorrect
	            } else {
	                // on general error
	            }
	     });
    }

    viewDetail(puesto){
	  	this.getTabletPuesto(puesto.id);
	  	this.loadTabletsListModal();
	  	this.getGuardiaPuesto(puesto.id);
	  	this.loadGuardiaListModal();
	  	this.editid = puesto.id;
      this.editnombre = puesto.name;
	  }

	getTabletPuesto(id){
		this.puestoService.getTabletsPuesto(id).then(
        success => {
            this.tabpuesto = success;
            this.tabletspuesto = this.tabpuesto.data;
            this.detalle = true;
	  		this.lista = false;
            console.log(this.tabletspuesto);
        });
	}

	getGuardiaPuesto(id){
		this.puestoService.getGuardiasPuesto(id).then(
        success => {
            this.guardpuesto = success;
            this.guardiaspuesto = this.guardpuesto.data;
        });
	}

	loadTabletsListModal(){
		this.tabletService.getAll().then(
            success => {
                this.tablets = success;
                this.tabletsList = this.tablets.data;
                console.log(this.tabletsList);
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
	}

	loadGuardiaListModal(){
		this.guardiaService.getAll().then(
            success => {
                this.guardias = success;
                this.guardiasList = this.guardias.data;
                console.log(this.guardiasList);
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
	}

	getTabletsByChecked(puesto){
		const index = this.tabl.id.indexOf(puesto.id);
        if  (index > -1) {
            this.tabl.id.splice(index, 1);
            this.tabl.name.splice(index, 1);
            console.log('se borro', puesto.id);

        } else {
            this.tabl.id.push(puesto.id);
            this.tabl.name.push(puesto.name);
            console.log('se agrego!', this.tabl.id);
        }
        this.tabl.id.forEach( data => {
            console.log('cercos-> ', data);
        });
	}

	addTabsToPuesto(id){
		const array = [];
    	console.log(id);
        this.tabl.id.forEach( data => {
            const vehicler: TabasS = new TabasS();
            vehicler.id = data;
            array.push(vehicler);
        });

	    this.puestoService.addTabletsPuesto(id, JSON.stringify(array))
	        .then( sucess => {
	            this.getTabletPuesto(id);
	        },  error => {
	            if (error.status === 422) {
	                // on some data incorrect
	            } else {
	                // on general error
	            }
	        });
	}

	getGuardiasByChecked(puesto){
		const index = this.guardl.id.indexOf(puesto.id);
        if  (index > -1) {
            this.guardl.id.splice(index, 1);
            this.guardl.name.splice(index, 1);
            console.log('se borro', puesto.id);

        } else {
            this.guardl.id.push(puesto.id);
            this.guardl.name.push(puesto.name);
            console.log('se agrego!', this.guardl.id);
        }
        this.guardl.id.forEach( data => {
            console.log('cercos-> ', data);
        });
	}

	addGuardToPuesto(id){
		const array = [];
    	console.log(id);
        this.guardl.id.forEach( data => {
            const vehicler: GuardS = new GuardS();
            vehicler.id = data;
            array.push(vehicler);
        });

	    this.puestoService.addGuardiasPuesto(id, JSON.stringify(array))
	        .then( sucess => {
	            this.getGuardiaPuesto(this.editid);
	        },  error => {
	            if (error.status === 422) {
	                // on some data incorrect
	            } else {
	                // on general error
	            }
	        });
	}

	deleteGuardia(id){
		this.puestoService.deleteGuardiaPuesto(id)
	        .then( sucess => {
	            this.getGuardiaPuesto(this.editid);
	        },  error => {
	            if (error.status === 422) {
	                // on some data incorrect
	            } else {
	                // on general error
	            }
	     });
	}

	deleteTablet(id){
		this.puestoService.deleteTabletPuesto(id)
	        .then( sucess => {
	            this.getTabletPuesto(this.editid);
	        },  error => {
	            if (error.status === 422) {
	                // on some data incorrect
	            } else {
	                // on general error
	            }
	     });
	}

}
