import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/lms/services/user.service';
interface Route {
  link: string;
  icon: string;
  label: string;
}
const ROUTES: Array<Route> = [
  {
    link: './',
    icon: 'book',
    label: 'Summary',
  },
  {
    link: './profile',
    icon: 'user',
    label: 'Profile',
  },
  {
    link: './collaborators',
    icon: 'users',
    label: 'Collaborators',
  },
  {
    link: './contracts',
    icon: 'copy',
    label: 'Contracts',
  },

  {
    link: './interviews',
    icon: 'form',
    label: 'Interviews',
  },

  {
    link: './timetable',
    icon: 'clock',
    label: 'Timetable',
  },
  {
    link: './timesheets',
    icon: 'calendar',
    label: 'Timesheets',
  },
  {
    link: './timesheetManagement',
    icon: 'calendar',
    label: 'T-heet Management',
  },
  {
    link: './timeoffs',
    icon: 'on-holiday',
    label: 'Timeoffs',
  },
];

@Component({
  selector: 'app-hrdashboard',
  templateUrl: './hrdashboard.component.html',
  styleUrls: ['./hrdashboard.component.css'],
})
export class HrdashboardComponent implements OnInit {
  isAdmin: boolean = false;
  isStudent: boolean = false;
  routes: Array<Route> = ROUTES;

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
