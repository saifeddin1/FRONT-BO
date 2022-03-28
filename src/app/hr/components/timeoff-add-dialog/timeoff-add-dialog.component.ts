import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Timeoff } from '../../models/timeoff.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-timeoff-add-dialog',
  templateUrl: './timeoff-add-dialog.component.html',
  styleUrls: ['./timeoff-add-dialog.component.css'],
})
export class TimeoffAddDialogComponent implements OnInit {
  newTimeoffRequest: Timeoff;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private summaryService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.newTimeoffRequest = {
      startDate: null,
      offDays: 0,
    };
  }

  ngOnInit(): void {}
  requestTimeoff() {
    console.log(this.newTimeoffRequest);

    return this.summaryService
      .createTimeoffRequest(this.newTimeoffRequest)
      .subscribe(
        (result) => {
          console.log('⚡ ~ ~ requestTimeoff ~ result', result);
          this.toaster.success(result['message']);
        },

        (error) => this.toaster.error(error['error']['message'])
      );
  }
}
