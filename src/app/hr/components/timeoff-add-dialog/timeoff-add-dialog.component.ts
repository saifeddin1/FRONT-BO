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
  isAddOperation: boolean;
  timeoffRequest: Timeoff;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private summaryService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.isAddOperation = this.data['operation'] === 'add';
    this.timeoffRequest = data['timeoffRequest'];
  }

  ngOnInit(): void {
    console.log(this.timeoffRequest);
  }
  createNotification(body) {
    return this.summaryService.createNotification(body).subscribe((result) => {
      console.log('🔕  ~ result', result);
    });
  }
  updateTimeoffRequest(timeoff) {
    return this.summaryService.updateTimeoff(timeoff._id, timeoff).subscribe(
      (result) => {
        console.log(result);
        this.createNotification({
          userId: result['response']['userId'],
          content: `${timeoff.ref} has been ${timeoff.status}`,
        });
        this.toaster.success(result['message']);
      },
      (error) => this.toaster.error(error['error']['message'])
    );
  }

  requestTimeoff() {
    return this.summaryService
      .createTimeoffRequest(this.data['timeoffRequest'])
      .subscribe(
        (result) => {
          console.log('⚡ ~ ~ requestTimeoff ~ result', result);
          this.toaster.success(result['message']);
        },

        (error) => this.toaster.error(error['error']['message'])
      );
  }
}
