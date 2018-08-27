import { Component } from '@angular/core';


@Component({
    selector: 'app-main',
    template: `
      <div class="app-container">
          <app-header class="app-header"></app-header>
          <router-outlet></router-outlet>
      </div>
  `
})
export class MainComponent { }
