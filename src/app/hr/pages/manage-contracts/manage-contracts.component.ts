import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { Contract } from '../../models/contract.model';
import { ContractsDialogComponent } from '../../components/contracts-dialog/contracts-dialog.component';
@Component({
  selector: 'app-manage-contracts',
  templateUrl: './manage-contracts.component.html',
  styleUrls: ['./manage-contracts.component.css'],
})
export class ManageContractsComponent implements OnInit {
  users: User[];
  contracts: any;
  isOpen: boolean;
  dialogOperation: string;
  constructor(
    private employeeService: EmployeeSummaryService,
    public dialog: MatDialog,
    private toaster: ToasterService
  ) {
    this.isOpen = false;
  }

  ngOnInit(): void {
    this.getContractsWithSalary();
    this.getUsers();
  }

  getUsers() {
    this.employeeService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      console.log('result', this.users);
    });
  }

  updateContract(contract: Contract) {}

  addContract() {}

  deleteContract(id: string) {
    this.employeeService.deleteContract(id).subscribe((result) => {
      console.log('⚡ deleteContract ~ result', result);
      this.getContractsWithSalary();
      this.toaster.success('Successfuly Deleted');
    });
  }

  openDialog(event, operation) {
    this.dialogOperation = operation;
    let _contract_id = event?.target?.id;
    console.log(_contract_id);

    const dialogRef = this.dialog.open(ContractsDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        contract:
          this.dialogOperation === 'edit' || this.dialogOperation === 'view'
            ? this.contracts.filter(
                (contract) => contract._id === _contract_id
              )[0]
            : {
                contractType: '',
                hoursNumber: 0,
                startDate: null,
                endDate: null,
                userId: '',
                salary: {
                  seniority: '',
                  annualCompensation: {
                    annual: 0,
                    effective: 0,
                    gross: 0,
                  },
                },
              },
        dialogOperation: this.dialogOperation,
        users: this.users,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getContractsWithSalary();
    });
  }

  getContractsWithSalary() {
    this.employeeService.getAllContractsWithSalaries().subscribe((result) => {
      console.log('⚡ ~  getContractsWithSalary ~ result', result);
      this.contracts = result['response'][0]['totalData'];
    });
  }
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
