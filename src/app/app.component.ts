import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Notification } from './hr/models/notification.model';
import { EmployeeSummaryService } from './hr/services/employee-summary.service';
import {
  ADMIN,
  HR,
  INSTRUCTOR,
  STUDENT,
  ORGANISATION8_OWNER,
  EMPLOYEE,
} from './lms/constants/roles.constant';
import { User } from './lms/models/user.model';
import { UserService } from './lms/services/user.service';
import { NotificationsService } from './services/notifications.service';
import { filter } from 'rxjs/operators';

interface Route {
  roles: string[];
  link: string;
  label: string;
  icon: string;
  hidden: boolean;
  modulename;
}
const ROUTES: Array<Route> = [
  {
    roles: [ADMIN, ORGANISATION8_OWNER],
    link: 'accounting',
    label: 'Accounting System',
    icon: 'accounting',
    modulename: 'AC',
    hidden: false,
  },
  {
    roles: [INSTRUCTOR, EMPLOYEE, HR, ADMIN, ORGANISATION8_OWNER],
    link: 'hr-administration',
    label: 'HR Management',
    icon: 'hr',
    modulename: 'HR',
    hidden: false,
  },
  {
    roles: [ADMIN, INSTRUCTOR, STUDENT, ORGANISATION8_OWNER],
    link: 'lms',
    label: 'LMS',
    icon: 'lms',
    modulename: 'LMS',
    hidden: false,
  },

  {
    roles: [ADMIN, ORGANISATION8_OWNER],
    link: 'identity',
    label: 'Identity',
    icon: 'identity',
    modulename: 'ID',
    hidden: false,
  },

  // {
  //   roles: [ADMIN, INSTRUCTOR, HR, STUDENT, ORGANISATION8_OWNER],
  //   link: 'VCDASHBOARD',
  //   label: 'Video Conference',
  //   icon: 'vc',
  //   hidden: false,
  // },
  {
    roles: [ADMIN, INSTRUCTOR, HR, STUDENT, ORGANISATION8_OWNER],
    link: 'VCDASHBOARD',
    label: 'Video Conference',
    icon: 'vc',
    modulename: 'VC',
    hidden: false,
  },
];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  notificationItems: Notification[];
  solutions: string;
  solutionIcon: string;
  dropDownActive: boolean;
  unreadNotifications: number;
  routes: Array<Route> = ROUTES;
  user: User;
  currentRoute: any;
  currentSolution: any;
  constructor(
    private router: Router,
    private userService: UserService,
    private employeeService: EmployeeSummaryService,
    private notificationService: NotificationsService
  ) {
    this.dropDownActive = false;
    if (!this.solutions || !this.solutionIcon) {
      this.solutions = 'Solutions';
      this.solutionIcon = 'solutions';
    }
  }

  ngOnInit() {
    this.user = this.userService.user;
    this.getNotifications();
    this.unreadCount();
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        console.log('⚡  ~ event.url', event.url);
        this.getCurrentSolution();
      });
  }
  getCurrentSolution() {
    this.currentSolution = this.routes.filter(
      (route) => route.link === this.currentRoute?.split('/')[1]
    )[0];
    console.log(this.currentSolution);
    this.solutions = this.currentSolution?.label;
    console.log('⚡ ~~ this.solutions', this.solutions);
    this.solutionIcon = this.currentSolution?.icon;
  }
  shoudNavShow() {
    return !(
      this.router.url.includes('/signup') || this.router.url.includes('/about')
    );
  }
  token: string = localStorage.getItem('token');

  ngDoCheck() {
    this.user = this.userService.getCurrentUser();
    if (this.user && this.user.type) {
      if (this.user.type === ORGANISATION8_OWNER) {
        this.routes = ROUTES.filter(
          (route) =>
            this.user.eooaccessmodules.includes(route.modulename) &&
            !route.hidden
        );
      } else {
        this.routes = ROUTES.filter(
          (route) => route.roles.includes(this.user.type) && !route.hidden
        );
      }
    }
  }

  navigateTo(here: string, name: string, icon: string) {
    this.solutions = name;
    this.solutionIcon = icon;
    this.router.navigate([here]);
  }
  shouldButtonHide(role) {
    return this.userService.user?.type == role;
  }
  toggleDropdown() {
    this.dropDownActive = !this.dropDownActive;
  }
  closeDropdown() {
    this.dropDownActive = false;
  }
  getNotifications() {
    this.employeeService.getUserNotifications().subscribe((result) => {
      this.notificationItems = result['response'][0]['totalData'];
      console.log(
        '🔕 ~ file: app.component.ts ~ line 47 getUserNotifications',
        result
      );
    });
  }
  toggleIsRead(notif) {
    if (notif.isRead) {
      return;
    }
    this.notificationService
      .updateNotification(notif._id, { isRead: true })
      .subscribe((result) => {
        notif.isRead = result['response']['isRead'];
        console.log('⚡ ~  toggleIsRead ~ result', result);
        this.unreadCount();
      });
  }
  unreadCount() {
    this.notificationService.getUnreadNotifCount().subscribe((result) => {
      this.unreadNotifications = result['response'];
      console.log('⚡ ~ ~ ~ unreadCount ~ result', result);
    });
  }
}
