import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../_services';
import {MessagingService} from '../shared/messaging.service';
import {ApiResponse} from '../../model/app.response';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService,
        private messagingService: MessagingService) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            dni: ['', Validators.required],
            password: ['', Validators.required]
        });
        this.authService.cleanStore();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/u/dashboard/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;
        if (this.loginForm.invalid) {
            return;
        }
        this.loading = true;
        if (this.error != '') {
          this.error = '';
        }
        this.authService.login(this.f.dni.value, this.f.password.value)
            .then((success: ApiResponse) => {
                    this.onSuccess(success.result);
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });
    }

    onSuccess(tokenSession: string) {
        this.authService.verify(tokenSession)
            .then(success => {
                    if (this.authService.getUser() === null) {
                        this.error = 'Usuario no definido';
                        this.loading = false;
                        return;
                    }
                    this.router.navigate([this.returnUrl]).then(res => {});
                },
                error => {
                    this.error = error;
                    this.loading = false;
                });


    }
}
