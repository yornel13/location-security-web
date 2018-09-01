import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../../model/admin/admin.service';
import { Admin } from '../../../../model/admin/admin';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-draw';
import {CercoService} from '../../../../model/cerco/cerco.service';
import {Cerco} from '../../../../model/cerco/cerco';
import {forEach} from '@angular/router/src/utils/collection';
import {VehiclesService} from '../../../../model/vehicle/vehicle.service';
import {Vehicle} from '../../../../model/vehicle/vehicle';
import {CheckboxControlValueAccessor} from '@angular/forms';
import {ListBounds} from '../../../../model/cerco/list.bounds';
import {Bounds} from '../../../../model/cerco/bounds';
import {GlobalOsm} from '../../../global.osm';
import { ColorPickerModule } from 'ngx-color-picker';
import * as geolib from "geolib";

export class VechicleS {
    imei: string;
    constructor () {}
}

@Component({
    selector: 'app-cerco',
    templateUrl: './cerco.component.html',
    styleUrls: ['./cerco.component.css']
})

export class CercoComponent implements OnInit {
    // general
    administradores: any = undefined;
    data: any = undefined;
    admin: any = [];
    error: string;
    // vistas admin
    lista: boolean;
    vehiclesBoundView: boolean;
    createBoundView: boolean;
    editBoundView: boolean;
    // editBoundView
    nombre: string;
    apellido: string;
    correo: string;
    identificacion: string;
    photo: string;
    contrasena = 'password';
    idEdit: number;
    errorEdit = false;
    errorEditData = false;
    errorEditMsg: string;
    // createBoundView
    nameBound: string;
    lastnamea: string;
    emaila: string;
    dnia: string;
    passworda: string;
    photoa: string;
    errorSave = false;
    errorSaveData = false;
    errorNewMsg: string;
    // eliminar
    errorDelete = false;
    errorDeleteData = false;
    boundsFilter: any = { 'name': ''};
    // imagen firebase
    uploadPercent: Observable<number>;
    downloadURL: Observable<string>;

    marker = L.marker([-2.071522, -79.607105], {draggable: true});
    polygonDrawed: boolean;
    drawing: boolean;
    polygon = L.polygon([]);
    onArea;
    map;
    drawPluginOptions;
    editableLayers;

    message: string;
    alertError: boolean;
    alertSuccess: boolean;
    @ViewChild('nameBoundField') nameBoundField: any;
    @ViewChild('vehicleChecked') vehicleChecked: any;


    bounds: Bounds[];
    cercos: any = undefined;
    toEditPolygon =  L.polygon([]);
    editPolygon = false;
    vehiclesList;
    checked = false;
    vehicles = {imei: [], alias: []};
    cercoId;
    vehiclesInBound: Bounds[] = [];

    zoom: 12;
    center = L.latLng(([ -2.071522, -79.607105 ]));
    layersControlOptions;
    baseLayers;
    options;
    drawControl;
    figure;
    selectedBounds: Cerco = undefined;
    colorSelected;
    defaultColor = '#97009c';
    pointsToSave;

    constructor (
            public router: Router,
            private adminService: AdminService,
            private storage: AngularFireStorage,
            private cercoService: CercoService,
            private vehiclesService: VehiclesService,
            private globalOSM: GlobalOsm) {
        /* Map default options */
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = this.globalOSM.defaultOptions;
    }

    ngOnInit() {
        this.returnList();
        this.getAllBounds();
    }

