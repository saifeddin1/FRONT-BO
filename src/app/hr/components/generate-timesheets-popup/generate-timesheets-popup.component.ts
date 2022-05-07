import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-generate-timesheets-popup',
  templateUrl: './generate-timesheets-popup.component.html',
  styleUrls: ['./generate-timesheets-popup.component.css'],
})
export class GenerateTimesheetsPopupComponent implements OnInit {
  userId: string;
  myControl = new FormControl();
  filteredOptions: Observable<User[]>;
  yearMonth: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.yearMonth = data['yearMonth'];
  }

  ngOnInit(): void {
    if (this.userId && this.userId !== '') this.myControl.disable();
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.data['users'].slice()))
    );
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

  generateTimesheets() {
    this.toaster.info('Working ....');
    this.employeeService
      .generateTimesheets(this.userId, this.yearMonth)
      .subscribe(
        (result) => {
          this.toaster.success(result['message'], 3000);
        },
        (e) => this.toaster.error(e.error.message)
      );
  }
}
