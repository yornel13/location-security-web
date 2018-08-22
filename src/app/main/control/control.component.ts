import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-control',
    template: `
      <div class="control-container">
          <app-control-aside *ngIf="!(router.url === '/u/control/home')"></app-control-aside>
          <main class="main-container">
              <router-outlet></router-outlet>
          </main>
      </div>
  `,
    styleUrls: ['./control.component.css']
})
export class ControlComponent {
  constructor(private router: Router) { }
}