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


@Component({
    selector: 'app-cerco',
    templateUrl: './cerco.component.html',
    styleUrls: ['./cerco.component.css']
})

export class CercoComponent {
    //general
    administradores: any = undefined;
    data: any = undefined;
    admin: any = [];
    error: string;
    //vistas admin
    lista: boolean;
    mapView: boolean;
    createBoundView: boolean;
    editar: boolean;
    //editar
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
    //createBoundView
    nameBound: string;
    lastnamea: string;
    emaila: string;
    dnia: string;
    passworda: string;
    photoa: string;
    errorSave = false;
    errorSaveData = false;
    errorNewMsg: string;
    //eliminar
    errorDelete = false;
    errorDeleteData = false;
    boundsFilter: any = { 'name': ''};
    //imagen firebase
    uploadPercent: Observable<number>;
    downloadURL: Observable<string>;

    marker = L.marker([-2.071522, -79.607105], {draggable: true});
    polygonDrawed: boolean;
    drawing: boolean;
    polygon;
    onArea;
    private map;

    message: string;
    alertError: boolean;
    alertSuccess: boolean;
    @ViewChild('nameBoundField') nameBoundField: any;

    cercos: any = undefined;
    polyCoords = [];


    constructor(public router: Router, private adminService: AdminService, private storage: AngularFireStorage, private cercoServise: CercoService) {
        this.getAllBounds();
        this.lista = true;
        this.mapView = false;
        this.createBoundView = false;
        this.editar = false;
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
    };
    drawOptions = {
        position: 'topleft',
        draw: {
            marker: false,
            circlemarker: false,
            circle: false,
            polyline: false,
            rectangle: false,
        }
    };



    saveNewBound() {
        const nameBound = this.nameBoundField.nativeElement.value;
        if (nameBound) {
            if (typeof this.polygon !== 'undefined') {

                if (this.polygonDrawed) {
                    for (const poly of this.data) {
                        if (poly.name.toLowerCase().match(nameBound.toLowerCase())) {
                            this.message = 'El nombre del cerco ya se encuentra en uso!';
                            this.alertError = true;
                            this.alertSuccess = false;
                            return;
                        }
                    }

                    const  coords =  JSON.stringify(this.polyCoords);
                    const bound: Cerco = {
                        name : this.nameBound,
                        points : coords,
                        status: true
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

    viewBoundsOnMap(id) {
        this.adminService.getId(id).then(
            success => {
                this.admin = success;
                this.lista = false;
                this.mapView = true;
                this.createBoundView = false;
                this.editar = false;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    upload(event) {
        const file = event.target.files[0];
        const randomId = Math.random().toString(36).substring(2);
        const url = '/icsse/' + randomId;
        const ref = this.storage.ref(url);
        //const task = ref.put(file);
        const task = this.storage.upload(url, file);
        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
            finalize(() => {this.downloadURL = ref.getDownloadURL();
                this.downloadURL.subscribe(url => (this.photo = url)); }
            )).subscribe();
    }

    uploadNew(event) {
        const file = event.target.files[0];
        const randomId = Math.random().toString(36).substring(2);
        const url = '/icsse/' + randomId;
        const ref = this.storage.ref(url);
        const task = this.storage.upload(url, file);
        this.uploadPercent = task.percentageChanges();
        task.snapshotChanges().pipe(
            finalize(() => {this.downloadURL = ref.getDownloadURL();
                this.downloadURL.subscribe(url => (this.photoa = url)); }
            )).subscribe();
    }

    regresar() {
        this.lista = true;
        this.mapView = false;
        this.createBoundView = false;
        this.editar = false;
        this.errorEditData = false;
        this.nameBound = '';
        this.message = '';
        this.alertError = false;
        this.alertSuccess = false;
    }

    editarAdmmin(id) {
        this.adminService.getId(id).then(
            success => {
                this.admin = success;
                console.log(this.admin);
                this.nombre = this.admin.name;
                this.apellido = this.admin.lastname;
                this.correo = this.admin.email;
                this.photo = this.admin.photo;
                this.identificacion = this.admin.dni;
                this.idEdit = this.admin.id;
                this.lista = false;
                this.mapView = false;
                this.createBoundView = false;
                this.editar = true;
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
        if (this.contrasena == 'password') {
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

    saveEdit() {

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
        this.lista = false;
        this.mapView = false;
        this.createBoundView = true;
        this.editar = false;
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

    activarAdmin(id) {
        this.adminService.activeAdmin(id).then(
            success => {
                this.getAllBounds();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    desactivarAdmin(id) {
        this.adminService.desactiveAdmin(id).then(
            success => {
                this.getAllBounds();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

//    ------------------------------------------------------------------------------------

    onMapReady(map: L.Map) {
        this.map = map;
        this.setBounds();
        this.actionControls();
    }

    actionControls() {
        this.marker.addTo(this.map);
        this.map.on('draw:drawstart ', e => {
            console.log('started');
            this.polygon = L.polygon([]);
            this.polygonDrawed = false;
            this.drawing = true;

            this.alertError = false;
            this.alertSuccess = false;
        });
        this.map.on('draw:drawstop ', e => {
            console.log('stopped');
            this.onArea = this.polygon.getBounds().contains(this.marker.getLatLng());
            this.polygonDrawed = true;
            this.drawing = false;

        });
        this.map.on('draw:deleted', e => {
            console.log('deleted');
            // this.polygon = L.polygon([]);
        });
    }

    setBounds() {
        this.map.on('click', ev => {
            if (this.drawing) {
                const lat = ev.latlng.lat;
                const lng  = ev.latlng.lng;
                this.polygon.addLatLng([lat, lng]);
                this.polyCoords.push('{latitude: ' + lat, 'longitude: ' + lng + '},');

            }
        });
    }



}


