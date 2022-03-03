import { Component, OnInit } from '@angular/core';
import { ADMIN, HR } from '../../../lms/constants/roles.constant';
import { ToasterService } from '../../../lms/services/toaster.service';
import { formatDate } from '../../helpers/formatDate';
import { Notification } from '../../models/notification.model';
import { Timeoff } from '../../models/timeoff.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-timeoffs',
  templateUrl: './timeoffs.component.html',
  styleUrls: ['./timeoffs.component.css'],
})
export class TimeoffsComponent implements OnInit {
  timeoffHistory: Timeoff[];
  newTimeoffRequest: Timeoff;
  newNotification: Notification;
  isAdmin: boolean;
  isHR: boolean;
  shouldDisplay: boolean;
  notificationItems: any;
  constructor(
    private toaster: ToasterService,
    private employeeService: EmployeeSummaryService
  ) {
    this.isAdmin = this.currUser['type'] === ADMIN;
    this.isHR = this.currUser['type'] === HR;
    this.shouldDisplay = this.isHR || this.isAdmin;
    this.newTimeoffRequest = {
      startDate: null,
      offDays: 0,
    };
    this.newNotification = {
      userId: '',
      content: '',
    };
  }
  ngOnInit(): void {
    this.getEmlpoyeeTimeoffs();
    console.log(this.isAdmin, this.isHR, this.shouldDisplay);
  }
  currUser = this.employeeService.getUser();
  formatedDate(date) {
    return formatDate(date);
  }

  getEndDate(date: Date, days: number) {
    var someDate = new Date(date);
    var result = someDate.setDate(someDate.getDate() + days);

    return new Date(result);
  }

  deleteRequest(toff: Timeoff) {
    return this.employeeService.deleteTimeoff(toff._id).subscribe((result) => {
      console.log(result);
      this.getEmlpoyeeTimeoffs();
      this.toaster.success('Deleted Successfully');
    });
  }
  getEmlpoyeeTimeoffs() {
    return this.isAdmin || this.isHR
      ? this.employeeService.getAllTimeoffs().subscribe((result) => {
          this.timeoffHistory = result['response'][0]['totalData'];
          console.log(
            '⚡ TimeoffsComponent  this.timeoffHistory',
            this.timeoffHistory
          );
        })
      : this.employeeService.getEmployeeTimeoffHistory().subscribe((result) => {
          this.timeoffHistory = result['response'][0]['totalData'];
          console.log(
            '⚡ TimeoffsComponent  this.timeoffHistory',
            this.timeoffHistory
          );
        });
  }

  requestTimeoff() {
    console.log(this.newTimeoffRequest);

    return this.employeeService
      .createTimeoffRequest(this.newTimeoffRequest)
      .subscribe(
        (result) => {
          this.getEmlpoyeeTimeoffs();
          console.log('⚡ ~ ~ requestTimeoff ~ result', result);
          this.toaster.success(result['message']);
        },

        (error) => this.toaster.error(error['error']['message'])
      );
  }
  // for hr agent

  updateStatus(timeoff) {
    this.employeeService
      .updateTimeoffStatus({ status: timeoff.status }, timeoff._id)
      .subscribe(
        (result) => {
          console.log(
            result,
            result['response']['userId'],
            result['response']['content']
          );
          this.toaster.success(result['message']);
          this.createNotification({
            userId: result['response']['userId'],
            content: `Timeoff #${timeoff._id} has been ${timeoff.status}`,
          });
          this.getNotifications();
          // this.newNotification.userId = result['response']['userId'];
          // this.newNotification.content = result['response']['content'];
        },
        (error) => this.toaster.error(error['error']['message'])
      );
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

  createNotification(body) {
    return this.employeeService.createNotification(body).subscribe((result) => {
      console.log('🔕  ~ result', result);
    });
  }
  // for admin
  updateTimeoffRequest(timeoff) {
    return this.employeeService.updateTimeoff(timeoff._id, timeoff).subscribe(
      (result) => {
        console.log(result);
        this.toaster.success(result['message']);
      },
      (error) => this.toaster.error(error['error']['message'])
    );
  }
}
