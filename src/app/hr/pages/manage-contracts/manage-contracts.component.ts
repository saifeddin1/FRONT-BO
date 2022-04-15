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
import { UsersService } from 'src/app/eidentity/services/users.service';
import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
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
  p: number = 1;
  limit: number = 7;
  total: number = 7;
  displayedColumns: string[] = ['#', 'startdate', 'status', 'type', 'action'];

  displayedOptionColumns: string[] = ['name', 'action'];
  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;
  constructor(
    private userService: UsersService,
    private employeeService: EmployeeSummaryService,
    public dialog: MatDialog,
    private toaster: ToasterService
  ) {
    this.isOpen = false;
    this.isAdmin
      ? this.getAllContractsWithSalary()
      : this.getEmployeeContracts();
    this.getUsers();
    this.currentUser = employeeService.getUser();
    this.isAdmin = this.currentUser?.type === ADMIN;
  }

  contracts: MatTableDataSource<Contract> = new MatTableDataSource<Contract>();
  allContracts: Contract[];

  ngOnInit(): void {
    this.isAdmin ? this.getAllContractsWithSalary() : this.getEmployeeContracts;
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

  deleteContract(id: string) {
    this.employeeService.deleteContract(id).subscribe((result) => {
      console.log('⚡ deleteContract ~ result', result);
      this.getAllContractsWithSalary();
      this.toaster.success('Successfuly Deleted');
    });
  }

  getAllContractsWithSalary() {
    this.employeeService
      .getAllContractsWithSalaries(this.p, this.limit)
      .subscribe((result) => {
        console.log('⚡ ~  getContractsWithSalary ~ result', result);
        this.contracts = result['response'][0]['totalData'];
        this.allContracts = result['response'][0]['totalData'];
        this.total = result['response'][0]['totalCount'][0]['count'];
        this.isLoading = false;
      });
  }

  getEmployeeContracts() {
    this.employeeService
      .getContractsWithSalary(this.p, this.limit)
      .subscribe((result) => {
        this.contracts = result['response'][0]['totalData'];
        this.allContracts = result['response'][0]['totalData'];
        this.total = result['response'][0]['totalCount'][0]['count'];
        this.isLoading = false;

        console.log(
          '⚡  this.summaryService.getContractsWithSalary ~ this.contracts',
          this.contracts
        );
      });
  }
  changePage(event) {
    console.log(event);
    this.p = event;
    this.isAdmin
      ? this.getAllContractsWithSalary()
      : this.getEmployeeContracts();
  }

  openDialog(event, operation, _contract_id) {
    console.log(_contract_id, 'eee', this.dialogOperation);

    const dialogRef = this.dialog.open(ContractsDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        contract:
          operation === 'edit' || operation === 'view'
            ? this.allContracts.filter(
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
      console.log('⚡ ~ ', this.isAdmin);
      this.isAdmin
        ? this.getAllContractsWithSalary()
        : this.getEmployeeContracts();
    });
  }
}
