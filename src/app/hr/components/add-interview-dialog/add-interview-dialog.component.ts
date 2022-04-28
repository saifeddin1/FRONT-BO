import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { Interview } from '../../models/interview.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-add-interview-dialog',
  templateUrl: './add-interview-dialog.component.html',
  styleUrls: ['./add-interview-dialog.component.css'],
})
export class AddInterviewDialogComponent implements OnInit {
  newInterview: Interview;
  users: User[];
  myControl = new FormControl();
  filteredOptions: Observable<User[]>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private summaryService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.newInterview = this.data['interview'];
    this.users = this.data['users'];
    if (this.newInterview.userId !== '') this.myControl.disable();
  }

  ngOnInit(): void {
    console.log(this.data);
    this.newInterview = this.data['interview'];

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.users.slice()))
    );
  }
  displayFn(id: string) {
    if (!id) return '';

    let index = this.users.findIndex((user) => user._id === id);
    return this.users[index].username;
  }
  private _filter(username: string): User[] {
    const filterValue = username.toLowerCase();

    return this.users.filter((option) =>
      option?.username.toLowerCase().includes(filterValue)
    );
  }
  createInterview(data: Interview) {
    // const interviewData = new FormData();

    // interviewData.append('userId', data['userId']);
    // interviewData.append('title', data['title']);
    // interviewData.append('files', data['files']);
    // interviewData.append('date', new Date(data['date']).toISOString());

    this.summaryService.createInterview(data).subscribe(
      (result) => {
        console.log('⚡ ~  InterviewsComponent ~ createInterview  ', result);
        // this.getAllnterviews();
        this.toaster.success('Created Successfully');
      },
      (error) => this.toaster.error(error.message)
    );
  }
}
