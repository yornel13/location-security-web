import {Component, Input, OnChanges, OnInit, Output, SimpleChanges, EventEmitter, Injectable} from '@angular/core';
import {Vehicle} from '../../../../model/vehicle/vehicle';
import {Watch} from '../../../../model/watch/watch';
import {MainService} from '../../main.service';
import {AlertaService} from '../../../../model/alerta/alerta.service';
import {Alerta} from '../../../../model/alerta/alerta';
import {NotificationService} from '../../../shared/notification.service';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Router} from '@angular/router';
import {GlobalOsm} from '../../../global.osm';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})

export class AsideComponent implements OnInit, OnChanges {

  alerts0: Alerta[] = [];
  alerts1: Alerta[] = [];

  @Input() vehicles: Vehicle[] = [];
  @Input() watches: Watch[] = [];
  @Input() markersData: any[] = [];
  @Output() showMarker = {alerts: true, vehicles: true , watches: true , bombas: true, noGroups: true, message: ''};
  @Output() markerChanged = new EventEmitter();
  @Output() markerFocused = new EventEmitter();
  @Output() vehiclesCheck = true;
  @Output() watchesCheck = true;
  @Output() bombasCheck = true;
  @Output() noGroupCheck = true;
  @Output() isShow = false;
  noCards = false;
  showCardContainer = true;
  search: any;
  CHECK_ICON_URL = './assets/aside-menu/checked.png';
  alertCollection: AngularFirestoreCollection<Alerta>;

  constructor(
    private mainService: MainService,
    public alertService: AlertaService,
    private router: Router,
    private notificationService: NotificationService,
    private db: AngularFirestore,
    private mapService: GlobalOsm) {
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
          this.router.navigate(['/u/control/bitacora/reportfilter/' + report.id]);
        } else if (alert.cause === this.mapService.DROP) {
          this.router.navigate(['/u/control/alertas/' + alert.id]);
        } else if (alert.cause === this.mapService.SOS1) {
          this.router.navigate(['/u/control/alertas/' + alert.id]);
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
      this.watchesCheck = !this.watchesCheck;
      this.showMarker.watches = this.watchesCheck;
      this.showMarker.message = message;
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
}
