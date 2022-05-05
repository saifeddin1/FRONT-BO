import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { AddYearMonthDialogComponent } from '../../components/add-year-month-dialog/add-year-month-dialog.component';
import { GenerateTimesheetsPopupComponent } from '../../components/generate-timesheets-popup/generate-timesheets-popup.component';
import { YearMonth } from '../../models/yearMonth.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-year-months',
  templateUrl: './year-months.component.html',
  styleUrls: ['./year-months.component.css'],
})
export class YearMonthsComponent implements OnInit {
  users: User[];
  yearMonthItems: YearMonth[];
  yearMonthdisplayedColumns: string[] = ['title', 'ACTION'];
  yearMonths: MatTableDataSource<YearMonth>;
  yearMonthdisplayedOptionColumns: string[] = ['name', 'action'];

  isLoading: boolean = true;
  total: number;
  constructor(
    private employeeService: EmployeeSummaryService,
    private dialog: MatDialog,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.getUsers();

    this.getAllYearMonthItems();
  }

  getUsers() {
    this.isLoading = true;
    this.employeeService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];

      this.total = this.users?.length || 0;
      console.log('result', this.users);
      this.isLoading = false;
    });
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
    const dialogRef = this.dialog.open(AddYearMonthDialogComponent, {
      height: 'auto',
      width: '500px',
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAllYearMonthItems();
    });
  }

  generateTimesheetsDialog(event: any, item: YearMonth) {
    console.log(item);

    const dialogRef = this.dialog.open(GenerateTimesheetsPopupComponent, {
      height: 'auto',
      width: '500px',
      data: {
        users: this.users,
        yearMonth: item,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
