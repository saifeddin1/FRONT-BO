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
import { Router } from '@angular/router';
import { AddYearMonthDialogComponent } from '../../components/add-year-month-dialog/add-year-month-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-manage-timesheets',
  templateUrl: './manage-timesheets.component.html',
  styleUrls: ['./manage-timesheets.component.css'],
})
export class ManageTimesheetsComponent implements OnInit {
  timesheet: Timesheet;
  users: User[];
  yearMonthItems: YearMonth[];
  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;
  constructor(
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService,
    private router: Router,
    private dialog: MatDialog
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
    this.getAllYearMonthItems();
  }

  viewTimesheets(employee): void {
    console.log(this.router.url);

    this.router.navigateByUrl(`${this.router.url}/detail/${employee._id}`);
  }
  getUsers() {
    this.employeeService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      console.log('result', this.users);
      this.isLoading = false;
    });
  }
  getAllYearMonthItems() {
    this.employeeService.getAllYearMonthItems().subscribe((result) => {
      console.log('📆📆  getAllYearMonthItems ~ result', result);
      this.yearMonthItems = result['response'][0]['totalData'];
    });
  }
  deleteYearMonth(ymItem) {
    this.employeeService.deleteYearMonthItem(ymItem._id).subscribe((result) => {
      console.log('❌❌ ~ deleteYearMonth ~ result', result);
      this.toaster.success('Successfuly deleted');
      this.getAllYearMonthItems();
    });
  }

  editYearMonth(ymItem) {
    this.employeeService
      .editYearMonthItem(ymItem._id, ymItem)
      .subscribe((result) => {
        console.log('⚡ .edit ym ~ result', result);
        this.toaster.success('Successfuly updated');
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
}
