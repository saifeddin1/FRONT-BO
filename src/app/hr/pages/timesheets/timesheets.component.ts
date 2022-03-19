import { Component, OnInit } from '@angular/core';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TimesheetDeclaration } from '../../models/timesheetDeclaration.model';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.css'],
})
export class TimesheetsComponent implements OnInit {
  timesheets: Timesheet[];
  p: number = 1;
  limit: number = 7;
  total: number;
  monthlyWorkingHours: number;
  monthlyHoursLimit: number;
  totalHours: number;
  currentTimesheet: Timesheet = {
    userId: this.employeeService.getUser()['_id'],
    date: null,
    note: '',
    workingHours: 0,
  };
  timesheet: Timesheet;
  isDeclared: boolean;
  isApproved: boolean;
  extraHours: number;
  yearMonth: string;
  contract: any;
  formatedDate(date) {
    return formatDate(date);
  }
  workignHoursInput: number = 8;
  declaration: TimesheetDeclaration;
  constructor(
    private employeeService: EmployeeSummaryService,
    private toastr: ToastrService
  ) {
    this.yearMonth = new Date().toISOString().split('T')[0].substring(0, 7);
  }

  currUser = this.employeeService.getUser();
  ngOnInit(): void {
    this.getEmployeeTimeSheets();
    this.getCurrentDeclaration();
    this.getEmployeeActiveContract();
    this.getMonthlyHours();
  }

  getEmployeeActiveContract() {
    let today = new Date();
    return this.employeeService.getContractsWithSalary().subscribe((result) => {
      this.contract = result['response'].filter(
        (c) => new Date(c.endDate) >= new Date(today)
      )[0];

      this.monthlyHoursLimit = this.contract?.hoursNumber;
    });
  }

  getMonthlyHours() {
    this.employeeService
      .getWorkedHoursMonthly(new Date().toISOString())
      .subscribe((result) => {
        this.monthlyWorkingHours = result['response'][0]['sum'];
        console.log('⚡  getMonthlyHours', this.monthlyWorkingHours);
        this.totalHours = this.monthlyWorkingHours - this.monthlyHoursLimit;
      });
  }
  checkHours() {
    if (this.workignHoursInput === 8) {
      this.extraHours = null;
    } else {
      this.extraHours = this.workignHoursInput - 8;
    }
  }

  getEmployeeTimeSheets() {
    console.log(this.yearMonth);
    this.employeeService
      .getMonthlyEmployeeTimesheets(
        this.p,
        this.limit,
        this.yearMonth && this.yearMonth
      )
      .subscribe((result) => {
        console.log(
          '📚 ~  TimesheetsComponent ~ getEmployeeTimeSheets',
          result
        );
        this.timesheets = result['response'][0]['totalData'];
        this.total = result['response'][0]['totalCount'][0]['count'];
      });
  }
  changePage(event) {
    console.log(event);
    this.p = event;
    this.getEmployeeTimeSheets();
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
      .updateEmployeeTimeSheet(timesheet._id, {
        note: timesheet.note,
        workingHours: timesheet.workingHours,
        date: new Date(timesheet.date),
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
          this.getMonthlyHours();
        },
        (err) => {
          this.showErrorToaster(err?.message);
          console.log(err);
        }
      );
  }

  insertRecord() {
    this.employeeService
      .createEmployeeTimeSheet(this.currentTimesheet)
      .subscribe((result) => {
        console.log(
          '⚡ ~ file: timesheets.component.ts ~ line 85 ~ TimesheetsComponent ~ insertRecord ~ result',
          result
        );
        this.getEmployeeTimeSheets();
      });
  }

  createDeclaration() {
    return this.employeeService
      .createTimesheetDeclaration({
        userId: this.currUser['_id'],
        month: new Date().getMonth() + 1,
      })
      .subscribe((result) => {
        console.log('✅ CREATED', result);
        this.declaration = result['response'];
        this.isDeclared = true;
      });
  }

  cancelDeclaration() {
    this.employeeService
      .deleteDeclaration(this.declaration._id)
      .subscribe((result) => {
        console.log('❌deleteDeclaration ~ result', result);
        this.isDeclared = false;
      });
  }

  getCurrentDeclaration() {
    return this.employeeService
      .getCurrentDeclaration(new Date().getMonth() + 1)
      .subscribe((result) => {
        this.declaration = result['response'];
        this.isDeclared =
          this.declaration && this.declaration?.status === 'declared'
            ? true
            : false;
        console.log('✅ this.declaration', this.declaration);
        this.isApproved =
          this.declaration && this.declaration?.status === 'approved'
            ? true
            : false;
        console.log(this.isApproved);
      });
  }
}
