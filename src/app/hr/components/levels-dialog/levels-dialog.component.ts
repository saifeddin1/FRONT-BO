import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { contractType } from '../../models/ContractType.model';
import { Level } from '../../models/Level.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-levels-dialog',
  templateUrl: './levels-dialog.component.html',
  styleUrls: ['./levels-dialog.component.css'],
})
export class LevelsDialogComponent implements OnInit {
  operation: string;
  isEditOperation: boolean;
  level: Level;
  isAddOperation: boolean;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private employeeService: EmployeeSummaryService,
    private toaster: ToasterService
  ) {
    this.level = data['item'];
    this.operation = data['operation'];
    this.isEditOperation = this.operation === 'edit';
    this.isAddOperation = this.operation === 'add';
  }

  ngOnInit(): void {}

  createLevel() {
    this.employeeService.createLevel(this.level).subscribe((result) => {
      console.log(result);
      this.toaster.success(result['message']);
    });
  }

  editLevel() {
    this.employeeService
      .editLevel(this.level._id, this.level)
      .subscribe((result) => {
        console.log(result);
        this.toaster.success(result['message']);
      });
  }
}
