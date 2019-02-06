import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'jspdf-autotable';
import {BusinessService} from '../../../../model/business/business.service';
import {Business} from '../../../../model/business/business';
import {BusinessList} from '../../../../model/business/business.list';
import {ApiResponse} from '../../../../model/app.response';
import {ErrorService} from '../../../../model/error/error.service';

@Component({
    selector: 'app-empresas',
    templateUrl: './empresas.component.html',
    styleUrls: ['./empresas.component.css']
})
export class EmpresasComponent {
    // general
    data: Business[] = undefined;
    nameA: string;
    rucA: string;
    addressA: string;
    nameE: string;
    rucE: string;
    addressE: string;
    companyE: Business;

    list: boolean;
    create: boolean;
    edit: boolean;

    filter: string;
    numElement = 10;
    key = 'id'; // set default
    reverse = true;

    constructor(
        public router: Router,
        private businessService: BusinessService,
        private errorService: ErrorService) {
        this.getAll();
        this.list = true;
        this.create = false;
        this.edit = false;
    }

    return() {
        this.list = true;
        this.create = false;
        this.edit = false;
    }

    sort(key) {
        this.key = key;
        this.reverse = !this.reverse;
    }

    getAll() {
        this.businessService.getAll().then(
            (success: BusinessList) => {
                this.data = success.data;
            }, error => {
                this.errorService.process(error);
            }
        );
    }

    createCompany() {
        this.list = false;
        this.create = true;
        this.edit = false;
    }

    saveCompany() {
        const company: Business = {
            name: this.nameA,
            address: this.addressA,
            ruc: this.rucA
        };

        this.businessService.add(company).then(
            (success: ApiResponse) => {
                this.getAll();
                this.return();
                this.nameA = '';
                this.addressA = '';
                this.rucA = '';
            }, (error: any) => {
                this.errorService.process(error);
            }
        );
    }

    editCompany(id) {
        this.businessService.getId(id).then(
            (success: Business) => {
                this.companyE = success;
                this.nameE = this.companyE.name;
                this.addressE = this.companyE.address;
                this.rucE = this.companyE.ruc;
                this.list = false;
                this.create = false;
                this.edit = true;
            }, error => {
                this.errorService.process(error);
            }
        );
    }

    saveEditedCompany() {
        const company: Business = {
            id: this.companyE.id,
            name: this.nameE,
            address: this.addressE,
            ruc: this.rucE
        };

        this.businessService.set(company).then(
            (success: ApiResponse) => {
                this.getAll();
                this.return();
                this.nameE = '';
                this.addressE = '';
                this.rucE = '';
            }, error => {
                this.errorService.process(error);
            }
        );
    }

    deleteCompany(id) {
        this.businessService.delete(id).then(
            (success: ApiResponse) => {
                this.getAll();
                this.return();
            }, error => {
                this.errorService.process(error);
            }
        );
    }
}
