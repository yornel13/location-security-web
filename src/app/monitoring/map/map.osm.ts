import {
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    Injector,
    DoCheck,
    Input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { Vehicle } from '../../model/vehicle/vehicle';
import { tileLayer, latLng, marker, Marker, icon } from 'leaflet';
import { PopupVehicleComponent } from './popup.vehicle.component';

interface MarkerMetaData {
    name: String;
    markerInstance: Marker;
    componentInstance: ComponentRef<PopupVehicleComponent>;
}
@Component({
    selector : 'app-map-osm',
    templateUrl : './map.osm.html',
    styleUrls: ['./map.osm.css']
})
export class MapOsmComponent implements DoCheck, OnChanges {
    @Input()
    vehicles: Vehicle[] = [];
    @Input()
    lat: number;
    @Input()
    lng: number;
    @Input()
    zoom: number;
    map;
    markers: MarkerMetaData[] = [];
    options = {
        layers: [
            tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        ],
        zoom: 12,
        center: latLng(-2.071522, -79.607105)
    };

    constructor(private resolver: ComponentFactoryResolver, private injector: Injector){ }

    onMapReady(map) {
        // get a local reference to the map as we need it later
        this.map = map;
    }

    addMarker() {
        if (this.vehicles != null) {
            this.vehicles.forEach(vehicle => {
                const imageIcon = {
                    icon: icon({
                        //iconSize  : [25, 41],
                        //iconAnchor: [13, 41],
                        iconUrl   : vehicle.iconUrl,
                        //shadowUrl : vehicle.shadowUrl
                    })
                }
                const m = marker([vehicle.latitude, vehicle.longitude], imageIcon );
                const factory = this.resolver.resolveComponentFactory(PopupVehicleComponent);
                const component = factory.create(this.injector);
                const popupContent = component.location.nativeElement;
                component.instance.vehicle = vehicle;
                component.changeDetectorRef.detectChanges();
                m.bindPopup(popupContent).openPopup();
                m.addTo(this.map);
                this.markers.push({
                    name: vehicle.alias,
                    markerInstance: m,
                    componentInstance: component
                });
            });
        }
    }

    removeMarker(markerRemove) {
        // remove it from the array meta objects
        const idx = this.markers.indexOf(markerRemove);
        this.markers.splice(idx, 1);

        // remove the marker from the map
        markerRemove.markerInstance.removeFrom(this.map);

        // destroy the component to avoid memory leaks
        markerRemove.componentInstance.destroy();
    }

    // This is a lifecycle method of an Angular component which gets invoked whenever for
    // our component change detection is triggered
    ngDoCheck() {
        // since our components are dynamic, we need to manually iterate over them and trigger
        // change detection on them.
        this.markers.forEach(entry => {
            entry.componentInstance.changeDetectorRef.detectChanges();
        });
    }

    ngOnChanges(changes: SimpleChanges) {
        // only run when property "data" changed
        if (changes['vehicles']) {
            this.vehicles = this.getVehicles(this.vehicles);
            this.addMarker();
        }
    }
    getVehicles(vehicles: Vehicle[]) {
        if (!vehicles) { return; }
        return vehicles;
    }
}