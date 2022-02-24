import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { STUDENT } from './lms/constants/roles.constant';
import { User } from './lms/models/user.model';
import { UserService } from './lms/services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router, private userService: UserService) {}
  shoudNavShow() {
    return !(
      this.router.url.includes('/signup') || this.router.url.includes('/about')
    );
  }
  token: string = localStorage.getItem('token');

  navigateTo(here: string) {
    this.router.navigate([here]);
  }
  shouldButtonHide(role) {
    return this.userService.user?.type == role;
  }
}
