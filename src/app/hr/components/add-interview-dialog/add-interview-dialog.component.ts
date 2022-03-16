import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Interview } from '../../models/interview.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-add-interview-dialog',
  templateUrl: './add-interview-dialog.component.html',
  styleUrls: ['./add-interview-dialog.component.css'],
})
export class AddInterviewDialogComponent implements OnInit {
  newInterview: Interview;
  users: User[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private summaryService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.newInterview = {
      userId: '',
      title: '',
      date: null,
      files: null,
      test: [
        {
          title: '',
          description: '',
          url: '',
        },
      ],
    };
    this.users = data['users'];
  }

  ngOnInit(): void {
    console.log(this.data);
  }
  createInterview(data: Interview) {
    const interviewData = new FormData();

    // interviewData.append('userId', data['userId']);
    // interviewData.append('title', data['title']);
    // interviewData.append('files', data['files']);
    // interviewData.append('date', new Date(data['date']).toISOString());

    this.summaryService.createInterview(data).subscribe(
      (result) => {
        console.log('⚡ ~  InterviewsComponent ~ createInterview  ', result);
        // this.getAllnterviews();
        this.toaster.success('Created Successfully');
      },
      (error) => this.toaster.error(error.message)
    );
  }
}
