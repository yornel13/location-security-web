import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, Injectable} from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';
import {Watch} from '../../../../model/watch/watch';
import {AsideService} from './aside.service';
import {AlertaService} from '../../../../model/alerta/alerta.service';
import {Alerta} from '../../../../model/alerta/alerta';
import {AlertaList} from '../../../../model/alerta/alerta.list';
import {NotificationService} from '../../../shared/notification.service';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})

export class AsideComponent implements OnInit, OnChanges {

    alerts0: Alerta[] = [];
    alerts1: Alerta[] = [];
    isShow = false;
    @Input() vehicles: Vehicle[] = [];
    @Input() watches: Watch[] = [];
    @Input() markersData: any[] = [];
    @Output() showMarker = {vehicles: true , watches: true , bombas: true, noGroups: true, message: ''};
    @Output() markerChanged = new EventEmitter();
    @Output() markerFocused = new EventEmitter();
    @Output() vehiclesCheck = true;
    @Output() watchesCheck = true;
    @Output() bombasCheck = true;
    @Output() noGroupCheck = true;
    noCards = false;
    showCardContainer = true;
    search: any;
    CHECK_ICON_URL = './assets/aside-menu/checked.png';
    readonly alertCollection0: AngularFirestoreCollection<Alerta>;
    readonly alertCollection1: AngularFirestoreCollection<Alerta>;

    constructor(
        private asideService: AsideService,
        public alertService: AlertaService,
        private notificationService: NotificationService,
        private db: AngularFirestore) {
        this.alertCollection0 = db.collection<Alerta>('alerts', ref => ref.where('status', '==', 0))
        this.alertCollection0.valueChanges()
            .subscribe((alerts: Alerta[]) => {
                this.alerts0 = alerts.sort((n1, n2) => {
                    if (n1.create_date > n2.create_date) { return -1; }
                    if (n1.create_date < n2.create_date) {return 1; }
                    return 0;
                });
            });
        this.alertCollection1 = db.collection<Alerta>('alerts', ref => ref.where('status', '==', 1))
        this.alertCollection1.valueChanges()
            .subscribe((alerts: Alerta[]) => {
                this.alerts1 = alerts.sort((n1, n2) => {
                    if (n1.create_date > n2.create_date) { return -1; }
                    if (n1.create_date < n2.create_date) {return 1; }
                    return 0;
                });
            });
    }

    ngOnInit() {
        this.getAlerts();
        this.notificationService.newNotification.subscribe(
            (newAlert: Alerta) => {
                if (newAlert.status == 1) {
                    this.alerts1.unshift(newAlert);
                } else {
                    this.alerts0.unshift(newAlert);
                }
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
                this.alertCollection1.doc(String(alert.id)).update({'status': 0});
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    selectMarkersOpts(message) {
        if (message.match('showVehicles')) {
            this.vehiclesCheck = !this.vehiclesCheck;
            this.showMarker.vehicles =  this.vehiclesCheck;
            this.showMarker.message =  message;
            this.markerChanged.emit(this.showMarker);
        }
        if (message.match('showBombas')) {
            this.bombasCheck = !this.bombasCheck;
            this.showMarker.bombas = this.bombasCheck;
            this.showMarker.message =  message;
            this.markerChanged.emit(this.showMarker);
        }
        if (message.match('showTablets')) {
            this.watchesCheck = !this.watchesCheck;
            this.showMarker.watches = this.watchesCheck;
            this.showMarker.message =  message;
            this.markerChanged.emit(this.showMarker);
        }
        if (!this.vehiclesCheck && !this.bombasCheck && !this.watchesCheck) {
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

    getAlerts() {
        this.alertService.getAll().then(
            (success: AlertaList) => {
                // if do something
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }
}
