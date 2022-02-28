import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';
import { User } from 'src/app/lms/models/user.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-manage-timesheets',
  templateUrl: './manage-timesheets.component.html',
  styleUrls: ['./manage-timesheets.component.css'],
})
export class ManageTimesheetsComponent implements OnInit {
  timesheet: Timesheet;
  timesheets: Timesheet[];
  users: User[];
  userId: string;
  constructor(
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.timesheet = {
      userId: '',
      date: null,
      note: '',
      workingHours: 0,
    };
  }
  formatedDate(date) {
    return formatDate(date);
  }
  ngOnInit(): void {
    this.getUsers();
    this.getAllTimesheets();
  }

  createTimesheet() {
    this.employeeService
      .createEmployeeTimeSheet(this.timesheet)
      .subscribe((result) => {
        console.log('⚡  ManageTimesheetsComponent  ~ result', result);
        this.toaster.success('Created Successfully');
        this.getAllTimesheets();
      });
  }
  getAllTimesheets() {
    this.employeeService.getAllSheets().subscribe((result) => {
      this.timesheets = result['response'][0]['totalData'];
    });
  }
  getUsers() {
    this.employeeService.getAllUsers().subscribe((result) => {
      this.users = result['response'].filter(
        (user: User) => user.type !== 'ESTUDENT'
      );
      console.log('result', this.users);
    });
  }
  updateRecord(timesheet) {
    console.log(timesheet);

    return this.employeeService
      .updateEmployeeTimeSheet(timesheet._id, {
        userId: timesheet.userId,
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
          this.toaster.success(result['message']);
          console.log(result);
        },
        (err) => {
          this.toaster.error(err?.message);
          console.log(err);
        }
      );
  }
}
