import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ADMIN, STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { Contract } from '../../models/contract.model';
import { ContractsDialogComponent } from '../../components/contracts-dialog/contracts-dialog.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-manage-contracts',
  templateUrl: './manage-contracts.component.html',
  styleUrls: ['./manage-contracts.component.css'],
})
export class ManageContractsComponent implements OnInit {
  users: User[];
  isOpen: boolean;
  isAdmin: boolean;
  dialogOperation: string;
  currentUser: any;
  form: FormGroup;

  displayedColumns: string[] = ['#', 'startdate', 'type', 'action'];

  displayedOptionColumns: string[] = ['name', 'action'];

  constructor(
    private employeeService: EmployeeSummaryService,
    public dialog: MatDialog,
    formBuilder: FormBuilder,
    private toaster: ToasterService
  ) {
    this.isOpen = false;
    this.getContractsWithSalary();
    this.getUsers();
    this.currentUser = employeeService.getUser();
    this.isAdmin = this.currentUser?.type === ADMIN;
  }

  contracts: MatTableDataSource<Contract> = new MatTableDataSource<Contract>();
  ngOnInit(): void {
    this.getContractsWithSalary();
    this.getUsers();
    if (this.isAdmin) {
      this.displayedColumns.splice(1, 0, 'user');
    }
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

  openDialog(event, operation, _contract_id) {
    console.log(_contract_id, 'eee', this.dialogOperation);

    const dialogRef = this.dialog.open(ContractsDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        contract:
          operation === 'edit' || operation === 'view'
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
        dialogOperation: operation,
        users: this.users,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getContractsWithSalary();
    });
  }

  getContractsWithSalary() {
    this.isAdmin
      ? this.employeeService
          .getAllContractsWithSalaries()
          .subscribe((result) => {
            console.log('⚡ ~  getContractsWithSalary ~ result', result);
            this.contracts = result['response'][0]['totalData'];
          })
      : this.employeeService.getContractsWithSalary().subscribe((result) => {
          this.contracts = result['response'];
          console.log(
            '⚡  this.summaryService.getContractsWithSalary ~ this.contracts',
            this.contracts
          );
        });
  }
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
