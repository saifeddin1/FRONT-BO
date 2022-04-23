import { Component, OnInit } from '@angular/core';
import { Contract } from '../../models/contract.model';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import moment from 'moment';
import { Interview } from '../../models/interview.model';
import { Timesheet } from '../../models/timesheet.model';
import { ProfileComponent } from '../profile/profile.component';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UsersService } from 'src/app/eidentity/services/users.service';

@Component({
  selector: 'app-emplyee-profile',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  public currUser;

  public files: File[];
  public userFile: File;
  public contract: Contract;
  public interviews: Interview[];

  constructor(
    private summaryService: EmployeeSummaryService,
    private userService: UsersService
  ) {
    this.currUser = this.userService.getCurrentUser();
    console.log(this.currUser);
  }
  ngOnInit(): void {
    // this.getFiles();
    this.getEmployeeFileDetails();
    this.getEmployeeActiveContract();
    // this.getCurrentTimesheet();
    this.getEmployeeInterviews();
    console.log('🤦 EmplyeeProfileComponent ~ currUser', this.currUser);
  }

  formatDate(date) {
    let newDate = moment.utc(date)?.format('MMMM Do YYYY');
    return newDate;
  }

  getFiles() {
    this.summaryService.getFiles().subscribe((result) => {
      this.files = result['response'][0]?.totalData;
      console.log('✅ this.summaryService.getFiles ~ ', this.files);
    });
  }

  getEmployeeFileDetails() {
    this.summaryService.getFileDetails().subscribe((result) => {
      this.userFile = result['response'][0];
      console.log(
        '✅ this.summaryService.getEmployeeFileDetails ~ ',
        this.userFile
      );
    });
  }

  getEmployeeActiveContract() {
    this.summaryService.getActiveContract().subscribe((result) => {
      console.log(
        '⚡   this.summaryService.getActiveContract ~ result',
        result
      );

      this.contract = result['response'];
    });
  }

  getEmployeeInterviews() {
    this.summaryService.getEmployeeUpcomingInterviews().subscribe((result) => {
      this.interviews = result['response'][0]['totalData'];

      console.log('⚡ this.interview', this.interviews);
    });
  }
}
