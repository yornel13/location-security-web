import {Component, OnInit} from '@angular/core';
import {MessagingService} from '../shared/messaging.service';
import {AngularFirestore, AngularFirestoreCollection} from 'angularfire2/firestore';
import {Alerta} from '../../model/alerta/alerta';
import swal from 'sweetalert2';
import {GlobalOsm} from '../global.osm';
import {Router} from '@angular/router';
import {AlertaService} from '../../model/alerta/alerta.service';
import {MainService} from './main.service';
import {AuthenticationService} from '../_services';


@Component({
    selector: 'app-main',
    template: `
      <div class="app-container">
          <app-header class="app-header"></app-header>
          <router-outlet></router-outlet>
      </div>
  `
})
export class MainComponent implements OnInit {

    message;
    alerts: Alerta[] = [];
    alerts0: Alerta[] = [];
    alerts1: Alerta[] = [];
    readonly alertCollection: AngularFirestoreCollection<Alerta>;

    isVisible: boolean;

    constructor(
        private messagingService: MessagingService,
        private mapService: GlobalOsm,
        public alertService: AlertaService,
        private router: Router,
        private mainService: MainService,
        private db: AngularFirestore,
        private authService: AuthenticationService) {
        this.alertCollection = db.collection<Alerta>('alerts',
            ref => ref.orderBy('status', 'desc').orderBy('id', 'desc').limit(10));
        this.isVisible = true;
    }

    ngOnInit() {
        if (this.authService.getUser() != null) {
            const userId = 'user001';
            this.messagingService.requestPermission(userId);
            this.messagingService.receiveMessage();
            this.messagingService.loadUnreadMessages();
            this.messagingService.loadUnreadReplies();
            this.message = this.messagingService.currentMessage;
            this.getAlerts();
            document.addEventListener('visibilitychange',
                this.setupVisibility.bind(this));
        }
    }

    setupVisibility() {
        const state = document.visibilityState;
        if (!this.isVisible && state) {
            this.messagingService.loadUnreadMessages();
            this.messagingService.loadUnreadReplies();
        }
        this.isVisible = state === 'visible';
    }

    getAlerts() {
        this.alertCollection.stateChanges().subscribe(data => {
            console.log('updating alerts...');
            if (data.length <= 2) {
                let type;
                let alert;
                if (data.length === 2) {
                    type = data[1].type;
                    alert = data[1].payload.doc.data() as Alerta;
                } else {
                    type = data[0].type;
                    alert = data[0].payload.doc.data() as Alerta;
                }
                if (type === 'added') {
                    let title = alert.type;
                    if (alert.status === 1) {
                        if (alert.cause === this.mapService.INCIDENCE) {
                            title = 'Incidencia';
                        } else if (alert.cause === this.mapService.DROP) {
                            title = 'Caida';
                        } else if (alert.cause === this.mapService.SOS1) {
                            title = 'SOS';
                        }
                        swal({
                            title: title,
                            text: alert.message,
                            type: 'warning',
                            confirmButtonText: 'Ir a'
                        }).then(result => {
                            if (result.value) {
                                this.showAlert(alert);
                            }
                        });
                        {
                            const audio = new Audio();
                            audio.src = './assets/sounds/import.wav';
                            audio.load();
                            audio.play().then();
                        }
                    }
                }
            }
            data.forEach(single => {
                const alert = single.payload.doc.data() as Alerta;
                if (single.type === 'added') {
                    if (alert.status === 0) {
                        this.alerts0.push(alert);
                    } else {
                        this.alerts1.push(alert);
                    }
                    this.alerts.push(alert);
                }
                if (single.type === 'modified') {
                    let alertMod = null;
                    this.alerts1.forEach(alert1 => {
                        if (alert1.id === alert.id) {
                            alertMod = alert1;
                        }
                    });
                    if (alertMod != null) {
                        this.alerts1.splice(this.alerts1.indexOf(alertMod, 0), 1);
                        this.alerts0.push(alert);

                        this.alerts.splice(this.alerts.indexOf(alertMod, 0), 1);
                        this.alerts.push(alert);
                    }
                }
            });
            this.alerts1 = this.alerts1.sort((n1, n2) => {
                if (n1.create_date > n2.create_date) { return -1; }
                if (n1.create_date < n2.create_date) {return 1; }
                return 0;
            });
            this.alerts0 = this.alerts0.sort((n1, n2) => {
                if (n1.create_date > n2.create_date) { return -1; }
                if (n1.create_date < n2.create_date) {return 1; }
                return 0;
            });
            /* Emitting new changes */
            this.mainService.alertsEmitter.emit(this.alerts);
            this.mainService.alerts0Emitter.emit(this.alerts0);
            this.mainService.alerts1Emitter.emit(this.alerts1);

            /* Saving new changes in service */
            this.mainService.alerts = this.alerts;
            this.mainService.alerts0 = this.alerts0;
            this.mainService.alerts1 = this.alerts1;
        });
    }

    solveAlert(alert: Alerta) {
        this.alertCollection.doc(String(alert.id)).update({'status': 0}).then();
        // this.alertService.solveAlert(alert.id).then(
        // success => {
        //     this.alertCollection.doc(String(alert.id)).update({'status': 0}).then();
        //     if (alert.cause === this.mapService.INCIDENCE) {
        //         const report = JSON.parse(alert.extra);
        //         this.router.navigate(['/u/control/bitacora/reportfilter/' + report.id]).then();
        //     } else if (alert.cause === this.mapService.DROP) {
        //         this.router.navigate(['/u/control/alertas/' + alert.id]).then();
        //     } else if (alert.cause === this.mapService.SOS1) {
        //         this.router.navigate(['/u/control/alertas/' + alert.id]).then();
        //     }
        // }, error => {
        //   if (error.status === 422) {
        //     // on some data incorrect
        //   } else {
        //     // on general error
        //   }
        // }
        // );
    }

    showAlert(alert: Alerta) {
        if (alert.cause === this.mapService.INCIDENCE) {
            const report = JSON.parse(alert.extra);
            this.router.navigate(['/u/control/bitacora/reportfilter/' + report.id]).then();
        } else if (alert.cause === this.mapService.DROP) {
            this.router.navigate(['/u/control/alertas/' + alert.id]).then();
        } else if (alert.cause === this.mapService.SOS1) {
            this.router.navigate(['/u/control/alertas/' + alert.id]).then();
        }
    }
}
