import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-html-marker',
    templateUrl: './map.marker.html'
})
export class HTMLMarkerComponent {
    @Input() vehicle;

    device_status = 'DESCONECTADO';
}
