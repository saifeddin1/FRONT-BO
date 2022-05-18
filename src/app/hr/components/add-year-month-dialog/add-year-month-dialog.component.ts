import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/eidentity/models/user.model';
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
  yearMonthItem: YearMonth;

  operation: string;
  isEditOperation: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.newYearMonthItem = {
      title: '',
    };

    this.operation = data['operation'];
    this.yearMonthItem = data['item'];
    this.isEditOperation = this.operation === 'edit';
  }

  ngOnInit(): void {}

  createYearMonthItem() {
    console.log('this.newYearMonthItem => ', this.newYearMonthItem);

    this.employeeService.createYearMonthItem(this.newYearMonthItem).subscribe(
      (result) => {
        console.log('📆✅ createYearMonthItems ~ result', result);
        this.toaster.success(result['message']);
      },
      (e) => this.toaster.error(e.error.message)
    );
  }

  editYearMonth() {
    this.employeeService
      .editYearMonthItem(this.yearMonthItem._id, this.yearMonthItem)
      .subscribe(
        (result) => {
          console.log('⚡ .edit ym ~ result', result);
          this.toaster.success(result['message']);
        },
        (e) => this.toaster.error(e.error.message)
      );
  }
}
