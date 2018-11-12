import {Component, OnInit} from '@angular/core';
import {Alerta} from '../../../../model/alerta/alerta';
import {GlobalOsm} from '../../../global.osm';

@Component({
    selector: 'app-popup-alert',
    templateUrl: './popup.alert.component.html',
    styleUrls: ['./popup.alert.css']
})
export class PopupAlertComponent implements OnInit {

    alert: Alerta;
    title: string;
    date: Date;
    report: any = null;
    reportIcon = './assets/alerts/report.png';

    constructor(private mapService: GlobalOsm) {}

    ngOnInit() {
        if (this.alert.type === this.mapService.SOS1) {
            this.title = 'SOS';
        } else if (this.alert.type === this.mapService.DROP) {
            this.title = 'CAIDA';
        } else if (this.alert.type === this.mapService.OUT_BOUNDS) {
          this.title = 'Fuera de Los Limites';
        } else if (this.alert.type === this.mapService.IN_BOUNDS) {
          this.title = 'Ingreso a Area determinada';
        } else if (this.alert.type === this.mapService.IGNITION_OFF) {
          this.title = 'General';
        } else if (this.alert.type === this.mapService.IGNITION_ON) {
          this.title = 'General';
        } else if (this.alert.type === this.mapService.SPEED_MAX) {
          this.title = 'Velocidad';
        } else if (this.alert.type === this.mapService.INIT_WATCH) {
          this.title = 'Inicio de Guardia';
        } else if (this.alert.type === this.mapService.FINISH_WATCH) {
          this.title = 'Finalizacion de guardia';
        } else {
            this.title = 'Incidencia';
        }
        if (this.alert.cause === 'INCIDENCE') {
            this.report = JSON.parse(this.alert.extra);
        } else {
        }
        this.date = new Date(this.alert.create_date);
    }
}
