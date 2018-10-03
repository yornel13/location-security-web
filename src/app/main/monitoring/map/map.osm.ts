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
import {PopupWatchComponent} from './popup.watch.component';
import {MainService} from '../../main.service';
import {GlobalOsm} from '../../../global.osm';
import {Alerta} from '../../../../model/alerta/alerta';
import {PopupAlertComponent} from './popup.alert.component';
import {GrupoService} from '../../../../model/grupos/grupo.service';
import {Grupos} from '../../../../model/grupos/grupos';
import {Cerco} from '../../../../model/cerco/cerco';
import {Tablet} from '../../../../model/tablet/tablet';
import {Record} from '../../../../model/historial/record';
import {PopupHistoryComponent} from '../../control/historial/vehistorial/popup.history.component';
import {PopupTablethComponent} from '../../control/historial/tabhistorial/popup.tableth.component';

@Component({
    selector : 'app-map-osm',
    templateUrl : './map.osm.html',
    styleUrls: ['./map.osm.css']
})
export class MapOsmComponent implements OnChanges, OnInit {
    @Input()
    vehicles: Vehicle[] = [];
    @Input()
    tablets: Tablet[] = [];
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
    map: L.Map;
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
    records: any[] = [];
    recordMarketData: any[] = [];
    recordsLayer = new L.FeatureGroup();

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
        this.subscribeToRecords();
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
        // this.mainService.vehicle.subscribe(
        //     vehicle => {
        //         const latlng = L.latLng({lat: vehicle.latitude , lng: vehicle.longitude});
        //         this.zoom = 18;
        //         this.center = latlng;
        // });
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

    subscribeToRecords() {
        this.records = this.mainService.records;
        this.mainService.recordsEmitter.subscribe((records: Record[]) => {
            this.records = records;
            this.setupRecords();
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

    setupRecords() {
        this.recordsLayer.clearLayers();
        const data: any[] = [];
        if (this.records.length) {
            const points = [];
            const bounds = new L.LatLngBounds(
                new L.LatLng(this.records[0].latitude, this.records[0].longitude),
                new L.LatLng(this.records[0].latitude, this.records[0].longitude));
            this.records.forEach((record: any) => {
                if (Number(record.latitude) && Number(record.longitude)) {
                    // const imageIcon = {icon: L.icon({iconUrl: record.iconUrl})};
                    let m;
                    if (record.is_exception) {
                        const textIcon = {icon: L.divIcon({
                                className: 'bus-div-icon-red',
                                html: '' + record.index,
                                iconSize: [22, 13]
                            })};
                        m = L.marker([+record.latitude, +record.longitude], textIcon);
                    } else {
                        const textIcon = {icon: L.divIcon({
                                className: 'bus-div-icon',
                                html: '' + record.index,
                                iconSize: [22, 13]
                            })};
                        m = L.marker([+record.latitude, +record.longitude], textIcon);
                    }
                    let factory;
                    if (record.is_tablet) {
                        factory = this.resolver.resolveComponentFactory(PopupTablethComponent);
                    } else {
                        factory = this.resolver.resolveComponentFactory(PopupHistoryComponent);
                    }
                    const component = factory.create(this.injector);
                    const popupContent = component.location.nativeElement;
                    component.instance.record = record;
                    component.changeDetectorRef.detectChanges();
                    m.bindPopup(popupContent).openPopup();
                    this.recordsLayer.addLayer(m);
                    points.push(L.latLng(+record.latitude, +record.longitude));
                    bounds.extend(m.getLatLng());
                    if (this.records.indexOf(record) === (this.records.length - 1)) { // setup last position with devices icon
                        const mf = L.marker([+record.latitude, +record.longitude],
                            {icon: L.icon({iconUrl: this.mainService.selectedDevice.iconUrl})});
                        this.recordsLayer.addLayer(mf);
                    }
                }
            });
            const polyline = L.polyline(points);
            this.recordsLayer.addLayer(polyline);
            this.map.addLayer(this.recordsLayer);
            this.map.fitBounds(bounds);
        }
        this.recordMarketData = data;
        if (this.showMarker.records) {
            this.markerClusterData = this.recordMarketData;
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
        removePolygon.editableLayers.remove();
    }

    deselectAll() {
        this.groupsPolygons.forEach(groupPolygon => {
            groupPolygon.editableLayers.remove();
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
        if (showMarker.devices) {
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
                if (showMarker.tablets) {
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
            this.markerClusterData = data;
            if (this.map !== undefined) {
                this.map.removeLayer(this.recordsLayer);
            }
        }
        if (showMarker.alerts) {
            this.markerClusterData = this.alertsMarketData;
            if (this.map !== undefined) {
                this.map.removeLayer(this.recordsLayer);
            }
        }
        if (showMarker.records) {
            this.markerClusterData = this.recordMarketData;
            if (this.map !== undefined) {
                this.map.addLayer(this.recordsLayer);
            }
        }
    }

    setCenter() {
        this.center = L.latLng(([ this.lat, this.lng ]));
    }
}
