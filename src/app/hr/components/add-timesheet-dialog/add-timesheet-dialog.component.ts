import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Timesheet } from '../../models/timesheet.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-add-timesheet-dialog',
  templateUrl: './add-timesheet-dialog.component.html',
  styleUrls: ['./add-timesheet-dialog.component.css'],
})
export class AddTimesheetDialogComponent implements OnInit {
  isAddOperation: boolean;
  isEditOperation: boolean;
  timesheet: Timesheet;
  myControl = new FormControl();

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.isAddOperation = this.data['operation'] === 'add';
    this.isEditOperation = this.data['operation'] === 'edit';
    this.timesheet = this.data['timesheet'];
  }

  ngOnInit(): void {
    if (this.timesheet.userId && this.timesheet.userId !== '')
      this.myControl.disable();
  }

  createTimesheet() {
    this.employeeService.createEmployeeTimeSheet(this.timesheet).subscribe(
      (result) => {
        this.toaster.success(result['message']);
      },
      (e) => this.toaster.error(e.error.message)
    );
  }

  updateRecord() {
    this.employeeService
      .updateTimeSheet(this.timesheet._id, {
        userId: this.timesheet.userId,
        note: this.timesheet.note,
        workingHours: this.timesheet.workingHours,
        date: new Date(this.timesheet.date),
      })

      .subscribe(
        (result) => {
          console.log(result);
          this.toaster.success(result['message']);
        },

        (e) => this.toaster.error(e.error.message)
      );
  }
}
