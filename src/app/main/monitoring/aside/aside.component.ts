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
    @Output() showMarker = {alerts: true, vehicles: true , tablets: true , bombas: true, noGroups: true, message: ''};
    @Output() markerChanged = new EventEmitter();
    @Output() markerFocused = new EventEmitter();
    @Output() vehiclesCheck = true;
    @Output() tabletsCheck = true;
    @Output() bombasCheck = true;
    @Output() noGroupCheck = true;
    @Output() isShow = false;
    noCards = false;
    showCardContainer = true;
    search: any;
    CHECK_ICON_URL = './assets/aside-menu/checked.png';
    alertCollection: AngularFirestoreCollection<Alerta>;
    selectedItem: Vehicle;

    constructor(
            private mainService: MainService,
            public alertService: AlertaService,
            private router: Router,
            private notificationService: NotificationService,
            private db: AngularFirestore,
            private mapService: GlobalOsm,
            private vehistorialService: VehistorialService,
            private utilVehicle: UtilsVehicles) {
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
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicles']) {
          // Use if necessary
        }
        if (changes['watches']) {
          // Use if necessary
        }
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
            this.showMarker.message = tab;
            this.markerChanged.emit(this.showMarker);
        }
        if (tab.match('histories')) {
            this.isShow = false;
            //
            //
            //
        }
        if (tab.match('devices')) {
            this.isShow = true;
            this.showMarker.alerts = false;
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
        if (this.selectedItem !== undefined && this.selectedItem !== null) {
            this.utilVehicle.processVehicle(this.selectedItem);
            this.vehistorialService.getHistoryImei(this.selectedItem.imei).then((histories: Record[]) => {
                const arrToShow = [];
                let date = new Date();
                date = new Date(date.getTime() - 3600000); // para igualar con la hora de ecuador
                const dateLong = date.getTime();
                let count = 1;
                histories.forEach((history: Record) => {
                    history.iconUrl = this.selectedItem.iconUrl;
                    const dateC = new Date(history.date + ' ' + history.time);
                    const dateCLong = dateC.getTime();
                    const  rest = dateLong - dateCLong;
                    if (!(rest > 1800 * 1000)) {
                        // const icon = this.utilVehicle.getHistoryIcon(history);
                        // if (icon !== null) { history.iconUrl = icon; }
                        // history.index = count++;
                        // arrToShow.push(history);
                    }
                    const icon = this.utilVehicle.getHistoryIcon(history); // remove
                    if (icon !== null) { history.iconUrl = icon; } // remove
                    history.index = count++; // remove
                    arrToShow.push(history); // remove
                });
                this.records = arrToShow;
            });
        }
    }
}
