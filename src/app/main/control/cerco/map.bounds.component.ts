///<reference path="../../../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Component, ComponentFactoryResolver, DoCheck, OnChanges, OnInit, SimpleChanges} from '@angular/core';

import * as L from 'leaflet';
import 'leaflet.markercluster';
import 'leaflet-draw';



@Component({
    selector : 'app-map-bounds',
    templateUrl : './mapView.bounds.component.html',
    styleUrls: ['./mapView.bounds.component.css']
})
export class MapBoundsComponent implements OnChanges, DoCheck {

    lat;
    lng;
    zoom: 12;
    center = L.latLng(([ -2.071522, -79.607105 ]));

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
    layersControlOptions = { position: 'bottomright', polygonOptions: true};
    baseLayers = {
        'Google Street Map': this.LAYER_GOOGLE_STREET.layer,
        'Google Satellite Map': this.LAYER_GOOGLE_SATELLITE.layer,
        'Google Terrain Map': this.LAYER_GOOGLE_TERRAIN.layer,
        'Open Street Map': this.LAYER_OSM.layer
    };
    options = {
        zoom: 12,
        center: L.latLng(([ -2.071522, -79.607105 ])),
        // drawControl: true
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
    marker = L.marker([-2.071522, -79.607105], {draggable: true});
    drawPolygon: boolean;
    polygon;
    onArea;

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
            this.drawPolygon = true;
        });
        this.map.on('draw:drawstop ', e => {
            console.log('stopped');
            this.drawPolygon = false;
            this.onArea = this.polygon.getBounds().contains(this.marker.getLatLng());
        });
        this.map.on('draw:deleted', e => {
            console.log('deleted');
            this.polygon = L.polygon([]);
        });
    }

    setBounds() {
        this.map.on('click', ev => {
            if (this.drawPolygon) {
                const lat = ev.latlng.lat;
                const lng  = ev.latlng.lng;
                this.polygon.addLatLng([lat, lng]);
            }
        });
    }

    ngDoCheck(): void {
        if (this.onArea ) {
            this.onArea = this.polygon.getBounds().contains(this.marker.getLatLng());
            console.log('onArea');
        } else {
            try {
                this.onArea = this.polygon.getBounds().contains(this.marker.getLatLng());
                console.log('out of Area');
            } catch (e) {
                // console.log(e);
            }
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
    }


}
