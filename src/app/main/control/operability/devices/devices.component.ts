import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'jspdf-autotable';
import {ToastrService} from 'ngx-toastr';
import {OperabilityService} from '../../../../../model/operability/operability.service';
import {PuestoService} from '../../../../../model/puestos/puestos.service';
import {Puesto} from '../../../../../model/puestos/puesto';

@Component({
    selector: 'app-devices',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css']
})
export class DevicesComponent {
    // General
    stands: any[] = [];
    devices: any[] = [];
    isLoading = false;

    filter: string;
    numElement = 10;

    key = 'name'; // set default
    reverse = false;

    editDevice: any;
    editDeviceName: any;
    editDeviceDescription: any;
    p;

    newName: '';
    newAddress: '';

    constructor(public router: Router,
                private operabilityService: OperabilityService,
                private standService: PuestoService,
                private toastr: ToastrService) {
        this.getAll();
    }

    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    getAll() {
        this.isLoading = true;
        this.devices = [];
        this.standService.getAll().then(
            (success: any) => {
                this.stands = success.data;
                this.getOperability();
            }, error => {
                this.isLoading = false;
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                }
            }
        );
    }

    getOperability() {
        this.operabilityService.getAll().then(
            (success: any) => {
                this.devices = [];
                this.stands.forEach(stand => {
                    stand.state = 'No especificado';
                    stand.imei = stand.id;
                    this.devices.push(stand);
                });
                this.devices.forEach(device => {
                    success.data.forEach(operability => {
                        if (device.imei == operability.imei) {
                            device.series = operability.series;
                            device.description = operability.description;
                            device.operative = operability.operative;
                            device.state = operability.operative ? 'Operativo' : 'Inactivo';
                            device.exists = true;
                        }
                    });
                });
                this.isLoading = false;
            }, error => {
                this.isLoading = false;
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                }
            }
        );
    }

    start(device) {
        this.operabilityService.start(device.imei, device.nextStop).then(
            (success: any) => {
                device.operative = success.result.operative;
                device.state = device.operative ? 'Operativo' : 'Inactivo';
                device.exists = true;

                let time = '6:00 AM';
                const date = new Date();
                const hours = date.getHours();
                const minutes = date.getMinutes();
                console.log('hours: ' + hours);
                console.log('minutes: ' + minutes);

                if ((hours === 17 && minutes < 55) ||
                    (hours === 5 && minutes > 55) ||
                    (hours > 5 && hours < 17)) {
                    time = '6:00 PM';
                }

                this.toastr.success('Puesto ' + success.result.name + ' estara Operativo hasta las ' + time, '',
                    { positionClass: 'toast-bottom-center'});
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                }
            }
        );
    }

    stop(device) {
        this.operabilityService.stop(device.imei).then(
            (success: any) => {
                device.operative = success.result.operative;
                device.state = device.operative ? 'Operativo' : 'Inactivo';
                device.exists = true;
                this.toastr.error('Puesto ' + success.result.name + ' ahora esta Inoperativo', '',
                    { positionClass: 'toast-bottom-center'});
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                }
            }
        );
    }

    saveStand() {
        const newStand: Puesto = {
            name: this.newName,
            address: this.newAddress
        };
        this.standService.add(newStand).then(
            (success: any) => {
                this.editDeviceName = '';
                this.editDeviceDescription = '';
                const stand: any = success.result;
                console.log(success);
                stand.state = 'No especificado';
                stand.imei = stand.id;
                this.devices.push(stand);
                this.toastr.success('El puesto ' + stand.name
                    + ' ha sido creado con exito!.', '',
                    { positionClass: 'toast-bottom-center'});
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                }
            }
        );
    }

    openModal(device) {
        this.editDevice = device;
        this.editDeviceName = device.name;
        this.editDeviceDescription = device.address;
    }

    saveEdit() {
        const updateDevice = {
            id: this.editDevice.id,
            name: this.editDeviceName,
            address: this.editDeviceDescription
        };
        this.standService.set(updateDevice).then(
            (success: any) => {
                this.toastr.success('Puesto ' + success.result.name
                    + ' ha sido actualizado.', '',
                    { positionClass: 'toast-bottom-center'});
                this.editDevice.name = success.result.name;
                this.editDevice.address = success.result.address;
            }, error => {
                if (error.status === 422) {
                    // on some data incorrect
                } else {
                    this.toastr.info(error.message, 'Error',
                        { positionClass: 'toast-bottom-center'});
                }
            }
        );
    }
}
