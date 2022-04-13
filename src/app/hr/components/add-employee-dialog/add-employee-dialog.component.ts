import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { UsersService } from 'src/app/eidentity/services/users.service';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { UserService } from 'src/app/lms/services/user.service';
import { File } from '../../models/file.models';
import { Level } from '../../models/Level.models';
import { WorkFrom } from '../../models/WorkFrom.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-add-employee-dialog',
  templateUrl: './add-employee-dialog.component.html',
  styleUrls: ['./add-employee-dialog.component.css'],
})
export class AddEmployeeDialogComponent implements OnInit {
  newEmployee: File;
  myControl = new FormControl();
  filteredOptions: Observable<User[]>;
  workFromItems: WorkFrom[];
  levels: Level[];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: User[],
    private employeeService: EmployeeSummaryService,
    private userService: UsersService
  ) {
    this.newEmployee = {
      userId: '',
      userRef: '',
      timeOffBalance: '',
      profile: {
        image: '',
        position: '',
        proEmail: '',
        fullname: '',
        phone: '',
        address: '',
        jobType: '',
        workFrom: '',
        seniorityLevel: '',
        description: '',
      },
    };
    if (this.newEmployee.userId !== '') this.myControl.disable();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.data['users'].slice()))
    );
    this.getAllWorkFromItems();
    this.getAllLevels();
  }
  displayFn(id: string) {
    if (!id) return '';

    let index = this.data['users'].findIndex((user) => user._id === id);
    return this.data['users'][index].username;
  }
  private _filter(username: string): User[] {
    const filterValue = username.toLowerCase();

    return this.data['users'].filter((option) =>
      option?.username.toLowerCase().includes(filterValue)
    );
  }
  addEmployee() {
    this.employeeService
      .createEmployeeFile(this.newEmployee)
      .subscribe((result) => {
        console.log('⚡ addEmployee ~ result', result);
      });
  }
  getAllLevels() {
    this.employeeService.getAllLevels().subscribe((result) => {
      console.log('⚡ ~ getAllWorkFromItems ~ result', result);
      this.levels = result['response'][0]['totalData'];
    });
  }
  getAllWorkFromItems() {
    this.employeeService.getAllWorkFroms().subscribe((result) => {
      console.log('⚡ ~ getAllWorkFromItems ~ result', result);
      this.workFromItems = result['response'][0]['totalData'];
    });
  }
}
