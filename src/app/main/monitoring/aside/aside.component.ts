import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, Injectable} from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';
import {Watch} from '../../../../model/watch/watch';
import {AsideService} from './aside.service';
import {AlertaService} from '../../../../model/alerta/alerta.service';
import {Alerta} from '../../../../model/alerta/alerta';
import {AlertaList} from '../../../../model/alerta/alerta.list';
import {NotificationService} from '../../../shared/notification.service';
import {Notification} from '../../../../model/alerta/notification';

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
    CHECK_ICON_URL = './assets/aside-menu/checked.png';

    constructor(
        private asideService: AsideService,
        public alertService: AlertaService,
        private notificationService: NotificationService) {
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
        console.log('paso la prueba: ' + alert.id);
        this.alertService.solveAlert(alert.id).then(
            success => {
                console.log('is success');
                const index = this.alerts1.indexOf(alert, 0);
                if (index > -1) {
                    this.alerts1.splice(index, 1);
                }
                alert.status = 0;
                this.alerts0.unshift(alert);
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
                // this.alerts0 = [];
                // this.alerts1 = [];
                success.data.forEach(alert => {
                    if (alert.status == 1) {
                        this.alerts1.push(alert);
                    } else {
                        this.alerts0.push(alert);
                    }
                });
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
