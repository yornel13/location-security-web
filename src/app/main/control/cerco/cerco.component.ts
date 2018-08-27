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
    private map;

    message: string;
    alertError: boolean;
    alertSuccess: boolean;
    @ViewChild('nameBoundField') nameBoundField: any;
    @ViewChild('vehicleChecked') vehicleChecked: any;


    bounds: Bounds[];
    cercos: any = undefined;
    polyCoords = {latitude: [], longitude: []};
    toEditPolygon =  L.polygon([]);
    editPolygon = false;
    vehiclesList;
    checked = false;
    vehicles = {imei: [], alias: []};
    cercoId;
    vehiclesInBound: Bounds[] = [];

    constructor (public router: Router, private adminService: AdminService, private storage: AngularFireStorage, private cercoServise: CercoService, private vehiculoServise: VehiclesService) {
        this.getAllBounds();
        this.lista = true;
        this.vehiclesBoundView = false;
        this.createBoundView = false;
        this.editBoundView = false;
    }

    zoom: 12;
    center = L.latLng(([ -2.071522, -79.607105 ]));
    LAYER_OSM = {
        id: 'openstreetmap',
        name: 'Open Street Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        })
    };
    LAYER_GOOGLE_STREET = {
        id: 'googlestreets',
        name: 'Google Street Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=marker&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Street Map'
        })
    };
    LAYER_GOOGLE_SATELLITE = {
        id: 'googlesatellite',
        name: 'Google Satellite Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Satellite Map'
        })
    };
    LAYER_GOOGLE_TERRAIN = {
        id: 'googletarrain',
        name: 'Google Terrain Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Terrain Map'
        })
    };

    // Values to bind to Leaflet Directive
    layersControlOptions = { position: 'bottomright' };
    baseLayers = {
        'Open Street Map': this.LAYER_OSM.layer,
        'Google Street Map': this.LAYER_GOOGLE_STREET.layer,
        'Google Satellite Map': this.LAYER_GOOGLE_SATELLITE.layer,
        'Google Terrain Map': this.LAYER_GOOGLE_TERRAIN.layer
    };
    options = {
        zoom: 8,
        center: L.latLng(([ -2.071522, -79.607105 ])),
        editable: true
    };
    drawOptions = {
        position: 'topleft',
        draw: {
            marker: false,
            circlemarker: false,
            circle: false,
            polyline: false,
            rectangle: false,
        },
        edit: {

        }
    };

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

                    const  coords =  JSON.stringify(this.polyCoords);
                    console.log(coords);
                    const bound: Cerco = {
                        name: this.nameBound,
                        points: coords,
                        status:  true
                    };

                    this.cercoServise.add(bound).then(sucess => {
                        this.getAllBounds();
                        this.regresar();
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

    getAllBounds() { /*------------------------------------------------------------------------------------------*/
        this.cercoServise.getAll().then(
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

    getVehiclesInBound(id, name) {
        this.cercoId = id;
        this.nameBound = name;
        this.cercoServise.getVehiclesInBound(id).then(
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

        this.cercoServise.getId(id).then(
            success => {
                const cercoToEdit: Cerco = success;
                const coords = JSON.parse(cercoToEdit.points);


                const coordinates = [];
                for (let i = 0; i < coords.latitude.length; i++) {
                    coordinates.push([ coords.latitude[i], coords.longitude[i]]);
                }
                this.toEditPolygon = L.polygon([[]]).setLatLngs(coordinates).addTo(this.map);

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
        this.vehiculoServise.getVehiclesList().then(
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

        this.cercoServise.addVehiclesToBound(id, JSON.stringify(array))
            .then( sucess => {
            this.getVehiclesInBound(this.cercoId, this.nameBound);
        },  error => {
            if (error.status === 422) {
                // on some data incorrect
            } else {
                // on general error
            }
        });
    }

    regresar() {
        this.lista = true;
        this.vehiclesBoundView = false;
        this.createBoundView = false;
        this.editBoundView = false;
        this.errorEditData = false;
        this.nameBound = '';
        this.message = '';
        this.alertError = false;
        this.alertSuccess = false;
    }

    editBound(id) {
        this.editPolygon = true;
        this.cercoServise.getId(id).then(
            success => {
                const cercoToEdit: Cerco = success;
                const coords = JSON.parse(cercoToEdit.points);


                const coordinates = [];
                for (let i = 0; i < coords.latitude.length; i++) {
                    coordinates.push([ coords.latitude[i], coords.longitude[i]]);
                }
                this.toEditPolygon = L.polygon([[]]).setLatLngs(coordinates);
                // const latLngs = [];
                // L.polygon([]).setLatLngs(latLngs);
                // this.nombre = this.admin.name;
                // this.apellido = this.admin.lastname;
                // this.correo = this.admin.email;
                // this.photo = this.admin.photo;
                // this.identificacion = this.admin.dni;
                // this.idEdit = this.admin.id;
                this.lista = false;
                // this.vehiclesBoundView = false;
                // this.createBoundView = false;
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
                this.regresar();
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
        this.createBoundView = true;
        this.editPolygon = false;
        this.lista = false;
        this.vehiclesBoundView = false;
        this.editBoundView = false;
    }

    deleteBound(id) {
        this.cercoServise.delete(id).then(
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
        this.cercoServise.deleteVehicleFromBound(vehicle.id)
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

//    ------------------------------------------------------------------------------------

    onMapReady(map: L.Map) {
        this.map =  map;

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        }).addTo(map);
        this.drawBounds();
        this.actionControls();

        if (this.editPolygon) {
            this.map.addLayer(this.toEditPolygon);
        }

        this.toEditPolygon.on('click', e => {
            e.target.editing.enable();
            const drawnItems = new L.FeatureGroup().getBounds();
            this.map.addLayer(drawnItems);
            console.log('diooo');
        });

    }

    actionControls() {
        this.marker.addTo(this.map);
        this.map.on('draw:drawstart ', e => {
            this.polygon = L.polygon([]);
            this.polygonDrawed = false;
            this.drawing = true;

            this.alertError = false;
            this.alertSuccess = false;
        });
        this.map.on('draw:drawstop ', e => {
            this.onArea = this.polygon.getBounds().contains(this.marker.getLatLng());
            this.polygonDrawed = true;
            this.drawing = false;

        });
        this.map.on('draw:deleted', e => {
            console.log('deleted');
            // this.polygon = L.polygon([]);
        });
    }



    drawBounds() {
        let  i = 0;
        this.map.on('click', ev => {
            if (this.drawing) {
                const lat = ev.latlng.lat;
                const lng  = ev.latlng.lng;
                this.polygon.addLatLng([lat, lng]);

                this.polyCoords.latitude[i] = lat ;
                this.polyCoords.longitude[i] = lng ;
                i++;
                // console.log('lat: ', lat, '  lng: ', lng);
            }

        });
    }

    ngOnInit() {

    }



}


