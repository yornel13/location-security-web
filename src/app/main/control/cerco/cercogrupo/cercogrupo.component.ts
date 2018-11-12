import { Component, ViewChild } from '@angular/core';
import {GrupoService} from '../../../../../model/grupos/grupo.service';
import {Grupos} from '../../../../../model/grupos/grupos';
import {VehiclesService} from '../../../../../model/vehicle/vehicle.service';
import {CercoService} from '../../../../../model/cerco/cerco.service';
import {GlobalOsm} from '../../../../global.osm';
import * as L from 'leaflet';

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
    filterValue: string;

    layersControlOptions;
    baseLayers;
    options;
    zoom: number;
    map: L.Map;
    editableLayers;
    groupsPolygons: any = [];
    center = L.latLng(([ -2.071522, -79.607105 ]));

    @ViewChild('vehicleChecked') vehicleChecked: any;

    constructor(
            private grupoService: GrupoService,
            private vehiclesService: VehiclesService,
            private cercoService: CercoService,
            private globalOSM: GlobalOsm) {
        this.getAll();
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.baseLayers = this.globalOSM.baseLayers;
        this.options = this.globalOSM.defaultOptions;
        this.zoom = this.globalOSM.zoom;
        this.regresar();
    }

    getAll() {
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

    guardarGrupo() {
        const savegrupo: Grupos = {
            name: this.newname
        };
        this.grupoService.add(savegrupo).then(
            success => {
                this.getAll();
                this.newname = '';
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    deleteGrupo(id) {
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

    editGrupo(grupo) {
        const editgrupo: Grupos = {
            id: grupo.id,
            name: this.editname
        };
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

    setBoundsToMap(bounds: any[]) {
        const polygons = [];
        const editableLayers = new L.FeatureGroup();
        let zoomBound: L.LatLngBounds = null;
        bounds.forEach(cerco => {
            const coors = JSON.parse(cerco.points);
            this.map.addLayer(editableLayers);
            const polygon = L.polygon([[]]).setLatLngs(coors);
            polygon.options.color = cerco.color;
            editableLayers.addLayer(polygon);
            polygons.push(polygon);
            if (zoomBound == null) {
                zoomBound = new L.LatLngBounds(coors);
            } else {
                zoomBound.extend(coors);
            }
        });
        this.groupsPolygons.push({ id: 1, editableLayers: editableLayers});
        /*** Zoom & Center ***/
        if (zoomBound != null && this.map !== undefined) {
            this.map.fitBounds(zoomBound);
            this.center = L.latLng(([ zoomBound.getCenter().lat, zoomBound.getCenter().lng ]));
        }
    }

    onMapReady(map: L.Map) {
        this.map = map;
        this.globalOSM.setupLayer(this.map);
    }

    setName(nombre) {
        this.editname = nombre;
    }

    regresar() {
        this.detalle = false;
        this.lista = true;
        if (this.map !== undefined) {
            this.map.remove();
        }
    }

    getGrupo(grupo) {
        this.detalle = true;
        this.lista = false;
        this.editname = grupo.name;
        this.editid = grupo.id;
        this.getCercosInBound(grupo.id);
        this.loadCercosListModal();
    }

    getCercosInBound(id) {
        this.grupoService.getCercoGrupo(id).then(
            success => {
                this.cercosb = success;
                this.cercosbuound = this.cercosb.data;
                console.log(this.cercosbuound);
                this.setBoundsToMap(this.cercosbuound);
            });
    }

    loadCercosListModal() {
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

    addCercosToGrupo() {
        const array = [];
        this.cercosList.forEach(cerco => {
            if (cerco.checked) {
                const vehicler: VechicleS = new VechicleS();
                vehicler.id = cerco.id;
                array.push(vehicler);
            }
            cerco.checked = false;
        });

        this.grupoService.addCercosToGroup(this.editid, JSON.stringify(array))
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

    deleteCerco(id) {
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
