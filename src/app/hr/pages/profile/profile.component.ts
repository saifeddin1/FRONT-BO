import { Component, OnInit } from '@angular/core';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public userFile: File;

  constructor(private summaryService: EmployeeSummaryService) {}

  ngOnInit(): void {
    this.getEmployeeFileDetails();
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
}
