import { Component } from '@angular/core';
import { GuardService} from './model/guard/guard.service';
import {Guard} from './model/guard/guard';
import { ApiResponse } from './model/app.response';

@Component({
  selector: 'app-root',
  template: `
      <app-dashboard></app-dashboard>
  `,
  styleUrls: ['./app.component.css']
})
export class AppComponent { }
