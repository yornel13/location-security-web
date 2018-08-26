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
import {AsideService} from '../aside/aside.service';
import {GlobalOsm} from '../../../global.osm';

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
    markerChanged;
    @Input()
    markersData: any[] = [];
    @Input() showMarker = {vehicles: true , watches: true , bombas: true, noGroup: true, message: ''};
    markerClusterGroup: L.MarkerClusterGroup;
    markerClusterData: any[] = [];
    markerClusterOptions: L.MarkerClusterGroupOptions;
    center = L.latLng(([ this.lat, this.lng ]));
    map: any;
    // Values to bind to Leaflet Directive
    layersControlOptions;
    baseLayers;
    options;

    constructor(private resolver: ComponentFactoryResolver,
                private asideService: AsideService,
                private injector: Injector,
                private globalOSM: GlobalOsm) {
        this.baseLayers = this.globalOSM.baseLayers;
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.options = {
            zoom: this.zoom,
            center: this.center
        };
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

        this.setupMarkers(this.showMarker);

        if (changes[this.lat]) {
            this.setupMarkers(this.showMarker);
        }
        if (changes['lat']) {
            this.setCenter();
        }

    }

    markerClusterReady(group: L.MarkerClusterGroup) {
        this.markerClusterGroup = group;
    }

    setupMarkers(showMarker) {
        const data: any[] = [];
        this.markersData.forEach(mData => {
            if (showMarker.vehicles) {
                if (mData.group_name === 'AZUCARERA INGENIO VALDEZ') {
                    const imageIcon = {
                        icon: L.icon({
                            iconUrl: mData.iconUrl,
                        })
                    };
                    const m = L.marker([mData.latitude, mData.longitude], imageIcon);
                    const factory = this.resolver.resolveComponentFactory(PopupVehicleComponent);
                    const component = factory.create(this.injector);
                    const popupContent = component.location.nativeElement;
                    component.instance.imei = mData.imei;
                    component.instance.alias = mData.alias;
                    component.instance.speed = mData.speed;
                    component.instance.generated_time = mData.generated_time;
                    component.instance.model_name = mData.model_name;
                    component.changeDetectorRef.detectChanges();
                    m.bindPopup(popupContent).openPopup();
                    data.push(m);
                }
            }
            if (showMarker.bombas) {
                if (mData.group_name.match('BOMBA')) {
                    const imageIcon = {
                        icon: L.icon({
                            iconUrl: mData.iconUrl,
                        })
                    };
                    const m = L.marker([mData.latitude, mData.longitude], imageIcon);
                    const factory = this.resolver.resolveComponentFactory(PopupVehicleComponent);
                    const component = factory.create(this.injector);
                    const popupContent = component.location.nativeElement;
                    component.instance.imei = mData.imei;
                    component.instance.alias = mData.alias;
                    component.instance.speed = mData.speed;
                    component.instance.generated_time = mData.generated_time;
                    component.instance.model_name = mData.model_name;
                    component.changeDetectorRef.detectChanges();
                    m.bindPopup(popupContent).openPopup();
                    data.push(m);
                }
            }
            if (showMarker.watches) {
                if (mData.group_name === 'Tablet Guardia') {
                    const imageIcon = {
                        icon: L.icon({
                            iconUrl: mData.iconUrl,
                        })
                    };
                    const m = L.marker([mData.latitude, mData.longitude], imageIcon);
                    const factory = this.resolver.resolveComponentFactory(PopupWatchComponent);
                    const component = factory.create(this.injector);
                    const popupContent = component.location.nativeElement;
                    component.instance.dni = mData.guard_dni;
                    component.instance.name = mData.guard_name;
                    component.instance.lastname = mData.guard_lastname;
                    component.instance.generated_time = mData.generated_time;
                    component.changeDetectorRef.detectChanges();
                    m.bindPopup(popupContent).openPopup();
                    data.push(m);
                }
            }
        });
        this.markerClusterData = data;
    }

    setCenter() {
        this.center = L.latLng(([ this.lat, this.lng ]));
    }
}
