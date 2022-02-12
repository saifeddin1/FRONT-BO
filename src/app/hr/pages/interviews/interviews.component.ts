import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { InterviewDialog } from '../../components/interviewDialog/interview-dialog-componenet';
import { Interview } from '../../models/interview.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css'],
})
export class InterviewsComponent implements OnInit {
  public interviews: Interview[];
  public currentUser;

  constructor(
    private summaryService: EmployeeSummaryService,
    public dialog: MatDialog
  ) {
    this.currentUser = this.summaryService.getUser();
  }

  ngOnInit(): void {
    this.getEmployeeInterview();
    console.log(this.currentUser);
    // this.openDialog();
  }

  formatDate(date) {
    let newDate = moment.utc(date)?.format('D/MM/YYYY');
    return newDate;
  }

  getEmployeeInterview() {
    this.summaryService.getInterviews().subscribe((result) => {
      this.interviews = result['response'];
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
}
