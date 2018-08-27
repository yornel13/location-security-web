import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../_services';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(
      private authenticationService: AuthenticationService,
      private router: Router) { }

  ngOnInit() {
  }

  exit() {
      this.authenticationService.logout().then(
          success => {
              this.router.navigate(['/login']);
          },
          error => {
              this.router.navigate(['/login']);
          });
  }
}
