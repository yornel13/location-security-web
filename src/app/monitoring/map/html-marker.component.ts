import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-html-marker',
    templateUrl: './map.marker.html'
})
export class HTMLMarkerComponent {
    @Input() vehicle;
    @Input() watch;

    device_status = 'DESCONECTADO';
}
