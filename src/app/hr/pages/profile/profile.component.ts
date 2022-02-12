import { Component, OnInit } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';
import { Contract } from '../../models/contract.model';
import moment from 'moment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public userFile: File;
  public currentUser = this.summaryService.getUser();
  public isDisabled = this.currentUser?.role !== 'ADMIN';
  public employeeContracts: Contract[];

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
    this.getEmployeeContract();
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
  formatDate(date) {
    let newDate = moment.utc(date)?.format('MMMM Do YYYY');
    return newDate;
  }
  getEmployeeContract() {
    return this.summaryService.getContractsWithSalary().subscribe((result) => {
      this.employeeContracts = result['response'];
      console.log('⚡this.employeeContracts ', this.employeeContracts);
    });
  }
}
