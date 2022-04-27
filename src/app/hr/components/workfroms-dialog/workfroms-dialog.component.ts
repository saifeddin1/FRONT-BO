import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { WorkFrom } from '../../models/WorkFrom.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-workfroms-dialog',
  templateUrl: './workfroms-dialog.component.html',
  styleUrls: ['./workfroms-dialog.component.css'],
})
export class WorkfromsDialogComponent implements OnInit {
  operation: string;
  isEditOperation: boolean;
  workfrom: WorkFrom;
  isAddOperation: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.workfrom = data['item'];
    this.operation = data['operation'];
    this.isEditOperation = this.operation === 'edit';
    this.isAddOperation = this.operation === 'add';
  }

  ngOnInit(): void {}

  createWorkfrom() {
    this.employeeService.createWorkFrom(this.workfrom).subscribe((result) => {
      console.log(result);
      this.toaster.success(result['message']);
    });
  }

  editWorkFrom() {
    this.employeeService
      .editWorkFrom(this.workfrom._id, this.workfrom)
      .subscribe((result) => {
        console.log(result);
        this.toaster.success(result['message']);
      });
  }
}
