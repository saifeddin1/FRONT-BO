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

@Component({
  selector: 'app-emplyee-profile',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  constructor(private summaryService: EmployeeSummaryService) {}
  public currUser = this?.summaryService?.getUser();

  public files: File[];
  public userFile: File;
  public contract: Contract;
  public interviews: Interview[];
  timesheet: Timesheet = {
    userId: this.currUser['_id'],
    note: '',
    date: null,
    workingHours: 0,
  };
  ngOnInit(): void {
    // this.getFiles();
    this.getEmployeeFileDetails();
    this.getEmployeeActiveContract();
    // this.getCurrentTimesheet();
    this.getEmployeeInterviews();
    console.log('🤦 EmplyeeProfileComponent ~ currUser', this.currUser);
  }
  // getCurrentTimesheet() {
  //   let today = new Date().toISOString().split('T')[0];
  //   console.log(
  //     '⚡ ~ file: timesheets.component.ts ~ line 45 ~ TimesheetsComponent ~ getCurrentTimesheet ~ today',
  //     today
  //   );
  //   return this.summaryService
  //     .getEmployeeCurrentTimeSheet(today)
  //     .subscribe((result) => {
  //       this.timesheet = result['response'];
  //       console.log(
  //         '⚡  TimesheetsComponent ~ getCurrentTimesheet ~ result',
  //         result['response']
  //       );
  //     });
  // }
  updateRecord(timesheet) {
    console.log(timesheet);

    return this.summaryService
      .updateEmployeeTimeSheet(timesheet._id, {
        note: timesheet.note,
        workingHours: timesheet.workingHours,
        date: timesheet.date,
      })
      .pipe(
        catchError((err) => {
          return throwError(err['error']);
        })
      )
      .subscribe(
        (result) => {
          console.log(result);
        },
        (err) => {
          console.log(err);
        }
      );
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

    // let today = new Date();
    // return this.summaryService.getContractsWithSalary().subscribe((result) => {
    //   this.contract = result['response'].filter(
    //     (c) => new Date(c.endDate) >= new Date(today)
    //   )[0];
    //   console.log(this.contract);
    // });
  }

  getEmployeeInterviews() {
    let today = new Date();
    this.summaryService.getInterviews().subscribe((result) => {
      this.interviews = result['response'][0]['totalData'].filter(
        (intr) => new Date(intr.date) >= new Date(today)
      );

      console.log('⚡ this.interview', this.interviews);
    });
  }
}
