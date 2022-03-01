import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/lms/services/user.service';

@Component({
  selector: 'app-hrdashboard',
  templateUrl: './hrdashboard.component.html',
  styleUrls: ['./hrdashboard.component.css'],
})
export class HrdashboardComponent implements OnInit {
  isAdmin: boolean = false;
  isStudent: boolean = false;
  isHr: boolean = false;
  isInstructor: boolean;
  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.checkRoles();
  }
  logout() {
    this.userService.logOut();
  }
  checkRoles() {
    switch (this.userService.getCurrentUser()?.type) {
      case 'EADMIN':
        this.isAdmin = true;
        break;
      case 'ESTUDENT':
        this.isStudent = true;
        break;
      case 'EHR':
        this.isHr = true;
        break;
      case 'EINSTRUCTOR':
        this.isInstructor = true;
        break;
      default:
        this.isStudent = true;
        break;
    }
  }
}
