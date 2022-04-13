import { Component, OnInit } from '@angular/core';
import { ADMIN, HR, INSTRUCTOR } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { UserService } from 'src/app/lms/services/user.service';
interface Route {
  roles: string[];
  link: string;
  icon: string;
  status: string;
  label: string;
}
const ROUTES: Array<Route> = [
  {
    roles: [INSTRUCTOR, HR, ADMIN],
    link: './',
    icon: 'book',
    status: 'active',
    label: 'Summary',
  },
  {
    roles: [INSTRUCTOR, HR, ADMIN],
    link: './profile',
    icon: 'user',
    status: 'active',
    label: 'Profile',
  },
  {
    roles: [INSTRUCTOR, HR],
    link: './collaborators',
    icon: 'users',
    status: 'active',
    label: 'Collaborators',
  },
  {
    roles: [ADMIN],
    link: './manage-employees',
    icon: 'users',
    status: 'active',
    label: 'Employees',
  },
  // {
  //   roles: [INSTRUCTOR, HR],
  //   link: './contracts',
  //   icon: 'copy',
  //   status: 'active',
  //   label: 'Contracts',
  // },
  {
    roles: [ADMIN, INSTRUCTOR, HR],
    link: './manage-contracts',
    icon: 'copy',
    status: 'active',
    label: 'Contracts',
  },

  {
    roles: [INSTRUCTOR, HR, ADMIN],
    link: './interviews',
    icon: 'form',
    status: 'active',
    label: 'Interviews',
  },

  {
    roles: [INSTRUCTOR, HR],
    link: './timetable',
    icon: 'clock',
    status: 'active',
    label: 'Timetable',
  },
  {
    roles: [INSTRUCTOR, HR],
    link: './timesheets',
    icon: 'calendar',
    status: 'active',
    label: 'Timesheets',
  },
  {
    roles: [ADMIN],
    link: './timesheetManagement',
    icon: 'calendar',
    status: 'active',
    label: 'T-heet Management',
  },
  {
    roles: [INSTRUCTOR, HR, ADMIN],
    link: './timeoffs',
    icon: 'on-holiday',
    status: 'active',
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
  user: User;
  isHr: boolean = false;
  isInstructor: boolean;
  constructor(public userService: UserService) {}

  ngOnInit(): void {
    this.checkRoles();
  }
  logout() {
    this.userService.logOut();
  }
  ngDoCheck() {
    this.user = this.userService.getCurrentUser();
    if (this.user && this.user.type) {
      this.routes = ROUTES.filter((route) =>
        route.roles.includes(this.user.type)
      );
    }
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
