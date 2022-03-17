import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { ADMIN, STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { AddInterviewDialogComponent } from '../../components/add-interview-dialog/add-interview-dialog.component';
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
  isOpen: boolean = false;
  employeeImgPath: string;
  // public jsonFormData: JsonFormData;

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
  }

  ngOnInit(): void {
    this.isAdmin ? this.getAllnterviews() : this.getEmployeeInterview();
    this.getUsers();
    !this.isAdmin && this.getEmployeFile();
  }
  getUsers() {
    this.summaryService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      console.log('result', this.users);
    });
  }

  getEmployeFile() {
    this.summaryService.getFileDetails().subscribe((result) => {
      console.log(result);

      this.employeeImgPath = result['response'][0]['profile']['image'];
    });
  }

  // updateRecord(interview: Interview) {
  //   this.summaryService.updateInterview(interview._id, interview).subscribe(
  //     (result) => {
  //       console.log('✅ ~  updated interview: ', result);
  //       this.toaster.success('Updated Successfuly');
  //     },
  //     (error) => this.toaster.error(error.message)
  //   );
  // }

  deleteRecord(interview: Interview) {
    this.summaryService.deleteInterview(interview._id).subscribe(
      (result) => {
        console.log('🔴 ~  Deleted interview: ', result);
        this.toaster.success('Deleted Successfuly');
        this.getAllnterviews();
      },
      (error) => this.toaster.error(error.message)
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
      height: '600px',
      width: '700px',
      data: {
        interview: this.interviews.filter(
          (interview) => interview._id === eventId
        )[0],
        user: this.currentUser,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateDialog(event) {
    this.isOpen = true;
    const dialogRef = this.dialog.open(AddInterviewDialogComponent, {
      height: '600px',
      width: '700px',
      data: {
        users: this.users,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.isOpen = false;
      this.getAllnterviews();
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
