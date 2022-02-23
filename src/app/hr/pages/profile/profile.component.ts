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

  eventsSubject: Subject<void> = new Subject<void>();

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
  ) {}

  ngOnInit(): void {
    this.getEmployeeFileDetails();
    this.getEmployeeActiveContract();
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

  showSuccessToaster() {
    this.toastr.success('Success');
  }

  showErrorToaster() {
    this.toastr.error('Something went wrong.');
  }

  updateEmployee() {
    this.summaryService
      .updateProfile(this.profile)
      .pipe(
        catchError((err) => {
          console.log('Handling error locally and rethrowing it...', err);
          this.showErrorToaster();
          return throwError(err);
        })
      )
      .subscribe((result) => {
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
