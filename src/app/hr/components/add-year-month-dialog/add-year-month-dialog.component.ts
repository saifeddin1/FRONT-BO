import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { YearMonth } from '../../models/yearMonth.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-add-year-month-dialog',
  templateUrl: './add-year-month-dialog.component.html',
  styleUrls: ['./add-year-month-dialog.component.css'],
})
export class AddYearMonthDialogComponent implements OnInit {
  newYearMonthItem: YearMonth;
  userId: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.newYearMonthItem = {
      title: '',
    };
  }

  ngOnInit(): void {}

  createYearMonthItem() {
    console.log('this.newYearMonthItem => ', this.newYearMonthItem);

    this.employeeService
      .createYearMonthItem(this.newYearMonthItem, this.userId)
      .subscribe((result) => {
        console.log('📆✅ createYearMonthItems ~ result', result);
        this.toaster.success(
          `Timesheets for ${this.newYearMonthItem.title} created`
        );
      });
  }
}
