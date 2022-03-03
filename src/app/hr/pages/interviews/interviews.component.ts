import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { ADMIN, STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { InterviewDialog } from '../../components/interviewDialog/interview-dialog-componenet';
import { Interview } from '../../models/interview.model';
import { JsonFormData } from '../../models/jsonFormData';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css'],
})
export class InterviewsComponent implements OnInit {
  public interviews: Interview[];
  public currentUser;
  // public jsonFormData: JsonFormData;
  public newInterview: Interview;
  isAdmin: boolean;
  users: User[];

  constructor(
    private summaryService: EmployeeSummaryService,
    public dialog: MatDialog,
    private http: HttpClient,
    private toaster: ToasterService
  ) {
    this.currentUser = this.summaryService.getUser();
    this.isAdmin = this.currentUser['type'] === ADMIN;
    this.newInterview = {
      userId: '',
      title: '',
      date: null,
      files: null,
      test: [],
    };
  }
  getUsers() {
    this.summaryService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      console.log('result', this.users);
    });
  }
  ngOnInit(): void {
    this.getEmployeeInterview();
    // this.initializeForm();
    this.getUsers();
    this.getAllnterviews();
  }
  createInterview(data: Interview) {
    const interviewData = new FormData();

    interviewData.append('userId', data['userId']);
    interviewData.append('title', data['title']);
    interviewData.append('files', data['files']);
    interviewData.append('date', new Date(data['date']).toISOString());

    this.summaryService.createInterview(interviewData).subscribe(
      (result) => {
        console.log('⚡ ~  InterviewsComponent ~ createInterview  ', result);
        this.getAllnterviews();
        this.toaster.success('Created Successfully');
      },
      (error) => this.toaster.error(error)
    );
  }
  updateRecord(interview: Interview) {
    this.summaryService.updateInterview(interview._id, interview).subscribe(
      (result) => {
        console.log('✅ ~  updated interview: ', result);
        this.toaster.success('Updated Successfuly');
      },
      (error) => this.toaster.error(error)
    );
  }

  deleteRecord(interview: Interview) {
    this.summaryService.deleteInterview(interview._id).subscribe(
      (result) => {
        console.log('🔴 ~  Deleted interview: ', result);
        this.toaster.success('Deleted Successfuly');
        this.getAllnterviews();
      },
      (error) => this.toaster.error(error)
    );
  }

  formatDate(date) {
    let newDate = moment.utc(date)?.format('D/MM/YYYY');
    return newDate;
  }

  getAllnterviews() {
    this.summaryService.getAllInterviews().subscribe((result) => {
      this.interviews = result['response'][0]['totalData'];
      console.log('⚡ this.interviews', this.interviews);
    });
  }
  getEmployeeInterview() {
    this.summaryService.getInterviews().subscribe((result) => {
      this.interviews = result['response'][0]['totalData'];
      console.log('⚡ this.interviews', this.interviews);
    });
  }
  openDialog(event) {
    let eventId = event?.target?.closest('.id-saver')?.id;

    const dialogRef = this.dialog.open(InterviewDialog, {
      height: '500px',
      width: '600px',
      data: {
        interview: this.interviews.filter(
          (interview) => interview._id === eventId
        )[0],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  // initializeForm() {
  //   this.http
  //     .get('/assets/form-data.json')
  //     .subscribe((formData: JsonFormData) => {
  //       this.jsonFormData = formData;
  //     });
  // }
}
