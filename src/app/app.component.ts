import { Component } from '@angular/core';
import { GuardService} from './model/guard/guard.service';
import {Guard} from './model/guard/guard';
import { ApiResponse } from './model/app.response';

@Component({
  selector: 'app-main',
  template: `
      <div class="app-container">
          <app-header class="app-header"></app-header>
          <app-monitoring></app-monitoring>
      </div>
  `,
    styleUrls:['./app.component.css']
    // styles: ['app-monitoring { display: block; max-height: 100vh; width: 100vw; overflow: hidden }']
})
export class AppComponent { }
