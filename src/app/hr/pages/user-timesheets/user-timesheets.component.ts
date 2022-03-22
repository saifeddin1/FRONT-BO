import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-user-timesheets',
  templateUrl: './user-timesheets.component.html',
  styleUrls: ['./user-timesheets.component.css'],
})
export class UserTimesheetsComponent implements OnInit {
  timesheets: Timesheet[];
  p: number = 1;
  limit: number = 7;
  total: number;
  userId: string;
  constructor(
    private employeeService: EmployeeSummaryService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.userId = param.userId;
    });
    this.getAllTimesheets();
  }
  getAllTimesheets() {
    this.employeeService
      .getTimesheetsByUserId(this.userId, this.p, this.limit)
      .subscribe((result) => {
        this.timesheets = result['response'][0]['totalData'];
        this.total = result['response'][0]['totalCount'][0]['count'];
        console.log(
          '⚡ ~ file: user-timesheets.component.ts ~ line 33 ~ UserTimesheetsComponent ~ .subscribe ~ this.timesheets',
          this.timesheets
        );
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
