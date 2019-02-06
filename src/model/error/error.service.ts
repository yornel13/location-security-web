import {ToastrService} from 'ngx-toastr';
import {Injectable} from '@angular/core';

@Injectable()
export class ErrorService {

    constructor (
        private toastr: ToastrService) {}

    process(error: any) {

        if (error == undefined) {
            return;
        }

        if (error.status === 422) {
            if (error.error.errors) {
                for (const key in error.error.errors) {
                    let title = key;
                    if (title === 'name') { title = 'Nombre'; }
                    if (title === 'address') { title = 'Dirección'; }
                    if (title === 'ruc') { title = 'Numeración'; }
                    this.toastr.info(error.error.errors[key][0], title,
                        { positionClass: 'toast-bottom-center'});
                }
            } else {
                this.toastr.info(error.error.message, 'Error',
                    { positionClass: 'toast-bottom-center'});
            }
        } else if (error.status === 404 || error.status === 0) {
            this.toastr.info('Compruebe su conexión a internet.', 'Error de conexión',
                { positionClass: 'toast-bottom-center'});
        } else {
            this.toastr.info(error.message, 'Error',
                { positionClass: 'toast-bottom-center'});
        }
    }
}
