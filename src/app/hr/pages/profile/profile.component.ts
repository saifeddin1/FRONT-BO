import { Component, OnInit } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { Contract } from '../../models/contract.model';
import moment from 'moment';
import { formatDate } from '../../helpers/formatDate';
import { ADMIN } from '../../../lms/constants/roles.constant';
import { WorkFrom } from '../../models/WorkFrom.model';
import { Level } from '../../models/Level.models';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public userFile: File;
  public currentUser = this.summaryService.getUser();
  public isDisabled = this.currentUser['type'] !== ADMIN;
  public employeeContract: Contract;
  levels: Level[];
  eventsSubject: Subject<void> = new Subject<void>();
  workFromItems: WorkFrom[];
  emitEventToChild() {
    this.eventsSubject.next();
  }

  public profile = {
    image: '',
    // position: '',
    proEmail: '',
    phone: '',
    address: '',
    // jobType: '',
    // workFrom: '',
    // seniorityLevel: ''
  };
  constructor(
    private summaryService: EmployeeSummaryService,
    private toastr: ToastrService
  ) {
    this.userFile = {
      userId: this.currentUser?._id,
      userRef: '',
      timeOffBalance: '',
      profile: {
        image: '',
        position: '',
        fullname: '',
        proEmail: '',
        phone: '',
        address: '',
        jobType: '',
        workFrom: '',
        seniorityLevel: '',
      },
    };
  }

  ngOnInit(): void {
    this.getEmployeeFileDetails();
    this.getEmployeeActiveContract();
    this.getAllWorkFromItems();
    this.getAllLevels();
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
  getAllWorkFromItems() {
    this.summaryService.getAllWorkFroms().subscribe((result) => {
      console.log('⚡ ~ getAllWorkFromItems ~ result', result);
      this.workFromItems = result['response'][0]['totalData'];
    });
  }
  showSuccessToaster() {
    this.toastr.success('Success');
  }

  showErrorToaster() {
    this.toastr.error('Something went wrong.');
  }
  getAllLevels() {
    this.summaryService.getAllLevels().subscribe((result) => {
      console.log('⚡ ~ getAllWorkFromItems ~ result', result);
      this.levels = result['response'][0]['totalData'];
    });
  }
  updateEmployee(file) {
    this.summaryService
      .updateProfile(file)
      .pipe(
        catchError((err) => {
          console.log('Handling error locally and rethrowing it...', err);
          this.showErrorToaster();
          return throwError(err);
        })
      )
      .subscribe((result) => {
        console.log('🤦‍♂️ ~  ProfileComponent ~ .subscribe ~ result', result);

        console.log('after', this.userFile);
        this.showSuccessToaster();
      });
  }
  formatedDate(date) {
    return formatDate(date);
  }
  getEmployeeActiveContract() {
    let today = new Date();
    return this.summaryService.getContractsWithSalary().subscribe((result) => {
      this.employeeContract = result['response'].filter(
        (c) => new Date(c.endDate) >= new Date(today)
      )[0];
      console.log(this.employeeContract);
    });
  }
}
