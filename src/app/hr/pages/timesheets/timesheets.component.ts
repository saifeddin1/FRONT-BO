import { Component, OnInit } from '@angular/core';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';
import { time } from 'console';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.css'],
})
export class TimesheetsComponent implements OnInit {
  timesheets: Timesheet[];
  currentTimesheet: Timesheet = {
    userId: this.employeeService.getUser()['_id'],
    date: null,
    note: '',
    workingHours: 0,
  };
  // config: any;
  // page = 1;
  timesheet: Timesheet;
  formatedDate(date) {
    return formatDate(date);
  }
  constructor(
    private employeeService: EmployeeSummaryService,
    private toastr: ToastrService
  ) {
    // this.config = {
    //   itemsPerPage: 5,
    //   currentPage: this.page,
    //   totalItems: 10,
    // };
  }

  ngOnInit(): void {
    this.getEmployeeTimeSheets();
    // this.getCurrentTimesheet();
  }
  getEmployeeTimeSheets() {
    this.employeeService.getEmployeeTimeSheets().subscribe((result) => {
      console.log('📚 ~  TimesheetsComponent ~ getEmployeeTimeSheets', result);
      this.timesheets = result['response'][0]['totalData'];

      // this.config.totalItems = result['response'][0]['totalCount'][0]['count'];
      // console.log('📚 ~  ', this.config);
    });
  }
  getCurrentTimesheet() {
    let today = new Date().toISOString().split('T')[0];
    console.log(
      '⚡ ~ file: timesheets.component.ts ~ line 45 ~ TimesheetsComponent ~ getCurrentTimesheet ~ today',
      today
    );
    return this.employeeService
      .getEmployeeCurrentTimeSheet(today)
      .subscribe((result) => {
        this.timesheet = result['response'];
        console.log(
          '⚡  TimesheetsComponent ~ getCurrentTimesheet ~ result',
          result['response']
        );
      });
  }
  showSuccessToaster(msg) {
    this.toastr.success(msg);
  }

  showErrorToaster(msg) {
    this.toastr.error(msg);
  }
  updateRecord(timesheet) {
    console.log(timesheet);

    return this.employeeService
      .updateEmployeeTimeSheets(timesheet._id, {
        note: timesheet.note,
        workingHours: timesheet.workingHours,
        date: timesheet.date,
      })
      .pipe(
        catchError((err) => {
          return throwError(err['error']);
        })
      )
      .subscribe(
        (result) => {
          this.showSuccessToaster(result['message']);
          console.log(result);
        },
        (err) => {
          this.showErrorToaster(err?.message);
          console.log(err);
        }
      );
  }

  insertRecord() {
    this.employeeService
      .createEmployeeTimeSheets(this.currentTimesheet)
      .subscribe((result) => {
        console.log(
          '⚡ ~ file: timesheets.component.ts ~ line 85 ~ TimesheetsComponent ~ insertRecord ~ result',
          result
        );
      });
  }
}
