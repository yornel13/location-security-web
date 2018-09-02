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
import {Alerta} from '../../../../model/alerta/alerta';
import {AngularFirestore} from 'angularfire2/firestore';

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
    alertsData: any[] = [];
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
                private globalOSM: GlobalOsm,
                private db: AngularFirestore) {
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
        this.globalOSM.setupLayer(this.map);
    }

    ngOnChanges(changes: SimpleChanges) {

        this.setupMarkers(this.showMarker);

        if (changes[this.lat]) {
            this.setupMarkers(this.showMarker);
        }
        if (changes['lat']) {
            this.setCenter();
        }

        this.db.collection<Alerta>('alerts').valueChanges()
          .subscribe((alerts: Alerta[]) => {
            const data: any[] = [];
            this.alertsData = alerts.sort((n1, n2) => {
              if (n1.create_date > n2.create_date) { return -1; }
              if (n1.create_date < n2.create_date) {return 1; }
              return 0;
            });
            this.alertsData.forEach(alert => {
              let imageIcon;
              if (alert.type == this.globalOSM.DROP) {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/falldown.png'})};
              } else if (alert.type == this.globalOSM.SOS1) {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/sos.png'})};
              } else if (alert.type == this.globalOSM.IGNITION_ON) {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/on.png'})};
              } else if (alert.type == this.globalOSM.IGNITION_OFF) {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/off.png'})};
              } else if (alert.type == this.globalOSM.SPEED_MAX) {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/speed.png'})};
              } else if (alert.type == this.globalOSM.INIT_WATCH) {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/watch_start.png'})};
              } else if (alert.type == this.globalOSM.FINISH_WATCH) {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/watch_end.png'})};
              } else if (alert.type == this.globalOSM.OUT_BOUNDS) {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/outside.png'})};
              } else if (alert.type == this.globalOSM.IN_BOUNDS) {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/inside.png'})};
              } else {
                imageIcon = {icon: L.icon({iconUrl: './assets/alerts/report.png'})};
              }
              if (Number(alert.latitude) && Number(alert.longitude)) {
                const m = L.marker([alert.latitude, alert.longitude], imageIcon);
                data.push(m);
              }
            });
            this.markerClusterData = data;
          });
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
        //this.markerClusterData = data;
    }

    setCenter() {
        this.center = L.latLng(([ this.lat, this.lng ]));
    }
}
