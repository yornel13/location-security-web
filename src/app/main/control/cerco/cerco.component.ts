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
    polyCoords = {latitude: [], longitude: []};
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
    drawOptions;
    drawControl;
    figure;
    selectedBounds: Cerco = undefined;

    //poligono
    colorpoli = '#97009c';

    constructor (
            public router: Router,
            private adminService: AdminService,
            private storage: AngularFireStorage,
            private cercoServise: CercoService,
            private vehiculoServise: VehiclesService,
            private globalOSM: GlobalOsm) {
        this.getAllBounds();
        this.lista = true;
        this.vehiclesBoundView = false;
        this.createBoundView = false;
        this.editBoundView = false;
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = {
            zoom: 8,
            center: L.latLng(([ -2.071522, -79.607105 ])),
            editable: true
        };
        this.drawOptions = {
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

                    const coords = JSON.stringify(this.polyCoords);
                    console.log(coords);
                    const bound: Cerco = {
                        name: this.nameBound,
                        points: coords,
                        color: this.colorpoli,
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

    getVehiclesInBound(cerco: Cerco) {
        this.selectedBounds = cerco;
        this.cercoId = cerco.id;
        this.nameBound = cerco.name;
        this.cercoServise.getVehiclesInBound(cerco.id).then(
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

        this.cercoServise.getId(cerco.id).then(
            success => {
                const cercoToEdit: Cerco = success;
                const coords = JSON.parse(cercoToEdit.points);


                const coordinates = [];
                for (let i = 0; i < coords.latitude.length; i++) {
                    coordinates.push([ coords.latitude[i], coords.longitude[i]]);
                }

                //this.toEditPolygon = L.polygon([[]]).setLatLngs(coordinates).addTo(this.map);

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
            this.getVehiclesInBound(this.selectedBounds);
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

    seleColorPoli(){
        console.log(this.drawPluginOptions.draw.polygon.shapeOptions.color);
        this.drawPluginOptions.draw.polygon.shapeOptions.color = this.colorpoli;
    }

//    ------------------------------------------------------------------------------------

    onMapReady(map: L.Map) {
        this.map =  map;
        //this.map.setCenter(this.center);
        //this.map = L.map('map').setView(this.center, 6);
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        }).addTo(this.map);

        //this.drawPluginOptions.draw.polygon.shapeOptions.color = this.colorpoli;

        if (this.createBoundView) {
            this.editableLayers = new L.FeatureGroup();
            map.addLayer(this.editableLayers);
            this.drawPluginOptions = {
                position: 'topright',
                draw: {
                    polygon: {
                        allowIntersection: false, // Restricts shapes to simple polygons
                        drawError: {
                            color: '#e1e100', // Color the shape will turn when intersects
                            message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                        },
                        shapeOptions: {
                            color: this.colorpoli
                        }
                    },
                    // disable toolbar item by setting it to false
                    polyline: false,
                    circle: false, // Turns off this drawing tool
                    rectangle: false,
                    marker: false,
                    circlemarker: false,
                },
                edit: {
                    featureGroup: this.editableLayers,
                    remove: false
                }
            };
            this.drawControl = new L.Control.Draw(this.drawPluginOptions);
            this.map.addControl(this.drawControl);
            this.map.on('draw:created', e => {
                this.figure = e.layer;
                this.editableLayers.addLayer(e.layer);
            });
            this.actionControls();
            this.drawBounds();
        }

        if (this.vehiclesBoundView) {
            const coords = JSON.parse(this.selectedBounds.points);
            const coordinates = [];
            for (let i = 0; i < coords.latitude.length; i++) {
                coordinates.push([ coords.latitude[i], coords.longitude[i]]);
                console.log('lat: ', coords.latitude[i], '  lng: ', coords.longitude[i]);
            }
            this.editableLayers = new L.FeatureGroup();
            map.addLayer(this.editableLayers);
            this.toEditPolygon = L.polygon([[]]).setLatLngs(coordinates);
            this.editableLayers.addLayer(this.toEditPolygon);
        }

        // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        //     maxZoom: 20,
        //     detectRetina: true,
        //     attribution: 'Open Street Map'
        // }).addTo(map);
        // this.drawBounds();
        // this.actionControls();
        //
        // if (this.editPolygon) {
        //     this.map.addLayer(this.toEditPolygon);
        // }
        //
        // this.toEditPolygon.on('click', e => {
        //     e.target.editing.enable();
        //     const drawnItems = new L.FeatureGroup().getBounds();
        //     this.map.addLayer(drawnItems);
        //     console.log('diooo');
        // });

    }

    actionControls() {
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
                console.log('lat: ', lat, '  lng: ', lng);
            }

        });
    }

    ngOnInit() {

    }



}


