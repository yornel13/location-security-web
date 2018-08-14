import {
    Component,
    ComponentFactoryResolver,
    Injector,
    Input,
    OnChanges,
    SimpleChanges } from '@angular/core';
import { Vehicle } from '../../../../model/vehicle/vehicle';
import { PopupVehicleComponent } from './popup.vehicle.component';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {Watch} from '../../../../model/watch/watch';
import {PopupWatchComponent} from './popup.watch.component';
import {AsideService} from "../aside/aside.service";

@Component({
    selector : 'app-map-osm',
    templateUrl : './map.osm.html',
    styleUrls: ['./map.osm.css']
})
export class MapOsmComponent implements OnChanges {
    @Input()
    vehicles: Vehicle[] = [];
    @Input()
    watches: Watch[] = [];
    @Input()
    lat = -2.071522;
    @Input()
    lng = -79.607105;
    @Input()
    zoom: number;
    @Input()
    changeMarker;
    markerClusterGroup: L.MarkerClusterGroup;
    markerClusterData: any[] = [];
    markerClusterOptions: L.MarkerClusterGroupOptions;
    center = L.latLng(([ this.lat, this.lng ]));
    map: any;
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
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
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
        center: L.latLng([ this.lat, this.lng ])
    };

    constructor(private resolver: ComponentFactoryResolver,
                private asideService: AsideService,
                private injector: Injector) {
        asideService.marker.subscribe(
            (data: any) => {
                this.zoom = 18;
                this.center = data;
            });
    }

    onMapReady(map: L.Map) {
        this.map = map;
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicles']) {
            console.log('updating vehicles');
            this.setupVehicles();
        }
        if (changes['watches']) {
            console.log('updating watches');
            this.setupWatches();
        }
        if (changes['lat']) {
            this.setCenter();
        }
        if (changes['changeMarker']) {
            if (this.changeMarker.match('showVehiclesMarkers')) {
                this.setupVehicles();
            } else {
                this.setupWatches();
            }
        }
    }

    markerClusterReady(group: L.MarkerClusterGroup) {
        this.markerClusterGroup = group;
    }

    setupVehicles() {
        const data: any[] = [];
        this.vehicles.forEach(vehicle => {
            const imageIcon = {
                icon: L.icon({
                    iconUrl   : vehicle.iconUrl,
                })
            };
            const m = L.marker([vehicle.latitude, vehicle.longitude], imageIcon);
            const factory = this.resolver.resolveComponentFactory(PopupVehicleComponent);
            const component = factory.create(this.injector);
            const popupContent = component.location.nativeElement;
            component.instance.vehicle = vehicle;
            component.changeDetectorRef.detectChanges();
            m.bindPopup(popupContent).openPopup();
            data.push(m);
        });
        this.markerClusterData = data;
    }
    setupWatches() {
        const data: any[] = [];
        this.watches.forEach(watch => {
            const imageIcon = {
                icon: L.icon({
                    iconUrl   : watch.iconUrl,
                })
            };
            const m = L.marker([watch.latitude, watch.longitude], imageIcon);
            const factory = this.resolver.resolveComponentFactory(PopupWatchComponent);
            const component = factory.create(this.injector);
            const popupContent = component.location.nativeElement;
            component.instance.watch = watch;
            component.changeDetectorRef.detectChanges();
            m.bindPopup(popupContent).openPopup();
            data.push(m);
        });
        this.markerClusterData = data;
    }

    setCenter() {
        this.center = L.latLng(([ this.lat, this.lng ]));
    }
}
