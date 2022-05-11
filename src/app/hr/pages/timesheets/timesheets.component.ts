import { Component, OnInit, ViewChild } from '@angular/core';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { formatDate } from '../../helpers/formatDate';

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TimesheetDeclaration } from '../../models/timesheetDeclaration.model';
import { YearMonth } from '../../models/yearMonth.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AddTimesheetDialogComponent } from '../../components/add-timesheet-dialog/add-timesheet-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from 'src/app/lms/services/user.service';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.css'],
})
export class TimesheetsComponent implements OnInit {
  page: number = 1;

  p: number = 0;
  limit: number = 7;
  total: number;
  isLoading = false;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['note', 'start', 'hours', 'extra', 'action'];
  timesheets: Timesheet[];
  dataSource: MatTableDataSource<Timesheet>;

  displayedOptionColumns: string[] = ['name', 'action'];
  monthlyWorkingHours: number;
  monthlyHoursLimit: number;
  totalHours: number;
  timesheet: Timesheet;
  isDeclared: boolean;
  isApproved: boolean;
  isRejected: boolean;
  yearMonth: string;
  contract: any;
  yearMonthItems: YearMonth[];
  monthlyExtraHours: any;
  currUser: any;
  formatedDate(date) {
    return formatDate(date);
  }
  workignHoursInput: number;
  declaration: TimesheetDeclaration;
  constructor(
    private employeeService: EmployeeSummaryService,
    private userService: UserService,
    private toastr: ToastrService,
    public dialog: MatDialog
  ) {
    this.yearMonth = new Date().toISOString().split('T')[0].substring(0, 7);
    this.currUser = this.userService.user;

    this.totalHours = 0;
    this.dataSource = new MatTableDataSource();
  }

  ngOnInit(): void {
    this.yearMonth = new Date().toISOString().split('T')[0].substring(0, 7);

    this.getEmployeeTimeSheets();
    this.getCurrentDeclaration();
    this.getEmployeeActiveContract();
    this.getAllYearMonthItems();
    this.getExtraHours();
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
    });
  }

  getEmployeeActiveContract() {
    return this.employeeService.getActiveContract().subscribe((result) => {
      this.contract = result['response'];

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
        this.monthlyWorkingHours = result['response'][0]['sum'] || 0;
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
        this.monthlyExtraHours = result['response'][0]['sum'] || 0;
      });
  }

  // checkHours(timesheet) {
  //   if (timesheet.workingHours > 8) {
  //     this.getExtraHours();
  //     timesheet.extraHours = timesheet.workingHours - 8;
  //   } else {
  //     timesheet.extraHours = 0;
  //   }
  // }

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
          this.dataSource = new MatTableDataSource(
            result['response'][0]['totalData']
          );

          this.total = result['response'][0]['totalCount'][0]['count'] || 0;
          this.isApproved = false;
          this.isDeclared = false;
          this.isRejected = false;
          this.employeeService
            .getCurrentDeclaration(parseInt(this.yearMonth.split('-')[1]))
            .subscribe((result) => {
              this.declaration = result['response'];
              this.isDeclared =
                this.declaration && this.declaration?.status === 'declared';
              this.isRejected =
                this.declaration && this.declaration.status === 'rejected';
              this.isApproved =
                this.declaration && this.declaration?.status === 'approved';
              console.log(this.isDeclared, this.isApproved, this.isRejected);
            });
        });
    }
  }
  changePage(event) {
    console.log(event);
    this.p = event.pageIndex;
    this.limit = event.pageSize;

    this.getEmployeeTimeSheets();
  }

  showSuccessToaster(msg) {
    this.toastr.success(msg);
  }

  showErrorToaster(msg) {
    this.toastr.error(msg);
  }

  createDeclaration() {
    return this.employeeService
      .createTimesheetDeclaration({
        userId: this.currUser['_id'],
        month: this.yearMonth.split('-')[1],
      })
      .subscribe(
        (result) => {
          console.log('✅ CREATED', result);
          this.declaration = result['response'];
          this.toastr.success(result['message']);
          this.isDeclared = true;
          this.isApproved = false;
          this.isRejected = false;
        },
        (e) => this.toastr.error(e.error.message)
      );
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

  editTimesheetDialog(element) {
    console.log(element);

    const dialogRef = this.dialog.open(AddTimesheetDialogComponent, {
      height: 'auto',
      width: 'auto',
      data: {
        timesheet: element,
        operation: 'user-edit',
        userId: element?.userId,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getEmployeeTimeSheets();
      this.getMonthlyWorkingHours();
      this.getExtraHours();
    });
  }
}
