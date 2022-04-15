import { Component, OnInit } from '@angular/core';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TimesheetDeclaration } from '../../models/timesheetDeclaration.model';
import { YearMonth } from '../../models/yearMonth.model';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.css'],
})
export class TimesheetsComponent implements OnInit {
  timesheets: Timesheet[];
  p: number = 1;
  limit: number = 7;
  page: number = 1;
  total: number;
  // extraHours: number;
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

  yearMonth: string;
  contract: any;
  yearMonthItems: YearMonth[];
  monthlyExtraHours: any;
  formatedDate(date) {
    return formatDate(date);
  }
  workignHoursInput: number;
  declaration: TimesheetDeclaration;
  constructor(
    private employeeService: EmployeeSummaryService,
    private toastr: ToastrService
  ) {
    this.yearMonth = new Date().toISOString().split('T')[0].substring(0, 7);

    this.totalHours = 0;
  }

  currUser = this.employeeService.getUser();
  ngOnInit(): void {
    this.getEmployeeTimeSheets();
    this.getCurrentDeclaration();
    this.getEmployeeActiveContract();
    this.getAllYearMonthItems();
    this.getExtraHours();

    //
  }

  getAllYearMonthItems() {
    this.employeeService.getAllYearMonthItems().subscribe((result) => {
      console.log('📆📆  getAllYearMonthItems ~ result', result);
      this.yearMonthItems = result['response'][0]['totalData'];
    });
  }

  getEmployeeActiveContract() {
    let today = new Date();
    return this.employeeService.getActiveContract().subscribe((result) => {
      this.contract = result['response']

      this.monthlyHoursLimit = this.contract?.hoursNumber;
    });
  }

  getMonthlyWorkingHours() {
    this.employeeService
      .getHoursMonthly(
        this.yearMonth
          ? new Date(this.yearMonth).toISOString()
          : new Date().toISOString(),
        'workingHours'
      )
      .subscribe((result) => {
        console.log('⚡  getMonthlyWorkingHours', result);
        this.monthlyWorkingHours = result['response'][0]['sum'];
        this.totalHours = this.monthlyWorkingHours - this.monthlyHoursLimit;
      });
  }

  getExtraHours() {
    this.employeeService
      .getHoursMonthly(
        this.yearMonth
          ? new Date(this.yearMonth).toISOString()
          : new Date().toISOString(),
        'extraHours'
      )
      .subscribe((result) => {
        console.log('⚡  getExtraHours', result);
        this.monthlyExtraHours = result['response'][0]['sum'];
      });
  }

  checkHours(timesheet) {
    this.getExtraHours();
    if (timesheet.workingHours > 8) {
      timesheet.extraHours = timesheet.workingHours - 8;
    } else {
      timesheet.extraHours = 0;
    }
  }

  getEmployeeTimeSheets() {
    console.log('this.yearMonth', this.yearMonth);
    if (!this.yearMonth || this.yearMonth == '') {
      return;
    } else {
      this.employeeService
        .getMonthlyEmployeeTimesheets(this.p, this.limit, this.yearMonth)
        .subscribe((result) => {
          console.log(
            '📚 ~  TimesheetsComponent ~ getEmployeeTimeSheets',
            result
          );

          this.getMonthlyWorkingHours();
          this.getExtraHours();
          this.timesheets = result['response'][0]['totalData'];
          // this.timesheets.forEach((el) => {
          //   if (formatDate(el.date) == formatDate(new Date())) {
          //     console.log('le p  est: => ', this.p);
          //     this.page = this.p;
          //   }
          // });

          this.total = result['response'][0]['totalCount'][0]['count'];
          this.isApproved = false;
          this.isDeclared = false;
          this.employeeService
            .getCurrentDeclaration(parseInt(this.yearMonth.split('-')[1]))
            .subscribe((result) => {
              this.declaration = result['response'];
              this.isDeclared =
                this.declaration && this.declaration?.status === 'declared';
              console.log('✅ declaration', this.declaration);
              console.log('✅ this.declared', this.isDeclared);

              this.isApproved =
                this.declaration && this.declaration?.status === 'approved';
            });
        });
    }
  }

  changePage(event) {
    console.log(event);
    this.p = event;
    this.getEmployeeTimeSheets();
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
        extraHours: timesheet.extraHours,
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
          this.getMonthlyWorkingHours();
          this.getExtraHours();
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
        month: this.yearMonth.split('-')[1],
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
    this.employeeService
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
