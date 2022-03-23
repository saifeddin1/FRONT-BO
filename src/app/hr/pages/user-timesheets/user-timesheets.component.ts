import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { Location } from '@angular/common';
import { YearMonth } from '../../models/yearMonth.model';
@Component({
  selector: 'app-user-timesheets',
  templateUrl: './user-timesheets.component.html',
  styleUrls: ['./user-timesheets.component.css'],
})
export class UserTimesheetsComponent implements OnInit {
  timesheets: Timesheet[];
  p: number = 1;
  limit: number = 7;
  yearMonth: string;
  yearMonthItems: YearMonth[];
  total: number;
  userId: string;
  constructor(
    private employeeService: EmployeeSummaryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.yearMonth = new Date().toISOString().split('T')[0].substring(0, 7);
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.userId = param.userId;
    });
    this.getAllTimesheets();
    this.getAllYearMonthItems();
  }
  getAllYearMonthItems() {
    this.employeeService.getAllYearMonthItems().subscribe((result) => {
      console.log('📆📆  getAllYearMonthItems ~ result', result);
      this.yearMonthItems = result['response'][0]['totalData'];
    });
  }
  goBack() {
    this.location.back();
  }
 
  getAllTimesheets() {
    console.log('this.yearMonth', this.yearMonth);
    this.employeeService
      .getTimesheetsByUserId(
        this.userId,
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
  updateRecord(timesheet) {
    console.log(timesheet);

    this.employeeService
      .updateTimeSheet(timesheet._id, {
        userId: timesheet.userId,
        note: timesheet.note,
        workingHours: timesheet.workingHours,
        date: new Date(timesheet.date),
      })

      .subscribe((result) => {
        console.log(result);
      });
  }

  changePage(event) {
    console.log(event);
    this.p = event;
    this.getAllTimesheets();
  }
  deleteRecord(tsheet) {
    this.employeeService.deleteTimesheet(tsheet._id).subscribe((result) => {
      console.log('Deleted sheet: ', result);
      this.getAllTimesheets();
    });
  }
}
