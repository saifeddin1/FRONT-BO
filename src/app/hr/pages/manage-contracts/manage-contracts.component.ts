import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { Contract } from '../../models/contract.model';
@Component({
  selector: 'app-manage-contracts',
  templateUrl: './manage-contracts.component.html',
  styleUrls: ['./manage-contracts.component.css'],
})
export class ManageContractsComponent implements OnInit {
  users: User[];
  contracts: any;
  isOpen: boolean;
  constructor(
    private employeeService: EmployeeSummaryService,
    public dialog: MatDialog,
    private toaster: ToasterService
  ) {
    this.isOpen = false;
  }

  ngOnInit(): void {
    this.getAllContracts();
  }

  getUsers() {
    this.employeeService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      console.log('result', this.users);
    });
  }

  getAllContracts() {
    this.employeeService.getAllContracts().subscribe((result) => {
      console.log('⚡~ getAllContracts ~ result', result);
      this.contracts = result['response'][0]['totalData'];
    });
  }

  updateContract(contract: Contract) {}

  addContract() {}

  deleteContract(id: string) {
    console.log('deleted');
  }

  // openUpdateDialog(event) {
  //   let _employee_id = event?.target?.id;
  //   console.log(event?.target);

  //   const dialogRef = this.dialog.open(EmployeeDialogComponent, {
  //     height: 'auto',
  //     width: '700px',
  //     data: {
  //       employee: this.employees.filter(
  //         (employee) => employee._id === _employee_id
  //       )[0],
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //   });
  // }

  // openCreateDialog(event) {
  //   const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
  //     height: 'auto',
  //     width: '700px',
  //     data: {
  //       users: this.users,
  //     },
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     console.log(`Dialog result: ${result}`);
  //     this.getAllEmployeesFiles();
  //   });
  // }
}
