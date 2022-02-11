import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { Interview } from '../../models/interview.model';

@Component({
  selector: 'interview-dialog-componenet',
  templateUrl: './interview-dialog.html',
})
export class InterviewDialog {
  // public interviews: Interview[];

  constructor(
    // private summaryService: EmployeeSummaryService,
    @Inject(MAT_DIALOG_DATA) public data: Interview,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.data);

    // this.getEmployeeInterview();
  }

  // getEmployeeInterview() {
  //   this.summaryService.getInterviews().subscribe((result) => {
  //     this.interviews = result['response'];
  //     console.log('⚡ this.interviews', this.interviews);
  //   });
  // }
}
