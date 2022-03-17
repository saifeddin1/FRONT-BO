import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from './hr/models/notification.model';
import { EmployeeSummaryService } from './hr/services/employee-summary.service';
import { STUDENT } from './lms/constants/roles.constant';
import { User } from './lms/models/user.model';
import { UserService } from './lms/services/user.service';
import { NotificationsService } from './services/notifications.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  notificationItems: Notification[];
  solutions: string = 'LMS SYSTEM 🔻';
  dropDownActive: boolean;
  unreadNotifications: number;
  constructor(
    private router: Router,
    private userService: UserService,
    private employeeService: EmployeeSummaryService,
    private notificationService: NotificationsService
  ) {
    this.dropDownActive = false;
  }

  ngOnInit() {
    // this.getNotifications();
    // this.unreadCount();
  }

  shoudNavShow() {
    return !(
      this.router.url.includes('/signup') || this.router.url.includes('/about')
    );
  }
  token: string = localStorage.getItem('token');

  navigateTo(here: string, name: string) {
    this.solutions = name + ' 🔻';
    this.router.navigate([here]);
  }
  shouldButtonHide(role) {
    return this.userService.user?.type == role;
  }
  toggleDropdown() {
    this.dropDownActive = !this.dropDownActive;
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
