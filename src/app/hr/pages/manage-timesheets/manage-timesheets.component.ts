import { Component, OnInit } from '@angular/core';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';
import { User } from 'src/app/lms/models/user.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { YearMonth } from '../../models/yearMonth.model';
interface TimesheetCollection {
  user: User;
  yearMonth: string;
  createdAt: Date;
}
@Component({
  selector: 'app-manage-timesheets',
  templateUrl: './manage-timesheets.component.html',
  styleUrls: ['./manage-timesheets.component.css'],
})
export class ManageTimesheetsComponent implements OnInit {
  timesheet: Timesheet;
  users: User[];
  userId: string;
  collections: TimesheetCollection[];
  newYearMonthItem: YearMonth;
  yearMonthItems: YearMonth[];
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
    this.newYearMonthItem = {
      title: '',
    };
  }

  formatedDate(date) {
    return formatDate(date);
  }
  ngOnInit(): void {
    this.getUsers();

    this.getAllYearMonthItems();
  }

  getUsers() {
    this.employeeService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      console.log('result', this.users);
    });
  }
  updateRecord(timesheet) {
    console.log(timesheet);

    this.employeeService
      .updateTimeSheet(timesheet._id, {
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

  getAllYearMonthItems() {
    this.employeeService.getAllYearMonthItems().subscribe((result) => {
      console.log('📆📆  getAllYearMonthItems ~ result', result);
      this.yearMonthItems = result['response'][0]['totalData'];
    });
  }

  createYearMonthItem() {
    this.employeeService
      .createYearMonthItem(this.newYearMonthItem, this.userId)
      .subscribe((result) => {
        console.log('📆✅ createYearMonthItems ~ result', result);
        this.collections.push({
          user: this.users.filter((user) => user._id === this.userId)[0],
          yearMonth: this.newYearMonthItem?.title,
          createdAt: new Date(),
        });
      });
    }
}
