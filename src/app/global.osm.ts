import {Injectable} from '@angular/core';
import * as L from 'leaflet';

@Injectable()
export class GlobalOsm {
    readonly LAYER_OSM = {
        id: 'openstreetmap',
        name: 'Open Street Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        })
    };
    readonly LAYER_GOOGLE_STREET = {
        id: 'googlestreets',
        name: 'Google Street Map',
        enabled: false,
        layer: L.tileLayer('http://mt.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Street Map'
        })
    };
    readonly LAYER_GOOGLE_SATELLITE = {
        id: 'googlesatellite',
        name: 'Google Satellite Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Satellite Map'
        })
    };
    readonly LAYER_GOOGLE_TERRAIN = {
        id: 'googletarrain',
        name: 'Google Terrain Map',
        enabled: false,
        layer: L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
            attribution: 'Google Terrain Map'
        })
    };
    readonly baseLayers = {
        'Open Street Map': this.LAYER_OSM.layer,
        'Google Street Map': this.LAYER_GOOGLE_STREET.layer,
        'Google Satellite Map': this.LAYER_GOOGLE_SATELLITE.layer,
        'Google Terrain Map': this.LAYER_GOOGLE_TERRAIN.layer
    };

    readonly layersOptions = { position: 'bottomright' };

    drawPlugin(editableLayers): any {
        const drawPluginOptions = {
            position: 'topright',
            draw: {
                polygon: {
                    allowIntersection: false, // Restricts shapes to simple polygons
                    drawError: {
                        color: '#e1e100', // Color the shape will turn when intersects
                        message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                    },
                    shapeOptions: {
                        color: '#97009c'
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
                featureGroup: editableLayers,
                remove: false
            }
        };
        return drawPluginOptions;
    }

    setupLayer(map: L.Map) {
        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 20,
            detectRetina: true,
            attribution: 'Open Street Map'
        }).addTo(map);
    }
}
