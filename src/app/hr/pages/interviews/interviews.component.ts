import { Component, OnInit } from '@angular/core';
import moment from 'moment';
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

  constructor(private summaryService: EmployeeSummaryService) {
    this.currentUser = this.summaryService.getUser();
  }

  ngOnInit(): void {
    this.getEmployeeInterview();
    console.log(this.currentUser);
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
}
