import { Component } from '@angular/core';
import { TabletService } from '../../../../../model/tablet/tablet.service';
import {ToastrService} from 'ngx-toastr';

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
    editAlias: string;

    constructor(
            private tabletService: TabletService,
            private toastr: ToastrService) {
        this.getAll();
    }

    getAll() {
        this.tabletService.getAll().then(
            success => {
                this.tablets = success;
                this.data = this.tablets.data;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    this.toastr.info(error.error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                } else {
                    // on general error
                }
            }
        );
    }

    setValues(tablet) {
        this.editAlias = tablet.alias;
    }

    activarTablet(id) {
        this.tabletService.setStatus(id, 1).then(
            success => {
                this.getAll();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    this.toastr.info(error.error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                } else {
                    // on general error
                }
            }
        );
    }

    edit(id) {
        this.tabletService.setAlias(id, this.editAlias).then(
            success => {
                this.getAll();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    this.toastr.info(error.error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                } else {
                    // on general error
                }
            }
        );
    }

    desactivarTablet(id) {
        this.tabletService.setStatus(id, 0).then(
            success => {
                this.getAll();
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                    this.toastr.info(error.error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
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
                    this.toastr.info(error.error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                } else {
                    // on general error
                }
            }
        );
    }

}
