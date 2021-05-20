import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {MainModule} from './main/main.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';
import {MatTabsModule} from '@angular/material/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { AsyncPipe } from '@angular/common';
// Firebase
// import { AngularFirestoreModule } from 'angularfire2/firestore';
// import { MessagingService } from './shared/messaging.service';
// import { AngularFireDatabaseModule } from 'angularfire2/database';
// import { AngularFireAuthModule } from 'angularfire2/auth';
// import { AngularFireModule } from 'angularfire2';
// import { AngularFireStorageModule } from 'angularfire2/storage';
import {NotificationService} from './shared/notification.service';
import {GlobalOsm} from './global.osm';
import {UtilsVehicles} from '../model/vehicle/vehicle.utils';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        MainModule,
        NgbModule,
        ReactiveFormsModule,
        // AngularFireModule.initializeApp(environment.firebase),
        // AngularFirestoreModule,
        // AngularFireDatabaseModule,
        // AngularFireAuthModule,
        // AngularFireStorageModule,
        MatTabsModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        // MessagingService,
        // NotificationService,
        AsyncPipe,
        GlobalOsm,
        UtilsVehicles
    ],
    bootstrap: [AppComponent],
    // exports: [ AngularFireModule, AngularFireStorageModule ]
})
export class AppModule { }
