import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter} from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';
import {MainService} from '../../main.service';
import {AlertaService} from '../../../../model/alerta/alerta.service';
import {Alerta} from '../../../../model/alerta/alerta';
import {NotificationService} from '../../../shared/notification.service';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {GlobalOsm} from '../../../global.osm';
import {VehistorialService} from '../../../../model/historial/vehistorial.service';
import {Record} from '../../../../model/historial/record';
import {UtilsVehicles} from '../../../../model/vehicle/vehicle.utils';
import {Tablet} from '../../../../model/tablet/tablet';
import {TabhistoryService} from '../../../../model/historial/tabhistory.service';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})

export class AsideComponent implements OnInit, OnChanges {

    alerts0: Alerta[] = [];
    alerts1: Alerta[] = [];
    records: any[] = [];

    @Input() vehicles: Vehicle[] = [];
    @Input() tablets: Tablet[] = [];
    @Input() markersData: any[] = [];
    @Output() showMarker = {
        alerts: true,
        devices: true,
        records: true,
        vehicles: true,
        tablets: true,
        bombas: true,
        noGroups: true,
        message: ''
    };
    @Output() markerChanged = new EventEmitter();
    @Output() markerFocused = new EventEmitter();
    @Output() vehiclesCheck = true;
    @Output() tabletsCheck = true;
    @Output() bombasCheck = true;
    @Output() noGroupCheck = true;
    @Output() isShow = false;
    vehicleWasSetup = false;
    tabletWasSetup = false;
    noCards = false;
    showCardContainer = true;
    search: any;
    CHECK_ICON_URL = './assets/aside-menu/checked.png';
    alertCollection: AngularFirestoreCollection<Alerta>;
    selectedItem: any;
    devices: any[] = [];
    date: string;
    showDates = false;
    minutes = 30;
    mints1 = '00';
    hours1 = '00';
    mints2 = '59';
    hours2 = '23';

    constructor(
            private mainService: MainService,
            public alertService: AlertaService,
            private router: Router,
            private notificationService: NotificationService,
            private db: AngularFirestore,
            private mapService: GlobalOsm,
            private vehistorialService: VehistorialService,
            private utilVehicle: UtilsVehicles,
            private tabhistoryService: TabhistoryService) {
        this.alertCollection = db.collection<Alerta>('alerts');
    }

