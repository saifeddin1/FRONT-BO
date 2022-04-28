import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { ContractTypesDialogComponent } from '../../components/contract-types-dialog/contract-types-dialog.component';
import { LevelsDialogComponent } from '../../components/levels-dialog/levels-dialog.component';
import { WorkfromsDialogComponent } from '../../components/workfroms-dialog/workfroms-dialog.component';
import { contractType } from '../../models/ContractType.model';
import { Level } from '../../models/Level.models';
import { WorkFrom } from '../../models/WorkFrom.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-contract-settings',
  templateUrl: './contract-settings.component.html',
  styleUrls: ['./contract-settings.component.css'],
})
export class ContractSettingsComponent implements OnInit {
  contractTypes: MatTableDataSource<contractType>;
  contractTypesdisplayedColumns: string[] = ['title', 'ACTION'];
  contractTypesdisplayedOptionColumns: string[] = ['name', 'action'];

  seniorityLevels: MatTableDataSource<Level>;
  seniorityLevelsdisplayedColumns: string[] = ['title', 'ACTION'];
  seniorityLevelsdisplayedOptionColumns: string[] = ['name', 'action'];

  workfroms: MatTableDataSource<WorkFrom>;
  workfromsdisplayedColumns: string[] = ['title', 'ACTION'];
  workfromsdisplayedOptionColumns: string[] = ['name', 'action'];

  isLoading: boolean = true;
  total: number;
  constructor(
    private employeeService: EmployeeSummaryService,
    private dialog: MatDialog,
    private toaster: ToasterService
  ) {}

  ngOnInit(): void {
    this.getAllContractTypes();
    this.getAlllevels();
    this.getAllWorkFroms();
  }

  getAllContractTypes() {
    this.employeeService.getAllContractTypes().subscribe((result) => {
      this.contractTypes = new MatTableDataSource(
        result['response'][0]['totalData']
      );
    });
  }

  getAlllevels() {
    this.employeeService.getAllLevels().subscribe((result) => {
      this.seniorityLevels = new MatTableDataSource(
        result['response'][0]['totalData']
      );
    });
  }

  getAllWorkFroms() {
    this.employeeService.getAllWorkFroms().subscribe((result) => {
      this.workfroms = new MatTableDataSource(
        result['response'][0]['totalData']
      );
    });
  }

  deleteContractType(item) {
    this.employeeService.deleteContractType(item._id).subscribe((result) => {
      this.toaster.success('Successfuly deleted');
      this.getAllContractTypes();
    });
  }

  deleteLevel(item) {
    this.employeeService.deleteLevel(item._id).subscribe((result) => {
      this.toaster.success('Successfuly deleted');
      this.getAlllevels();
    });
  }

  deleteWorkFrom(item) {
    this.employeeService.deleteWorkFrom(item._id).subscribe((result) => {
      this.toaster.success('Successfuly deleted');
      this.getAllWorkFroms();
    });
  }

  contractTypeDialog(event, operation, item) {
    const dialogRef = this.dialog.open(ContractTypesDialogComponent, {
      height: 'auto',
      width: '500px',
      data: {
        operation: operation,
        item:
          operation === 'add'
            ? {
                title: '',
              }
            : item,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAllContractTypes();
    });
  }

  levelsDialog(event, operation, item) {
    const dialogRef = this.dialog.open(LevelsDialogComponent, {
      height: 'auto',
      width: '500px',
      data: {
        operation: operation,
        item:
          operation === 'add'
            ? {
                title: '',
              }
            : item,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAlllevels();
    });
  }

  workFromsDialog(event, operation, item) {
    const dialogRef = this.dialog.open(WorkfromsDialogComponent, {
      height: 'auto',
      width: '500px',
      data: {
        operation: operation,
        item:
          operation === 'add'
            ? {
                title: '',
              }
            : item,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAllWorkFroms();
    });
  }

  // openCreateDialog(event) {
  //   // let employee_id = event.target.id;
  //   // console.log('employee_id => ', employee_id);
  //   const dialogRef = this.dialog.open(AddYearMonthDialogComponent, {
  //     height: 'auto',
  //     width: '500px',
  //     data: {
  //       users: this.users,
  //       // id: employee_id,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //     this.getAllYearMonthItems();
  //   });
  // }
}
