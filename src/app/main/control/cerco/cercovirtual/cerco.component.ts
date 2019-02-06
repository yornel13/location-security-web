import {Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from '../../../../../model/admin/admin.service';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-draw';
import {CercoService} from '../../../../../model/cerco/cerco.service';
import {Cerco} from '../../../../../model/cerco/cerco';
import {VehiclesService} from '../../../../../model/vehicle/vehicle.service';
import {ListBounds} from '../../../../../model/cerco/list.bounds';
import {Bounds} from '../../../../../model/cerco/bounds';
import {GlobalOsm} from '../../../../global.osm';
import * as geolib from 'geolib';
import {TabletService} from '../../../../../model/tablet/tablet.service';

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
    map: L.Map;
    drawPluginOptions;
    editableLayers;

    message: string;
    alertError: boolean;
    alertSuccess: boolean;
    @ViewChild('nameBoundField') nameBoundField: any;
    @ViewChild('vehicleChecked') vehicleChecked: any;


    bounds: Bounds[];
    tabletsInBounds: Bounds[] = [];
    cercos: any = undefined;
    toEditPolygon =  L.polygon([]);
    editPolygon = false;
    vehiclesList;
    checked = false;
    vehicles = {imei: [], alias: []};
    cercoId;
    vehiclesInBound: Bounds[] = [];

    tablets: any = [];
    tabletsList: any = []

    zoom: number;
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

    nameBoundEdit: any = '';
    colorEdit;
    filter: string;
    filterT: string;
    filterValue: string;

    constructor (
        public router: Router,
        private adminService: AdminService,
        private storage: AngularFireStorage,
        private cercoService: CercoService,
        private vehiclesService: VehiclesService,
        private tabletService: TabletService,
        private globalOSM: GlobalOsm) {
        /* Map default options */
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = this.globalOSM.defaultOptions;
        this.zoom = this.globalOSM.zoom;
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
                    const bound: Cerco = {
                        name: this.nameBound,
                        points: coords,
                        color: this.colorSelected,
                        status:  1
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
        this.createCenterInCerco(cerco);
        this.selectedBounds = cerco;
        this.cercoId = cerco.id;
        this.nameBound = cerco.name;
        this.cercoService.getTabletsInBound(cerco.id).then(
            (success: ListBounds) => {
                this.tabletsInBounds = success.data;
                this.loadTabletsListModal();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
        this.cercoService.getVehiclesInBound(cerco.id).then(
            (success: ListBounds) => {
                this.vehiclesInBound = success.data;
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
                // this.bounds.forEach(vBounds => {
                //     this.vehiclesList.forEach(vehicle => {
                //         if (vehicle.imei == vBounds.imei) {
                //             vBounds.alias = vehicle.alias;
                //         }
                //     });
                // });
                // this.vehiclesInBound = this.bounds;
            });
    }

    addVehiclesToBound() {
        const array = [];
        this.vehiclesList.forEach(vehicle => {
            if (vehicle.checked) {
                const vehicler: VechicleS = new VechicleS();
                vehicler.imei = vehicle.imei;
                array.push(vehicler);
            }
        });

        this.cercoService.addVehiclesToBound(this.cercoId, JSON.stringify(array))
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

    addTabletToBound() {
        const array = [];
        this.tabletsList.forEach(tablet => {
            if (tablet.checked) {
                const vehicler = new VechicleS();
                vehicler.imei = tablet.imei;
                array.push(vehicler);
            }
        });

        this.cercoService.addTabletsToBound(this.cercoId, JSON.stringify(array))
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

        if (this.map !== undefined) {
            this.map.remove();
        }
    }

    editBound(cerco: Cerco) {
        this.createCenterInCerco(cerco);
        this.selectedBounds = cerco;
        this.editPolygon = true;
        this.cercoService.getId(cerco.id).then(
            success => {
                this.selectedBounds = success;
                this.colorEdit = this.selectedBounds.color;
                const coords = JSON.parse(this.selectedBounds.points);
                this.toEditPolygon = L.polygon([[]]).setLatLngs(coords);
                this.lista = false;
                this.editBoundView = true;
                this.nameBoundEdit = this.selectedBounds.name;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    saveEditedBound() {
        const bound: Cerco = {
            id: this.selectedBounds.id,
            name: this.nameBoundEdit,
            points: this.selectedBounds.points,
            color: this.colorEdit
        };
        this.cercoService.set(bound).then(
            success => {
                this.getAllBounds();
                this.returnList();
                this.nameBound = '';
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
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
        this.nameBound = '';
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

    loadTabletsListModal() {
        this.tabletService.getAll().then(
            success => {
                this.tablets = success;
                this.tabletsList = this.tablets.data;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
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

    deleteTabletFromBound(tablet) {
        this.cercoService.deleteTabletFromBound(tablet.id)
            .then(success => {
                const index = this.tabletsInBounds.indexOf(tablet, 0);
                if (index > -1) {
                    this.tabletsInBounds.splice(index, 1);
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
        this.map = map;
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
            /*** Zoom ***/
            const bounds = new L.LatLngBounds(coords);
            this.map.fitBounds(bounds);
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
            /*** Zoom ***/
            const bounds = new L.LatLngBounds(coords);
            this.map.fitBounds(bounds);
        }
    }

    createCenterInCerco(cerco: Cerco) {
        const coords = JSON.parse(cerco.points);
        const centerPoint = geolib.getCenter(coords);
        this.center = L.latLng(([ centerPoint.latitude, centerPoint.longitude ]));
    }

    actionControls() {
        this.map.on('draw:created', (e: any) => {
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
        });
        this.map.on('draw:deleted', e => {
            console.log('deleted');
        });
    }
}