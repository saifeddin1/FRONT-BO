import { Component, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ADMIN } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Interview } from '../../models/interview.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'interview-dialog-componenet',
  templateUrl: './interview-dialog.html',
  styleUrls: ['./interview-dialog.component.css'],
})
export class InterviewDialog {
  user: User;
  isAdmin: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Interview,
    public dialog: MatDialog,
    private summaryService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.user = this.data['user'];
    this.isAdmin = this.user.type === ADMIN;
  }
  updateRecord(interview: Interview) {
    this.summaryService.updateInterview(interview._id, interview).subscribe(
      (result) => {
        console.log('✅ ~  updated interview: ', result);
        this.toaster.success('Updated Successfuly');
      },
      (error) => this.toaster.error(error.message)
    );
  }
  ngOnInit(): void {
    console.log(this.data);
  }
}
