import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.css'],
})
export class EmployeeDialogComponent implements OnInit {
  employee: File;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: File,
    public dialog: MatDialog,
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.employee = this.data['employee'];
  }
  ngOnInit(): void {
    console.log(this.data);
  }

  updateEmployee(employee: File) {
    console.log(employee);
    this.employeeService
      .updateEmployeeFileAsAdmin(employee._id, employee)
      .subscribe((result) => {
        console.log('✅ updateEmployee ~ result', result);
        this.toaster.success('Successfuly Updated');
      });
  }
}
