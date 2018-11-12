import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MainService} from '../../main.service';

@Component({
    selector: 'app-card-record',
    templateUrl: './card.record.component.html',
    styleUrls: ['./card.record.css']
})
export class CardRecordComponent implements OnInit {

    @Output() latlng = {lat: null , lng: null};
    @Input() record: any;
    title: string;
    date: Date;

    constructor(private mainService: MainService) {}

    ngOnInit() {
        if (this.record.is_tablet) {
            this.date = new Date(this.record.generated_time);
        } else {
            this.date = new Date(this.record.date + ' ' + this.record.time);
        }
    }

    focusMarker(lat, lng) {
      console.log('lat: ', lat, 'lng: ', lng);
      this.latlng.lat = lat;
      this.latlng.lng = lng;
      this.mainService.marker.emit(this.latlng);
  }
}
