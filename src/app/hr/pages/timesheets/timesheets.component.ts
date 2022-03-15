import { Component, OnInit } from '@angular/core';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';
import { time } from 'console';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TimesheetDeclaration } from '../../models/timesheetDeclaration.model';
import { Timeslot } from '../../models/timeslot.model';
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
  timesheet: Timesheet;
  isDeclared: boolean;
  extraHours: number;
  formatedDate(date) {
    return formatDate(date);
  }
  workignHoursInput: number = 8;
  declaration: TimesheetDeclaration;
  constructor(
    private employeeService: EmployeeSummaryService,
    private toastr: ToastrService
  ) {}

  currUser = this.employeeService.getUser();
  ngOnInit(): void {
    this.getEmployeeTimeSheets();
    this.getCurrentDeclaration();

    console.log(this.isDeclared);
  }
  checkHours() {
    if (this.workignHoursInput === 8) {
      this.extraHours = null;
    } else {
      this.extraHours = this.workignHoursInput - 8;
    }
  }
  getEmployeeTimeSheets() {
    this.employeeService.getEmployeeTimeSheets().subscribe((result) => {
      console.log('📚 ~  TimesheetsComponent ~ getEmployeeTimeSheets', result);
      this.timesheets = result['response'][0]['totalData'];
    });
  }
  // getEmployeeTimeSheets() {
  //   this.employeeService.getTimeSlots().subscribe((result) => {
  //     console.log('📚 ~  TimesheetsComponent ~ getEmployeeTimeSheets', result);
  //     this.timesheets = result['response'][0]['totalData'].map(
  //       (el: Timeslot) => ({
  //         date: el.start,
  //         note: el.description,
  //         workingHours: Number(
  //           new Date(el.end).getHours() - new Date(el.start).getHours()
  //         ),
  //       })
  //     );
  //   });
  // }

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
    this.isDeclared = true;
    return this.employeeService
      .createTimesheetDeclaration({
        userId: this.currUser['_id'],
        month: new Date().getMonth() + 1,
      })
      .subscribe((result) => {
        console.log('✅ CREATED', result);
      });
  }

  cancelDeclaration() {
    this.isDeclared = false;
    this.employeeService
      .deleteDeclaration(this.declaration._id)
      .subscribe((result) => {
        console.log('❌deleteDeclaration ~ result', result);
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
      });
  }
}
