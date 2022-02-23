import { Component, OnInit } from '@angular/core';
import { HR } from '../../../lms/constants/roles.constant';
import { ToasterService } from '../../../lms/services/toaster.service';
import { formatDate } from '../../helpers/formatDate';
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
  constructor(
    private toaster: ToasterService,
    private employeeService: EmployeeSummaryService
  ) {
    this.newTimeoffRequest = {
      startDate: null,
      offDays: 0,
    };
  }
  ngOnInit(): void {
    this.getEmlpoyeeTimeoffs();
  }
  currUser = this.employeeService.getUser();
  showForAdmin: boolean = this.currUser['type'] === HR;
  formatedDate(date) {
    return formatDate(date);
  }

  getEndDate(date: Date, days: number) {
    var someDate = new Date(date);
    var result = someDate.setDate(someDate.getDate() + days);

    return new Date(result);
  }

  getEmlpoyeeTimeoffs() {
    return this.employeeService
      .getEmployeeTimeoffHistory()
      .subscribe((result) => {
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
  updateStatus(timeoff) {
    return this.employeeService
      .updateTimeoffStatus({ status: timeoff.status }, timeoff._id)
      .subscribe(
        (result) => {
          console.log(result);
          this.toaster.success(result['message']);
        },
        (error) => this.toaster.error(error['error']['message'])
      );
  }
}
