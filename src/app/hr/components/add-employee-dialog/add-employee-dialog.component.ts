import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/eidentity/services/users.service';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { UserService } from 'src/app/lms/services/user.service';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.css'],
})
export class AddEmployeeDialogComponent implements OnInit {
  newEmployee: File;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User[],
    private employeeService: EmployeeSummaryService,
    private userService: UsersService
  ) {
    this.newEmployee = {
      userId: '',
      userRef: '',
      timeOffBalance: 0,
      profile: {
        image: '',
        position: '',
        proEmail: '',
        phone: 0,
        address: '',
        jobType: '',
        workFrom: '',
        seniorityLevel: '',
        description: '',
      },
    };
  }
  ngOnInit(): void {
    console.log(this.data);
  }

  addEmployee() {
    this.employeeService
      .createEmployeeFile(this.newEmployee)
      .subscribe((result) => {
        console.log('⚡ addEmployee ~ result', result);
      });
  }
}
