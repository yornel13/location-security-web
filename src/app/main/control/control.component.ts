import { Component } from '@angular/core';


@Component({
    selector: 'app-control',
    template: `
      <div class="control-container">
          <app-control-aside></app-control-aside>
          <main class="main-container">
              <router-outlet></router-outlet>
          </main>
      </div>
  `,
    styleUrls: ['./control.component.css']
})
export class ControlComponent {}