    ngOnInit() {
        /* Getting alerts allow in service */
        this.alerts0 = this.mainService.alerts0;
        this.alerts1 = this.mainService.alerts1;
        /* subscribing to changes on alerts */
        this.mainService.alerts0Emitter.subscribe((data: Alerta[]) => {
          this.alerts0 = data;
        });
        this.mainService.alerts1Emitter.subscribe((data: Alerta[]) => {
          this.alerts1 = data;
        });

        {
            const d = new Date();
            let day = d.getDate().toString();
            let month = (d.getMonth() + 1).toString();
            const year = d.getFullYear().toString();

            if (+day < 10) {
                day = '0' + day;
            }
            if (+month < 10) {
                month = '0' + month;
            }
            this.date = year + '-' + month + '-' + day;
        }
        if (this.tablets.length > 0) {
            this.tabletWasSetup = true;
        }
        if (this.tablets.length > 0) {
            this.vehicleWasSetup = true;
        }
        this.setupDevices();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicles']) {
            if (!this.vehicleWasSetup) {
                this.setupDevices();
            }
            if (this.vehicles.length > 0) {
                this.vehicleWasSetup = true;
            }
        }
        if (changes['tablets']) {
            if (!this.tabletWasSetup) {
                this.setupDevices();
            }
            if (this.tablets.length > 0) {
                this.tabletWasSetup = true;
            }
        }
    }

    setupDevices() { // devices for filter record/history
        const data = [];
        this.vehicles.forEach(vehicle => {
            data.push(vehicle);
        });
        this.tablets.forEach(table => {
            data.push(table);
        });
        data.sort((n1, n2) => {
            if (n1.alias < n2.alias) { return -1; }
            if (n1.alias > n2.alias) {return 1; }
            return 0;
        });
        this.devices = data;
    }

    solveAlert(alert: Alerta) {
        this.alertService.solveAlert(alert.id).then(
            success => {
                this.alertCollection.doc(String(alert.id)).update({'status': 0});
                if (alert.cause === this.mapService.INCIDENCE) {
                    const report = JSON.parse(alert.extra);
                    this.router.navigate(['/u/control/bitacora/reportfilter/' + report.id]).then();
                } else if (alert.cause === this.mapService.DROP) {
                    this.router.navigate(['/u/control/alertas/' + alert.id]).then();
                } else if (alert.cause === this.mapService.SOS1) {
                    this.router.navigate(['/u/control/alertas/' + alert.id]).then();
                }
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    selectTab(tab) {
        if (tab.match('alerts')) {
            this.isShow = false;
            this.showMarker.alerts = true;
            this.showMarker.records = false;
            this.showMarker.devices = false;
            this.showMarker.message = tab;
            this.markerChanged.emit(this.showMarker);
        }
        if (tab.match('records')) {
            this.isShow = false;
            this.showMarker.alerts = false;
            this.showMarker.records = true;
            this.showMarker.devices = false;
            this.showMarker.message = tab;
            this.markerChanged.emit(this.showMarker);
        }
        if (tab.match('devices')) {
            this.isShow = true;
            this.showMarker.alerts = false;
            this.showMarker.records = false;
            this.showMarker.devices = true;
            this.showMarker.message = tab;
            this.markerChanged.emit(this.showMarker);
        }
    }

    selectMarkersOpts(message) {
        if (message.match('showVehicles')) {
          this.vehiclesCheck = !this.vehiclesCheck;
          this.showMarker.vehicles = this.vehiclesCheck;
          this.showMarker.message = message;
          this.markerChanged.emit(this.showMarker);
        }
        if (message.match('showBombas')) {
          this.bombasCheck = !this.bombasCheck;
          this.showMarker.bombas = this.bombasCheck;
          this.showMarker.message = message;
          this.markerChanged.emit(this.showMarker);
        }
        if (message.match('showTablets')) {
          this.tabletsCheck = !this.tabletsCheck;
          this.showMarker.tablets = this.tabletsCheck;
          this.showMarker.message = message;
          this.markerChanged.emit(this.showMarker);
        }
        if (!this.vehiclesCheck && !this.bombasCheck && !this.tabletsCheck) {
          this.noCards = true;
          this.showCardContainer = false;
        } else {
          this.noCards = false;
          this.showCardContainer = true;
        }
    }

    find(newSearch) {
        console.log(newSearch.value);
        this.vehicles.forEach( vehicle => {
            if (vehicle.imei.match(newSearch.value)) {
                console.log('imei es', vehicle.imei );
            } else {
                console.log('no match');
            }
        });
    }

    searchHistory() {
        this.records = [];
        this.mainService.recordsEmitter.emit(this.records);
        this.mainService.selectedDevice = this.selectedItem;
        if (this.selectedItem !== undefined && this.selectedItem !== null) {
            if (this.minutes === 0) {
                const valuesDate = this.date.split('-');
                const year1 = valuesDate[0];
                const month1 = valuesDate[1];
                const day1 = valuesDate[2];
                if (this.selectedItem.group_name !== 'Tablet Guardia') {
                    this.vehistorialService.getHistoryImeiDate(this.selectedItem.imei, year1, month1, day1)
                        .then((histories: Record[]) => {
                            this.setupRecordVehicle(histories);
                        });
                } else {
                    this.tabhistoryService.getHistoryImeiDate(this.selectedItem.imei, year1, month1, day1, year1, month1, day1)
                        .then((value: any) => {
                            const histories: [] = value.data.reverse();
                            this.setupRecordTablet(histories);
                        });
                }
            } else {
                if (this.selectedItem.group_name !== 'Tablet Guardia') {
                    this.vehistorialService.getHistoryImei(this.selectedItem.imei)
                        .then((histories: Record[]) => {
                            this.setupRecordVehicle(histories);
                        });
                } else {
                    this.tabhistoryService.getHistoryImei(this.selectedItem.imei)
                        .then((value: any) => {
                            const histories: [] = value.data.reverse();
                            this.setupRecordTablet(histories);
                        });
                }
            }
        }
    }

    setupRecordVehicle(histories: Record[]) {
        const millisSeconds = this.minutes * 60 * 1000;
        const arrToShow = [];
        let date = new Date();
        date = new Date(date.getTime() - 3600000); // para igualar con la hora de ecuador, quitar linea
        const dateLong = date.getTime();
        let count = 1;
        const date1 = new Date(this.date + ' ' + this.hours1 + ':' + this.mints1 + ':00');
        const date2 = new Date(this.date + ' ' + this.hours2 + ':' + this.mints2 + ':59');
        histories.forEach((history: Record) => {
            history.iconUrl = this.selectedItem.iconUrl;
            const dateC = new Date(history.date + ' ' + history.time);
            if (millisSeconds > 0) {
                const dateCLong = dateC.getTime();
                const  rest = dateLong - dateCLong;
                if (!(rest > millisSeconds)) {
                    const icon = this.utilVehicle.getHistoryIcon(history);
                    if (icon !== null) { history.iconUrl = icon; }
                    history.index = count++;
                    arrToShow.push(history);
                }
            } else {
                if (date1 < dateC && dateC < date2) {
                    const icon = this.utilVehicle.getHistoryIcon(history);
                    if (icon !== null) { history.iconUrl = icon; }
                    history.index = count++;
                    arrToShow.push(history);
                }
            }
        });
        this.records = arrToShow;
        this.mainService.recordsEmitter.emit(this.records);
    }

    setupRecordTablet(histories: any[]) {
        const millisSeconds = this.minutes * 60 * 1000;
        const arrToShow = [];
        let date = new Date();
        date = new Date(date.getTime() - 3600000); // para igualar con la hora de ecuador, quitar linea
        const dateLong = date.getTime();
        let count = 1;
        const date1 = new Date(this.date + ' ' + this.hours1 + ':' + this.mints1 + ':00');
        const date2 = new Date(this.date + ' ' + this.hours2 + ':' + this.mints2 + ':59');
        histories.forEach((history: any) => {
            history.iconUrl = this.selectedItem.iconUrl;
            const dateC = new Date(history.generated_time);
            if (millisSeconds > 0) {
                const dateCLong = dateC.getTime();
                const  rest = dateLong - dateCLong;
                if (!(rest > millisSeconds)) {
                    const icon = this.utilVehicle.getHistoryIconTablet(history);
                    if (icon !== null) { history.iconUrl = icon; }
                    history.index = count++;
                    history.is_tablet = true;
                    history.is_exception = history.is_exception === '1';
                    arrToShow.push(history);
                }
            } else {
                if (date1 < dateC && dateC < date2) {
                    const icon = this.utilVehicle.getHistoryIconTablet(history);
                    if (icon !== null) { history.iconUrl = icon; }
                    history.index = count++;
                    history.is_tablet = true;
                    history.is_exception = history.is_exception === '1';
                    arrToShow.push(history);
                }
            }
        });
        this.records = arrToShow;
        this.mainService.recordsEmitter.emit(this.records);
    }

    selectDevice() {
        // todo
    }
}
