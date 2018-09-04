import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../_services';
import {Router} from '@angular/router';
import {Admin} from '../../../model/admin/admin';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  user: string;
  photo: string;

  constructor(
      private authenticationService: AuthenticationService,
      private router: Router) { }

  ngOnInit() {
    const admin: Admin = this.authenticationService.getUser();
    if (admin != null) {
      this.user = admin.name + ' ' + admin.lastname;
      if (admin.photo != null && admin.photo.includes('http')) {
        this.photo = admin.photo;
      } else {
        this.photo = './assets/img/user_empty.jpg';
      }
      console.log(admin);
    } else {
      console.log('no user logger');
      this.router.navigate(['/login']);
    }
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
