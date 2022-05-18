import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { contractType } from '../../models/ContractType.model';
import { File } from '../../models/file.models';
import { Level } from '../../models/Level.models';
import { WorkFrom } from '../../models/WorkFrom.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-employee-dialog',
  templateUrl: './employee-dialog.component.html',
  styleUrls: ['./employee-dialog.component.css'],
})
export class EmployeeDialogComponent implements OnInit {
  employee: File;
  workFromItems: WorkFrom[];
  levels: Level[];
  // contractTypes: contractType[];
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
    this.getAllWorkFromItems();

    // this.getAllContractTypeItems();
    this.getAllLevels();
  }

  updateEmployee(employee: File) {
    console.log(employee);
    this.employeeService
      .updateEmployeeFileAsAdmin(employee._id, employee)
      .subscribe(
        (result) => {
          console.log('✅ updateEmployee ~ result', result);
          this.toaster.success('Successfuly Updated');
        },
        (e) => this.toaster.error(e.error.message)
      );
  }
  getAllWorkFromItems() {
    this.employeeService.getAllWorkFroms().subscribe(
      (result) => {
        console.log('⚡ ~ getAllWorkFromItems ~ result', result);
        this.workFromItems = result['response'][0]['totalData'];
      },
      (e) => this.toaster.error(e.error.message)
    );
  }
  // getAllContractTypeItems() {
  //   this.employeeService.getAllContractTypes().subscribe((result) => {
  //     console.log('⚡ ~ getAllWorkFromItems ~ result', result);
  //     this.contractTypes = result['response'][0]['totalData'];
  //   });
  // }
  getAllLevels() {
    this.employeeService.getAllLevels().subscribe(
      (result) => {
        console.log('⚡ ~ getAllWorkFromItems ~ result', result);
        this.levels = result['response'][0]['totalData'];
      },
      (e) => this.toaster.error(e.error.message)
    );
  }
}
