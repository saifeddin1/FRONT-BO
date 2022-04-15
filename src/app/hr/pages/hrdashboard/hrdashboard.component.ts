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
  hidden: boolean;
}
const ROUTES: Array<Route> = [
  {
    roles: [INSTRUCTOR, HR, ADMIN],
    link: './',
    icon: 'book',
    status: 'active',
    label: 'Summary',
    hidden: false,
  },
  {
    roles: [INSTRUCTOR, HR, ADMIN],
    link: './profile',
    icon: 'user',
    status: 'active',
    label: 'Profile',
    hidden: false,
  },
  {
    roles: [INSTRUCTOR, HR],
    link: './collaborators',
    icon: 'users',
    status: 'active',
    label: 'Collaborators',
    hidden: false,
  },
  {
    roles: [ADMIN],
    link: './manage-employees',
    icon: 'users',
    status: 'active',
    label: 'Employees',
    hidden: false,
  },

  {
    roles: [ADMIN, INSTRUCTOR, HR],
    link: './manage-contracts',
    icon: 'copy',
    status: 'active',
    label: 'Contracts',
    hidden: false,
  },

  {
    roles: [INSTRUCTOR, HR, ADMIN],
    link: './interviews',
    icon: 'form',
    status: 'active',
    label: 'Interviews',
    hidden: false,
  },

  {
    roles: [INSTRUCTOR, HR],
    link: './timetable',
    icon: 'clock',
    status: 'active',
    label: 'Timetable',
    hidden: false,
  },
  {
    roles: [INSTRUCTOR, HR],
    link: './timesheets',
    icon: 'calendar',
    status: 'active',
    label: 'Timesheets',
    hidden: false,
  },
  {
    roles: [ADMIN],
    link: './timesheetManagement',
    icon: 'calendar',
    status: 'active',
    label: 'T-heet Management',
    hidden: false,
  },
  {
    roles: [INSTRUCTOR, HR, ADMIN],
    link: './timeoffs',
    icon: 'on-holiday',
    status: 'active',
    label: 'Timeoffs',
    hidden: false,
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
  doesEmployeeHaveContract: boolean = true;
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

    // this.routes.forEach((route) => {
    //   this.isAdmin
    //     ? (route.hidden = false)
    //     : (route.hidden = this.doesEmployeeHaveContract);
    // });

    if (this.user && this.user.type) {
      this.routes = ROUTES.filter(
        (route) => route.roles.includes(this.user.type) && !route.hidden
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
