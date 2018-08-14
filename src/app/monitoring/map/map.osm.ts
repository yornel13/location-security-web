import {
    Component,
    ComponentFactoryResolver,
    Injector,
    Input,
    OnChanges,
    SimpleChanges } from '@angular/core';
import { Vehicle } from '../../model/vehicle/vehicle';
import { PopupVehicleComponent } from './popup.vehicle.component';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {Watch} from '../../model/watch/watch';
import {PopupWatchComponent} from './popup.watch.component';

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
    lat: number;
    @Input()
    lng: number;
    @Input()
    zoom: number;
    markerClusterGroup: L.MarkerClusterGroup;
    markerClusterData: any[] = [];
    markerClusterOptions: L.MarkerClusterGroupOptions;
    LAYER_OSM = {
        id: 'openstreetmap',
        name: 'Open Street Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            attribution: 'Open Street Map'
        })
    };
    LAYER_GOOGLE_STREET = {
        id: 'googlestreets',
        name: 'Google Street Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Street Map'
        })
    };
    LAYER_GOOGLE_SATELLITE = {
        id: 'googlesatellite',
        name: 'Google Satellite Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Satellite Map'
        })
    };
    LAYER_GOOGLE_TERRAIN = {
        id: 'googletarrain',
        name: 'Google Terrain Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Terrain Map'
        })
    };

    // Values to bind to Leaflet Directive
    layersControlOptions = { position: 'bottomright' };
    baseLayers = {
        'Open Street Map': this.LAYER_GOOGLE_STREET.layer
    };
    options = {
        zoom: 12,
        center: L.latLng([ -2.071522, -79.607105 ])
    };

    constructor(private resolver: ComponentFactoryResolver, private injector: Injector) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicles']) {
            this.setupVehicles();
        }
        if (changes['watches']) {
            this.setupWatches();
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
}