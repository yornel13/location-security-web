import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AppComponent} from './app.component';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './login/login.component';
import {MainModule} from './main/main.module';



@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule,
        MainModule,
        NgbModule
    ],
    declarations: [
        AppComponent,
        LoginComponent,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
