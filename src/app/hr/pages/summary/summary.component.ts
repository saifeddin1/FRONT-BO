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
import { UserService } from 'src/app/lms/services/user.service';
import { ADMIN, EMPLOYEE, HR } from 'src/app/lms/constants/roles.constant';
import { environment } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-emplyee-profile',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  public currUser;
  isAdmin: boolean;
  extraHours: number;
  WorkedHours: number;
  public files: File[];
  public userFile: File;
  public contract: Contract;
  public interviews: Interview[];
  contractEnded: boolean;
  isHr: boolean;
  displayedColumns: string[] = [
    'ref',
    'startdate',
    'endDate',
    'status',
    'type',
    // 'action',
  ];
  displayedOptionColumns: string[] = ['name', 'action'];

  isEmployee: boolean;
  allActive: MatTableDataSource<Contract[]>;
  allActiveCount: any;
  cdiActive: any;
  cddActive: any;
  employeesCount: number;
  civpActive: any;
  newEmployeesCount: any;
  percentNew: number;
  newEmployees: File[];
  constructor(
    private summaryService: EmployeeSummaryService,
    private userService: UserService
  ) {
    this.employeesCount = 0;
    this.currUser = this.userService.user;
    this.contractEnded = false;
    this.isAdmin = this.currUser.type === ADMIN;
    this.isHr = this.currUser.type === HR;
    this.isEmployee = this.currUser.type === EMPLOYEE;
    console.log(this.currUser);
    this.extraHours = 0;
    this.WorkedHours = 0;
    this.getMonthlyHours();
    (this.isHr || this.isEmployee) && this.getExtraHours();
  }
  ngOnInit(): void {
    // this.getFiles();
    this.getEmployeeFileDetails();
    // this.getCurrentTimesheet();
    this.isAdmin
      ? this.getAllActiveContracts()
      : this.getEmployeeActiveContract();
    this.getEmployeeInterviews();
    this.getFiles();
    console.log('🤦 EmplyeeProfileComponent ~ currUser', this.currUser);
  }

  formatDate(date) {
    let newDate = moment.utc(date)?.format('MMMM Do YYYY');
    return newDate;
  }
  getMonthlyHours() {
    this.summaryService
      .getHoursMonthly(new Date().toISOString(), 'workingHours')
      .subscribe((result) => {
        this.WorkedHours = result['response'][0]['sum'] || 0;
        console.log('⚡ ~ file:   ~ WorkedHours', this.WorkedHours);
      });
  }

  getExtraHours() {
    this.summaryService
      .getHoursMonthly(new Date().toISOString(), 'extraHours')
      .subscribe((result) => {
        this.extraHours = result['response'][0]['sum'] || 0;
      });
  }
  getFiles() {
    this.summaryService.getFiles('').subscribe((result) => {
      let res = result['response'][0]['totalData'];
      res.forEach((element) => {
        if (element.profile.image) {
          element.profile.image = `${environment.HRApi}/files/documents/${element.profile.image}`;
        }
      });
      this.files = res;
      console.log('⚡ ~.files', this.files);
      this.newEmployees = this.files?.filter(
        (file) =>
          new Date(file.createdAt.split('T')[0]) >=
          new Date(new Date().toISOString().split('T')[0])
      );

      this.newEmployeesCount = this.newEmployees?.length;
      console.log('⚡ files?.filter ~ this.', this.newEmployees);
      this.employeesCount = result['response'][0]['totalCount'][0]['count'];
      this.percentNew = Math.trunc(
        (this.newEmployeesCount * 100) / this.employeesCount
      );
    });
  }

  getEmployeeFileDetails() {
    this.summaryService.getFileDetails().subscribe((result) => {
      let res = result['response'][0];

      if (res.profile.image) {
        res.profile.image = `${environment.HRApi}/files/documents/${res.profile.image}`;
      }

      this.userFile = res;
      console.log(
        '✅ this.summaryService.getEmployeeFileDetails ~ ',
        this.userFile
      );
    });
  }

  getEmployeeActiveContract() {
    this.summaryService.getActiveContract().subscribe(
      (result) => {
        console.log(
          '⚡   this.summaryService.getActiveContract ~ result',
          result
        );
        if (result['response']) {
          this.contract = result['response'];
          new Date(this.contract?.endDate) <= new Date()
            ? (this.contractEnded = true)
            : (this.contractEnded = false);
        } else {
          this.contract = {};
        }
      },
      (e) => console.log(e.error.message)
    );
  }

  getAllActiveContracts() {
    this.summaryService.getAllActiveContracts().subscribe(
      (result) => {
        console.log('🎉getActiveContracts ', result);
        if (result['response'][0]['totalData']) {
          this.allActive = new MatTableDataSource(
            result['response'][0]['totalData']
          );
          this.cdiActive = result['response'][0]['totalData'].filter(
            (el) => el?.contractType.toUpperCase() === 'CDI'
          )?.length;
          this.cddActive = result['response'][0]['totalData'].filter(
            (el) => el?.contractType.toUpperCase() === 'CDD'
          )?.length;
          this.civpActive = result['response'][0]['totalData'].filter(
            (el) => el?.contractType.toUpperCase() === 'CIVP'
          )?.length;
        } else {
          this.allActive = new MatTableDataSource();
        }
      },
      (e) => console.log(e.error.message)
    );
  }

  getEmployeeInterviews() {
    this.summaryService.getEmployeeUpcomingInterviews().subscribe((result) => {
      this.interviews = result['response'][0]['totalData'];

      console.log('⚡ this.interview', this.interviews);
    });
  }
}
