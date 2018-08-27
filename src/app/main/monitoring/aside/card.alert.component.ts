import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Alerta} from '../../../../model/alerta/alerta';

@Component({
    selector: 'app-card-alert',
    templateUrl: './card.alert.component.html',
    styleUrls: ['./card.alert.css']
})
export class CardAlertComponent implements OnInit {

    @Output() solveAlert = new EventEmitter<Alerta>();
    @Input() alert: Alerta;
    title: string;
    date: Date;

    ngOnInit() {
        if (this.alert.cause === 'SOS1') {
            this.title = 'SOS';
        } else if (this.alert.cause === 'DROP') {
            this.title = 'CAIDA';
        } else if (this.alert.cause === 'OUT_BOUNDS') {
            this.title = 'Fuera de Los Limites';
        } else if (this.alert.cause === 'INCIDENCE') {
            this.title = 'Incidencia';
        } else {
            this.title = 'General';
        }
        const newDate = new Date(this.alert.create_date);

        this.date = newDate;
    }

    callParent(alert: any) {
        this.solveAlert.emit(alert);
    }
}
