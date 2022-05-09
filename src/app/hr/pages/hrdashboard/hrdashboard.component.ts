import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ADMIN, HR, INSTRUCTOR } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { UserService } from 'src/app/lms/services/user.service';
import { Contract } from '../../models/contract.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
interface Route {
  roles: string[];
  link: string;
  icon: string;
  status: string;
  label: string;
  hidden: boolean;
}
const ROUTES: Array<Route> = [
  // {
  //   roles: [INSTRUCTOR, HR, ADMIN],
  //   link: './',
  //   icon: 'book',
  //   status: 'active',
  //   label: 'Summary',
  //   hidden: false,
  // },
  // {
  //   roles: [INSTRUCTOR, HR, ADMIN],
  //   link: './profile',
  //   icon: 'user',
  //   status: 'active',
  //   label: 'Profile',
  //   hidden: false,
  // },
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
    link: './declarations',
    icon: 'calendar',
    status: 'active',
    label: 'Declarations',
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
  {
    roles: [ADMIN],
    link: './year-months',
    icon: 'clock',
    status: 'active',
    label: 'Year-Months',
    hidden: false,
  },
  {
    roles: [ADMIN],
    link: './contract-settings',
    icon: 'file-settings',
    status: 'active',
    label: 'Contract Settings',
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
  employeeContract: Contract;
  doesEmployeeHaveContract: boolean = false;
  isInstructor: boolean;
  isLoading: boolean = true;
  // color: ThemePalette = 'primary';
  // mode: ProgressSpinnerMode = 'indeterminate';
  // value = 50;
  isEmployeeAdministrative: boolean;
  constructor(
    public userService: UserService,
    private employeeService: EmployeeSummaryService
  ) {
    this.checkRoles();
  }

  ngOnInit(): void {
    this.getEmployeeContract();
    if (this.isAdmin) this.isLoading = false;
    console.log(this.isEmployeeAdministrative);
  }

  getEmployeeContract() {
    this.isLoading = true;
    this.employeeService.getActiveContract().subscribe(
      (result) => {
        this.employeeContract = result['response'];
        if (result['response']) {
          this.doesEmployeeHaveContract = true;
        }
        this.employeeContract.timesheetType === 'ADMINISTRATIVE'
          ? (this.isEmployeeAdministrative = true)
          : (this.isEmployeeAdministrative = false);
        setTimeout(() => {
          this.toggleRoutes();
        });
        this.isLoading = false;
      },
      (error) => {
        this.doesEmployeeHaveContract = false;

        console.log(error);
        this.toggleRoutes();
      }
    );
  }

  toggleRoutes() {
    this.routes.forEach((route) => {
      if (this.isAdmin) {
        route.hidden = false;
        this.isLoading = false;
      } else {
        if (route.label === 'Timetable') {
          route.hidden =
            !this.doesEmployeeHaveContract || this.isEmployeeAdministrative;
          this.isLoading = false;
          console.log('heere');
        } else if (route.label === 'Timesheets') {
          route.hidden =
            !this.doesEmployeeHaveContract || !this.isEmployeeAdministrative;
          this.isLoading = false;
        }
        //  else if (route.label === 'Summary' || route.label === 'Profile') {
        //   route.hidden = false;
        //   this.isLoading = false;
        // }
        else {
          route.hidden = !this.doesEmployeeHaveContract;
          this.isLoading = false;
        }
      }
    });
  }

  logout() {
    this.userService.logOut();
  }
  ngDoCheck() {
    this.user = this.userService.getCurrentUser();
    // this.toggleRoutes();
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
