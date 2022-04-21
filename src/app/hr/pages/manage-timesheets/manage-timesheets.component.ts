import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';
import { User } from 'src/app/lms/models/user.model';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { YearMonth } from '../../models/yearMonth.model';
import { Router } from '@angular/router';
import { AddYearMonthDialogComponent } from '../../components/add-year-month-dialog/add-year-month-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-manage-timesheets',
  templateUrl: './manage-timesheets.component.html',
  styleUrls: ['./manage-timesheets.component.css'],
})
export class ManageTimesheetsComponent implements OnInit, AfterViewInit {
  timesheet: Timesheet;
  users: User[];
  yearMonthItems: YearMonth[];
  p: number = 1;
  limit: number = 7;
  total: number = 7;
  displayedColumns: string[] = ['#', 'USERNAME', 'EMAIL', 'ROLE', 'ACTION'];

  displayedOptionColumns: string[] = ['name', 'action'];
  yearMonthdisplayedColumns: string[] = ['title', 'ACTION'];
  yearMonths: MatTableDataSource<YearMonth>;
  yearMonthdisplayedOptionColumns: string[] = ['name', 'action'];

  dataSource: MatTableDataSource<any>;
  isLoading: boolean = true;
  constructor(
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService,
    private router: Router,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer
  ) {
    this.getUsers();
    // this.dataSource = new MatTableDataSource<any>();
    this.timesheet = {
      userId: '',
      date: null,
      note: '',
      workingHours: 0,
    };
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  formatedDate(date) {
    return formatDate(date);
  }
  ngOnInit(): void {
    console.log('on init');
    this.getUsers();

    this.getAllYearMonthItems();
  }
  ngAfterViewInit(): void {
    console.log('after init');

    // console.log(this.dataSource);

    // // this.paginator.pageIndex = 0;
    // this.dataSource.sort = this.sort;
  }
  changePage(event) {
    console.log(event);
    this.p = event;
    this.getUsers();
  }
  viewTimesheets(user): void {
    console.log(this.router.url);

    this.router.navigateByUrl(`${this.router.url}/detail/${user._id}`);
  }

  getUsers() {
    this.isLoading = true;
    this.employeeService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      this.dataSource = new MatTableDataSource(result['response']);

      this.paginator.pageIndex = 0;
      this.dataSource.paginator = this.paginator;
      this.total = this.users?.length || 0;
      console.log('result', this.users);
      this.isLoading = false;
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
  getAllYearMonthItems() {
    this.employeeService.getAllYearMonthItems().subscribe((result) => {
      console.log('📆📆  getAllYearMonthItems ~ result', result);
      this.yearMonthItems = result['response'][0]['totalData'];
      this.yearMonths = new MatTableDataSource(
        result['response'][0]['totalData']
      );
    });
  }
  deleteYearMonth(ymItem) {
    this.employeeService.deleteYearMonthItem(ymItem._id).subscribe((result) => {
      console.log('❌❌ ~ deleteYearMonth ~ result', result);
      this.toaster.success('Successfuly deleted');
      this.getAllYearMonthItems();
    });
  }

  openUpdateDialog(event, operation, item) {
    const dialogRef = this.dialog.open(AddYearMonthDialogComponent, {
      height: 'auto',
      width: '500px',
      data: {
        operation: operation,
        item: item,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAllYearMonthItems();
    });
  }

  openCreateDialog(event) {
    // let employee_id = event.target.id;
    // console.log('employee_id => ', employee_id);
    const dialogRef = this.dialog.open(AddYearMonthDialogComponent, {
      height: 'auto',
      width: '500px',
      data: {
        users: this.users,
        // id: employee_id,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAllYearMonthItems();
    });
  }
  announceSortChange(sortState: Sort) {
    // This example uses English messages. If your application supports
    // multiple language, you would internationalize these strings.
    // Furthermore, you can customize the message to add additional
    // details about the values being sorted.
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
