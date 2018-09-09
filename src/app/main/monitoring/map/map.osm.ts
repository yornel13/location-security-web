import {
  Component,
  ComponentFactoryResolver,
  Injector,
  Input,
  OnChanges, OnInit,
  SimpleChanges
} from '@angular/core';
import { Vehicle } from '../../../../model/vehicle/vehicle';
import { PopupVehicleComponent } from './popup.vehicle.component';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import {Watch} from '../../../../model/watch/watch';
import {PopupWatchComponent} from './popup.watch.component';
import {MainService} from '../../main.service';
import {GlobalOsm} from '../../../global.osm';
import {Alerta} from '../../../../model/alerta/alerta';
import {AngularFirestore} from 'angularfire2/firestore';
import {PopupAlertComponent} from './popup.alert.component';
import {GrupoService} from '../../../../model/grupos/grupo.service';
import {Grupos} from '../../../../model/grupos/grupos';
import {Cerco} from '../../../../model/cerco/cerco';

@Component({
    selector : 'app-map-osm',
    templateUrl : './map.osm.html',
    styleUrls: ['./map.osm.css']
})
export class MapOsmComponent implements OnChanges, OnInit {
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
    @Input()
    showMarker;
    markerClusterGroup: L.MarkerClusterGroup;
    markerClusterData: any[] = [];
    markerClusterOptions: L.MarkerClusterGroupOptions;
    center = L.latLng(([ this.lat, this.lng ]));
    map: any;
    // Values to bind to Leaflet Directive
    layersControlOptions;
    baseLayers;
    options;
    /* Bounds */
    groupsBounds: Grupos[] = [];
    bounds: Cerco[] = [];
    groupsPolygons: any = [];
    /* drop down bounds */
    dropdownList = [];
    selectedItems = [];
    dropdownSettings = {};
    /* Alerts */
    alerts: Alerta[] = [];
    alertsMarketData: any[] = [];

    constructor(private resolver: ComponentFactoryResolver,
                private mainService: MainService,
                private injector: Injector,
                private globalOSM: GlobalOsm,
                private groupService: GrupoService) {
        this.baseLayers = this.globalOSM.baseLayers;
        this.layersControlOptions = this.globalOSM.layersOptions;
        this.options = {
            zoom: this.zoom,
            center: this.center
        };
    }

    onMapReady(map: L.Map) {
        this.map = map;
        this.globalOSM.setupLayer(this.map);
    }

    ngOnInit() {
      this.subscribeToAlerts();
      this.subscribeToClick();
      this.getGroups();
      this.setupDropdown();
    }

    subscribeToClick() {
      this.mainService.marker.subscribe(
        (data: any) => {
          this.zoom = 18;
          this.center = data;
        });
    }

    setupDropdown() {
      this.dropdownList = [];
      this.selectedItems = [];
      this.dropdownSettings = {
        singleSelection: false,
        idField: 'item_id',
        textField: 'item_text',
        selectAllText: 'Seleccionar todo',
        unSelectAllText: 'Deseleccionar todo',
        searchPlaceholderText: 'Buscar...',
        itemsShowLimit: 5,
        allowSearchFilter: true
      };
    }

    onItemSelect(item: any) {
      this.selectBounds(item.item_id);
    }

    onItemDeSelect(item: any) {
      this.deselectBounds(item.item_id);
    }

    onSelectAll(items: any) {
      this.selectAll();
    }

    onDeSelectAll(items: any) {
      this.deselectAll();
    }

    subscribeToAlerts() {
      this.alerts = this.mainService.alerts;
      this.setupAlerts();
      this.mainService.alertsEmitter.subscribe((alerts: Alerta[]) => {
        this.alerts = alerts;
        this.setupAlerts();
      });
    }

    setupAlerts() {
      const data: any[] = [];
      this.alerts.forEach((alert: Alerta) => {
        let imageIcon;
        if (alert.type === this.globalOSM.DROP) {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/falldown.png'})};
        } else if (alert.type === this.globalOSM.SOS1) {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/sos.png'})};
        } else if (alert.type === this.globalOSM.IGNITION_ON) {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/on.png'})};
        } else if (alert.type === this.globalOSM.IGNITION_OFF) {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/off.png'})};
        } else if (alert.type === this.globalOSM.SPEED_MAX) {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/speed.png'})};
        } else if (alert.type === this.globalOSM.INIT_WATCH) {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/watch_start.png'})};
        } else if (alert.type === this.globalOSM.FINISH_WATCH) {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/watch_end.png'})};
        } else if (alert.type === this.globalOSM.OUT_BOUNDS) {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/outside.png'})};
        } else if (alert.type === this.globalOSM.IN_BOUNDS) {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/inside.png'})};
        } else {
          imageIcon = {icon: L.icon({iconUrl: './assets/alerts/report.png'})};
        }
        if (Number(alert.latitude) && Number(alert.longitude)) {
          const m = L.marker([+alert.latitude, +alert.longitude], imageIcon);
          const factory = this.resolver.resolveComponentFactory(PopupAlertComponent);
          const component = factory.create(this.injector);
          const popupContent = component.location.nativeElement;
          component.instance.alert = alert;
          component.changeDetectorRef.detectChanges();
          m.bindPopup(popupContent).openPopup();
          data.push(m);
        }
      });
      this.alertsMarketData = data;
      if (this.showMarker.alerts) {
        this.markerClusterData = this.alertsMarketData;
      }
    }

    getGroups() {
      this.groupService.getAll().then(
          (success: any) => {
        this.groupsBounds = success.data;
        const data = [];
        this.groupsBounds.forEach(group => {
          data.push({ item_id: group.id, item_text: group.name });
        });
        this.dropdownList = data;
      });
    }

    selectBounds(id: number) {
      if (id > 0) {
        this.groupService.getCercoGrupo(id).then(
          (success: any) => {
            const polygons = [];
            const editableLayers = new L.FeatureGroup();
            this.bounds = success.data;
              this.bounds.forEach(cerco => {
                const coors = JSON.parse(cerco.points);
                this.map.addLayer(editableLayers);
                const polygon = L.polygon([[]]).setLatLngs(coors);
                polygon.options.color = cerco.color;
                editableLayers.addLayer(polygon);
                polygons.push(polygon);
            });
            this.groupsPolygons.push({ id: id, editableLayers: editableLayers});
          });
      }
    }

    selectAll() {
      this.groupsBounds.forEach(group => {
        this.selectBounds(group.id);
      });
    }

    deselectBounds(id: number) {
      let removePolygon: any = {};
      this.groupsPolygons.forEach(groupPolygon => {
        if (groupPolygon.id === id) {
          removePolygon = groupPolygon;
        }
      });
      removePolygon.editableLayers.remove(this.map);
    }

    deselectAll() {
      this.groupsPolygons.forEach(groupPolygon => {
          groupPolygon.editableLayers.remove(this.map);
      });
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
                    component.instance.vehicle = mData;
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
                component.instance.vehicle = mData;
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
                    component.instance.tablet = mData;
                    component.changeDetectorRef.detectChanges();
                    m.bindPopup(popupContent).openPopup();
                    data.push(m);
                }
            }
        });
        if (!this.showMarker.alerts) {
          this.markerClusterData = data;
        } else {
          this.markerClusterData = this.alertsMarketData;
        }
    }

    setCenter() {
        this.center = L.latLng(([ this.lat, this.lng ]));
    }
}
