import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MainService} from '../../main.service';
import {Record} from '../../../../model/historial/record';

@Component({
    selector: 'app-card-record',
    templateUrl: './card.record.component.html',
    styleUrls: ['./card.record.css']
})
export class CardRecordComponent implements OnInit {

    @Output() latlng = {lat: null , lng: null};
    @Input() record: Record;
    title: string;
    date: Date;

    constructor(private mainService: MainService) {}

    ngOnInit() {
        const newDate = new Date(this.record.date + ' ' + this.record.time);
        this.date = newDate;
    }

    focusMarker(lat, lng) {
      console.log('lat: ', lat, 'lng: ', lng);
      this.latlng.lat = lat;
      this.latlng.lng = lng;
      this.mainService.marker.emit(this.latlng);
  }
}
