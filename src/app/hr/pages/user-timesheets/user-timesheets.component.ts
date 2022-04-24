import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { Location } from '@angular/common';
import { YearMonth } from '../../models/yearMonth.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-user-timesheets',
  templateUrl: './user-timesheets.component.html',
  styleUrls: ['./user-timesheets.component.css'],
})
export class UserTimesheetsComponent implements OnInit {
  // timesheets: Timesheet[];
  p: number = 0;
  limit: number = 7;
  yearMonth: string;
  yearMonthItems: YearMonth[];
  total: number;
  isLoading = false;
  userId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['#', 'note', 'start', 'hours', 'action'];

  displayedOptionColumns: string[] = ['name', 'action'];
  allTimesheets: Timesheet[];
  constructor(
    private employeeService: EmployeeSummaryService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {
    this.yearMonth = new Date().toISOString().split('T')[0].substring(0, 7);
  }
  timesheets: MatTableDataSource<Timesheet>;

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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.timesheets) {
      this.timesheets.filter = filterValue.trim().toLowerCase();
    }
  }
  getAllTimesheets() {
    this.isLoading = true;
    console.log('this.yearMonth', this.yearMonth);
    this.employeeService
      .getTimesheetsByUserId(
        this.userId,
        this.p,
        this.limit,
        this.yearMonth && this.yearMonth
      )
      .subscribe(
        (result) => {
          console.log(
            '📚 ~  TimesheetsComponent ~ getEmployeeTimeSheets',
            result
          );
          if (
            result['response'][0]['totalData'] &&
            result['response'][0]['totalData'].length
          ) {
            this.timesheets = new MatTableDataSource(
              result['response'][0]['totalData']
            );

            this.timesheets.paginator = this.paginator;
            setTimeout(() => {
              this.paginator.pageIndex = this.p;
              this.paginator.length =
                result['response'][0]['totalCount'][0]['count'] || 0;
            });
            // this.paginator.pageIndex = 0;

            this.allTimesheets = result['response'][0]['totalData'];

            this.total = result['response'][0]['totalCount'][0]['count'] || 0;
            this.isLoading = false;
          } else {
            this.timesheets = new MatTableDataSource();
            this.isLoading = false;
          }
        },
        (error) => {
          console.log(error);
          this.isLoading = false;
        }
      );
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
    this.p = event.pageIndex;
    this.limit = event.pageSize;

    this.getAllTimesheets();
  }
  deleteRecord(tsheet) {
    this.employeeService.deleteTimesheet(tsheet._id).subscribe((result) => {
      console.log('Deleted sheet: ', result);
      this.getAllTimesheets();
    });
  }
}
