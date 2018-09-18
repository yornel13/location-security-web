import { Component } from '@angular/core';
import { TabletService } from '../../../../../model/tablet/tablet.service';

@Component({
    selector: 'app-tablets',
    templateUrl: './tablets.component.html',
    styleUrls: ['./tablets.component.css']
})

export class TabletsComponent  {
    lista = true;
    tablets: any;
    data: any[] = [];
    filter: string;

    constructor(private tabletService: TabletService) {
        this.getAll();
    }

    getAll() {
        this.tabletService.getAll().then(
            success => {
                this.tablets = success;
                this.data = this.tablets.data;
                this.data.forEach(tablet => {
                    let id_string = '' + tablet.id;
                    if (id_string.length === 1) {
                        id_string = '00' + id_string;
                    } else if (id_string.length === 2) {
                        id_string = '0' + id_string;
                    }
                    tablet.alias = 'Tablet ' + id_string;
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

    activarTablet(id){
        this.tabletService.setStatus(id, 1).then(
            success => {
                this.getAll();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    desactivarTablet(id){
        this.tabletService.setStatus(id, 0).then(
            success => {
                this.getAll();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    // on general error
                }
            }
        );
    }

    deleteTablet(id){
        this.tabletService.delete(id).then(
            success => {
                this.getAll();
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
