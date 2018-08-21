import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {MainModule} from './main/main.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { fakeBackendProvider } from './_helpers';
//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        MainModule,
        NgbModule,
        BrowserModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
    	  AngularFirestoreModule,
    ],
    declarations: [
        AppComponent,
        LoginComponent,
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
