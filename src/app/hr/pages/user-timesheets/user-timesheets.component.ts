import { Component, OnInit } from '@angular/core';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-user-timesheets',
  templateUrl: './user-timesheets.component.html',
  styleUrls: ['./user-timesheets.component.css'],
})
export class UserTimesheetsComponent implements OnInit {
  timesheets: Timesheet[];
  constructor(private employeeService: EmployeeSummaryService) {}

  ngOnInit(): void {
    this.getAllTimesheets();
  }
  getAllTimesheets() {
    this.employeeService.getAllSheets().subscribe((result) => {
      this.timesheets = result['response'][0]['totalData'];
    });
  }

  deleteRecord(tsheet) {
    this.employeeService.deleteTimesheet(tsheet._id).subscribe((result) => {
      console.log('Deleted sheet: ', result);
      this.getAllTimesheets();
    });
  }
}
