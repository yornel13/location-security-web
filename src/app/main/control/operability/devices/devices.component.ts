import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'jspdf-autotable';
import {ToastrService} from 'ngx-toastr';
import {VehiclesService} from '../../../../../model/vehicle/vehicle.service';
import {TabletService} from '../../../../../model/tablet/tablet.service';
import {OperabilityService} from '../../../../../model/operability/operability.service';

@Component({
    selector: 'app-devices',
    templateUrl: './devices.component.html',
    styleUrls: ['./devices.component.css']
})
export class DevicesComponent {
    // General
    vehicles: any[] = [];
    tablets: any[] = [];
    devices: any[] = [];
    isLoading = false;

    filter: string;
    numElement = 10;

    key = 'name'; // set default
    reverse = true;

    editDevice: any;
    editDeviceName: any;
    editDeviceSeries: any;
    editDeviceDescription: any;
    p;

    constructor(public router: Router,
                private vehicleService: VehiclesService,
                private tabletService: TabletService,
                private operabilityService: OperabilityService,
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
        this.vehicleService.getVehiclesList().then(
            (success: any) => {
                this.vehicles = success.data;
                this.getTablets();
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

    getTablets() {
        this.tabletService.getAll().then(
            (success: any) => {
                this.tablets = success.data;
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
                this.tablets.forEach(tablet => {
                    tablet.name = tablet.alias;
                    tablet.state = 'No especificado';
                    this.devices.push(tablet);
                });
                this.vehicles.forEach(vehicle => {
                    vehicle.name = vehicle.alias;
                    vehicle.state = 'No especificado';
                    this.devices.push(vehicle);
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
        this.operabilityService.start(device.imei).then(
            (success: any) => {
                device.operative = success.result.operative;
                device.state = device.operative ? 'Operativo' : 'Inactivo';
                device.exists = true;
                    this.toastr.success('Dispositivo ' + success.result.name + ' ahora esta Operativo', '',
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
                this.toastr.error('Dispositivo ' + success.result.name + ' ahora esta Inoperativo', '',
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
        this.editDeviceSeries = device.series;
        this.editDeviceDescription = device.description;
    }

    saveEdit() {
        const exists = this.editDevice.exists;
        const updateDevice = {
            imei: this.editDevice.imei,
            series: this.editDeviceSeries,
            description: this.editDeviceDescription,
        };
        this.operabilityService.set(updateDevice).then(
            (success: any) => {
                if (!exists) {
                    this.toastr.success('Dispositivo ' + success.result.name
                        + ' ha sido actualizado y ahora esta Operativo', '',
                        { positionClass: 'toast-bottom-center'});
                }
                this.editDevice.series = success.result.series;
                this.editDevice.description = success.result.description;
                this.editDevice.operative = success.result.operative;
                this.editDevice.state = success.result.operative ? 'Operativo' : 'Inactivo';
                this.editDevice.exists = true;
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