    getAllBounds() {
        this.cercoService.getAll().then(
            success => {
                this.cercos = success;
                this.data = this.cercos.data;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    saveNewBound() {
        const nameBound = this.nameBoundField.nativeElement.value;
        if (nameBound) {
            if (typeof this.polygon !== 'undefined') {

                if (this.polygonDrawed) {
                    for (const poly of this.data) {
                        if (poly.name.toLowerCase() === nameBound.toLowerCase()) {
                            this.message = 'El nombre del cerco ya se encuentra en uso!';
                            this.alertError = true;
                            this.alertSuccess = false;
                            return;
                        }
                    }

                    const coords = JSON.stringify(this.pointsToSave);
                    console.log(coords);
                    const bound: Cerco = {
                        name: this.nameBound,
                        points: coords,
                        color: this.colorSelected,
                        status:  true
                    };

                    this.cercoService.add(bound).then(sucess => {
                        this.getAllBounds();
                        this.returnList();
                        this.nameBound = '';
                    });
                    this.message = 'Guardado con exito!';
                    this.alertError = false;
                    this.alertSuccess = true;

                } else {
                    this.message = 'Debe cerrar la forma del cerco!';
                    this.alertError = true;
                    this.alertSuccess = false;
                }
            } else {
                this.message = 'No existe un cerco definido!';
                this.alertError = true;
                this.alertSuccess = false;
            }
        } else {
            this.message = 'Defina un nombre para el cerco virtual!';
            this.alertError = true;
            this.alertSuccess = false;
        }
    }

    getVehiclesInBound(cerco: Cerco) {
        this.selectedBounds = cerco;
        this.cercoId = cerco.id;
        this.nameBound = cerco.name;
        this.cercoService.getVehiclesInBound(cerco.id).then(
            (success: ListBounds) => {
                this.bounds = success.data;
                this.loadVehicleListModal();
                this.vehiclesBoundView = true;
                this.lista = false;
                this.createBoundView = false;
                this.editBoundView = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );

        this.cercoService.getId(cerco.id).then(
            success => {
                this.selectedBounds = success;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    loadVehicleListModal() {
        this.vehiclesService.getVehiclesList().then(
            success => {
                this.vehiclesList = success.data;
                this.bounds.forEach(vBounds => {
                    this.vehiclesList.forEach(vehicle => {
                        if (vehicle.imei == vBounds.imei) {
                            vBounds.alias = vehicle.alias;
                        }
                    });
                });
                this.vehiclesInBound = this.bounds;
            });
    }



    getVehicleByChecked(vehicle) {
        const index = this.vehicles.imei.indexOf(vehicle.imei);
        if  (index > -1) {
            this.vehicles.imei.splice(index, 1);
            this.vehicles.alias.splice(index, 1);

            console.log('se borro', vehicle.imei);

        } else {
            this.vehicles.imei.push(vehicle.imei);
            this.vehicles.alias.push(vehicle.alias);
            console.log('se agrego!', this.vehicles.imei);
        }
        this.vehicles.imei.forEach( data => {
            console.log('vehiculos-> ', data);
        });
    }

    addVehiclesToBound(id) {
        const array = [];
        console.log(id);
        this.vehicles.imei.forEach( data => {
            const vehicler: VechicleS = new VechicleS();
            vehicler.imei = data;
            array.push(vehicler);
        });

        this.cercoService.addVehiclesToBound(id, JSON.stringify(array))
            .then( sucess => {
                this.getVehiclesInBound(this.selectedBounds);
            },  error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            });
    }

    returnList() {
        this.lista = true;
        this.vehiclesBoundView = false;
        this.createBoundView = false;
        this.editBoundView = false;
        this.errorEditData = false;
        this.nameBound = '';
        this.message = '';
        this.alertError = false;
        this.alertSuccess = false;
        this.selectedBounds = null;
    }

    editBound(cerco: Cerco) {
        this.selectedBounds = cerco;
        this.editPolygon = true;
        this.cercoService.getId(cerco.id).then(
            success => {
                this.selectedBounds = success;
                const coords = JSON.parse(this.selectedBounds.points);
                this.toEditPolygon = L.polygon([[]]).setLatLngs(coords);
                this.lista = false;
                this.editBoundView = true;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    getValueEdit() {
        if (this.contrasena === 'password') {
            const editadmin: Admin = {
                id: this.idEdit,
                dni: this.identificacion,
                name: this.nombre,
                lastname: this.apellido,
                email: this.correo,
                photo: this.photo
            };
            return editadmin;
        } else {
            const editadmin: Admin = {
                id: this.idEdit,
                dni: this.identificacion,
                name: this.nombre,
                lastname: this.apellido,
                email: this.correo,
                password: this.contrasena,
                photo: this.photo
            };
            return editadmin;
        }
    }

    saveEditedBound() {
        const valores = this.getValueEdit();
        this.adminService.set(valores).then(
            success => {
                this.getAllBounds();
                this.returnList();
                this.photo = '';
                this.errorEditData = false;
                this.errorEdit = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    if (error.error.errors.name) {
                        this.errorEditMsg = error.error.errors.name[0];
                    }
                    if (error.error.errors.lastname) {
                        this.errorEditMsg = error.error.errors.lastname[0];
                    }
                    if (error.error.errors.email) {
                        this.errorEditMsg = error.error.errors.email[0];
                    }
                    if (error.error.errors.dni) {
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

    createBounds() {
        this.colorSelected = this.defaultColor;
        this.createBoundView = true;
        this.editPolygon = false;
        this.lista = false;
        this.vehiclesBoundView = false;
        this.editBoundView = false;
    }

    deleteBound(id) {
        this.cercoService.delete(id).then(
            success => {
                this.getAllBounds();
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

    deleteVehicleFromBound(vehicle) {
        this.cercoService.deleteVehicleFromBound(vehicle.id)
            .then(success => {
                const index = this.vehiclesInBound.indexOf(vehicle, 0);
                if (index > -1) {
                    this.vehiclesInBound.splice(index, 1);
                }
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    this.errorDeleteData = true;
                } else {
                    // on general error
                    this.errorDelete = true;
                }
            });
    }

    selectColor() {
        this.drawPluginOptions.draw.polygon.shapeOptions.color = this.colorSelected;
    }

//    ------------------------------------------------------------------------------------

    onMapReady(map: L.Map) {
        this.map =  map;
        this.globalOSM.setupLayer(this.map);
        /***************** On Create new bounds *****************/
        if (this.createBoundView) {
            this.figure = undefined;
            this.editableLayers = new L.FeatureGroup();
            this.map.addLayer(this.editableLayers);
            this.drawPluginOptions = this.globalOSM.drawPlugin(this.editableLayers);
            this.drawControl = new L.Control.Draw(this.drawPluginOptions);
            this.map.addControl(this.drawControl);
            this.actionControls();
            this.center = this.globalOSM.center;
            this.zoom = this.globalOSM.zoom;
        }

        /***************** On Show a bounds *****************/
        if (this.vehiclesBoundView) {
            const coords = JSON.parse(this.selectedBounds.points);
            this.editableLayers = new L.FeatureGroup();
            this.map.addLayer(this.editableLayers);
            this.toEditPolygon = L.polygon([[]]).setLatLngs(coords);
            this.toEditPolygon.options.color = this.selectedBounds.color;
            this.editableLayers.addLayer(this.toEditPolygon);
            const centerPoint = geolib.getCenter(coords);
            this.center = L.latLng(([ centerPoint.latitude, centerPoint.longitude ]));
            this.zoom = this.globalOSM.zoom;
            this.map.fitBounds(this.toEditPolygon.getBounds());
            this.map.zoom = 20;
        }
        /***************** On Edit a bounds *****************/
        if (this.editPolygon) {
            const coords = JSON.parse(this.selectedBounds.points);
            this.editableLayers = new L.FeatureGroup();
            this.map.addLayer(this.editableLayers);
            this.toEditPolygon = L.polygon([[]]).setLatLngs(coords);
            this.toEditPolygon.options.color = this.selectedBounds.color;
            this.editableLayers.addLayer(this.toEditPolygon);
            this.map.addLayer(this.editableLayers);
            const centerPoint = geolib.getCenter(coords);
            this.center = L.latLng(([ centerPoint.latitude, centerPoint.longitude ]));
            this.zoom = this.globalOSM.zoom;
            this.map.fitBounds(this.toEditPolygon.getBounds());
        }

    }

    actionControls() {
        this.map.on('draw:created', e => {
            console.log(e.layerType);
            this.figure = e.layer;
            this.editableLayers.addLayer(e.layer);
        });
        this.map.on('draw:drawstart ', e => {
            this.polygon = L.polygon([]);
            this.polygonDrawed = false;
            this.drawing = true;
            this.alertError = false;
            this.alertSuccess = false;
            if (this.figure != undefined) {
                this.figure.remove(this.map);
            }
        });
        this.map.on('draw:drawstop ', e => {
            this.polygonDrawed = true;
            this.drawing = false;
            this.pointsToSave = this.figure.editing.latlngs[0][0];
            console.log(JSON.stringify(this.pointsToSave));
        });
        this.map.on('draw:deleted', e => {
            console.log('deleted');
        });
    }
}


