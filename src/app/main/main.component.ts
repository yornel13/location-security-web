import {Component, OnInit} from '@angular/core';
import {Alerta} from '../../model/alerta/alerta';
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
    audio = new Audio();

    isVisible: boolean;

    constructor(
        private mapService: GlobalOsm,
        public alertService: AlertaService,
        private router: Router,
        private mainService: MainService,
        private authService: AuthenticationService) {
        this.isVisible = true;
    }

    ngOnInit() {
        if (this.authService.getUser() != null) {
            const userId = 'user001';
            // this.messagingService.requestPermission(userId);
            // this.messagingService.receiveMessage();
            // this.messagingService.loadUnreadMessages();
            // this.messagingService.loadUnreadReplies();
            // this.message = this.messagingService.currentMessage;
            this.getAlerts();
            document.addEventListener('visibilitychange',
                this.setupVisibility.bind(this));
        }
    }

    setupVisibility() {
        const state = document.visibilityState;
        if (!this.isVisible && state) {
            // this.messagingService.loadUnreadMessages();
            // this.messagingService.loadUnreadReplies();
        }
        this.isVisible = state === 'visible';
    }

    getAlerts() {

    }

    solveAlert(alert: Alerta) {
            // this.alertCollection.doc(String(alert.id)).update({'status': 0}).then();
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
