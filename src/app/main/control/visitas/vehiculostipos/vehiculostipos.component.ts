import { Component, OnInit, ViewChild } from '@angular/core';
import {Grupos} from '../../../../../model/grupos/grupos';
import {VehiclestypesService} from '../../../../../model/vehicletsypes/vehiclestypes.service';
import {Vehiclestypes} from '../../../../../model/vehicletsypes/vehiclestypes';
import {ExcelService} from "../../../../../model/excel/excel.services";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-vehiculostipos',
    templateUrl: './vehiculostipos.component.html',
    styleUrls: ['./vehiculostipos.component.css']
})
export class VehiculostiposComponent {

    lista:boolean = true;
    detalle:boolean = false;
    filter:string;
    tipos: any = [];
    data: any = [];
    cercos:any = [];
    cercosList:any = [];
    newName: string = '';
    editName: string = '';
    editid:number;
    detallename: string = '';
    vehiclesList:any = [];
    bounds:any = [];
    vehiclesInBound:any;
    cercosbuound:any = [];
    cercosb:any = [];
    //array
    cerc = {id: [], name: []};
    filterValue: string;

    @ViewChild('vehicleChecked') vehicleChecked: any;

    constructor(
            private typesService: VehiclestypesService,
            private toastr: ToastrService) {
        this.getAll();

    }

    getAll() {
        this.typesService.getAll().then(
            success => {
                console.log(success);
                this.tipos = success;
                this.data = this.tipos.data;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    saveType() {
        const newType: Vehiclestypes = {
            name: this.newName
        };
        this.typesService.add(newType).then(
            success => {
                this.getAll();
                this.newName = '';
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    deleteType(id) {
        this.typesService.delete(id).then(
            success => {
                this.getAll();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    this.toastr.info(error.error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                } else {
                    // on general error
                }
            }
        );
    }

    editType(vehicle) {
        const editType: Grupos = {
            id: vehicle.id,
            name: this.editName
        }
        this.typesService.set(editType).then(
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

    setName(name) {
        this.editName = name;
    }

    return() {
        this.detalle = false;
        this.lista = true;
    }
}
