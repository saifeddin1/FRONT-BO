import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Notification } from './hr/models/notification.model';
import { EmployeeSummaryService } from './hr/services/employee-summary.service';
import { STUDENT } from './lms/constants/roles.constant';
import { User } from './lms/models/user.model';
import { UserService } from './lms/services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  notificationItems: Notification[];
  dropDownActive: boolean;
  constructor(
    private router: Router,
    private userService: UserService,
    private employeeService: EmployeeSummaryService
  ) {
    this.dropDownActive = false;
  }

  ngOnInit() {
    this.getNotifications();
  }

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
    console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
    notif.isRead = true;
  }
}
