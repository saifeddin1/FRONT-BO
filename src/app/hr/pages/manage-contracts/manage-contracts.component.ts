import { Component, OnInit, ViewChild } from '@angular/core';
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
import { MatPaginator } from '@angular/material/paginator';
import { UserService } from 'src/app/lms/services/user.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-manage-contracts',
  templateUrl: './manage-contracts.component.html',
  styleUrls: ['./manage-contracts.component.css'],
})
export class ManageContractsComponent implements OnInit {
  users: User[];
  isOpen: boolean;
  isAdmin: boolean;
  filterVal: string;
  dialogOperation: string;
  currentUser: any;
  form: FormGroup;
  p: number = 0;
  limit: number = 7;
  total: number = 7;
  displayedColumns: string[] = [
    '#',
    'startdate',
    'endDate',
    'status',
    'type',
    'action',
  ];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedOptionColumns: string[] = ['name', 'action'];
  searchNotifier = new Subject();
  isLoading: boolean = true;
  constructor(
    private userService: UserService,
    private employeeService: EmployeeSummaryService,
    public dialog: MatDialog,
    private toaster: ToasterService
  ) {
    this.currentUser = this.userService.user;
    this.isAdmin = this.currentUser?.type === ADMIN;
    this.isOpen = false;
    this.filterVal = '';
  }

  contracts: MatTableDataSource<Contract>;
  allContracts: Contract[];

  ngOnInit(): void {
    this.isAdmin
      ? this.getAllContractsWithSalary()
      : this.getEmployeeContracts();
    this.getUsers();
    if (this.isAdmin) {
      this.displayedColumns.splice(1, 0, 'ref');
      this.displayedColumns.splice(2, 0, 'employee');
    }

    this.searchNotifier
      .pipe(debounceTime(500))
      .subscribe((data) =>
        this.isAdmin
          ? this.getAllContractsWithSalary()
          : this.getEmployeeContracts()
      );
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
    this.isLoading = true;
    this.employeeService
      .getAllContractsWithSalaries(this.p, this.limit, this.filterVal)
      .subscribe(
        (result) => {
          if (
            result['response'][0]['totalData'] &&
            result['response'][0]['totalData'].length
          ) {
            this.contracts = new MatTableDataSource(
              result['response'][0]['totalData']
            );
            this.contracts.paginator = this.paginator;
            setTimeout(() => {
              this.paginator.pageIndex = this.p;
              this.paginator.length =
                result['response'][0]['totalCount'][0]['count'] || 0;
            });
            this.allContracts = result['response'][0]['totalData'];
            this.total = result['response'][0]['totalCount'][0]['count'] || 0;
            this.isLoading = false;
          } else {
            this.contracts = new MatTableDataSource();
            this.isLoading = false;
          }
        },
        (error) => this.toaster.error(error.error.message)
      );
  }

  getEmployeeContracts() {
    this.isLoading = true;
    this.employeeService
      .getContractsWithSalary(this.p, this.limit, this.filterVal)
      .subscribe(
        (result) => {
          if (
            result['response'][0]['totalData'] &&
            result['response'][0]['totalData'].length
          ) {
            this.contracts = new MatTableDataSource(
              result['response'][0]['totalData']
            );
            this.contracts.paginator = this.paginator;
            setTimeout(() => {
              this.paginator.pageIndex = this.p;
              this.paginator.length =
                result['response'][0]['totalCount'][0]['count'] || 0;
            });
            this.allContracts = result['response'][0]['totalData'];
            this.total = result['response'][0]['totalCount'][0]['count'] || 0;
            this.isLoading = false;
          } else {
            this.contracts = new MatTableDataSource();
            this.isLoading = false;
          }
        },
        (error) => this.toaster.error(error.error.message)
      );
  }

  debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  changePage(event) {
    console.log(event);
    this.p = event.pageIndex;
    this.limit = event.pageSize;
    this.isAdmin
      ? this.getAllContractsWithSalary()
      : this.getEmployeeContracts();
  }

  openDialog(event, operation, _contract) {
    console.log(_contract);

    const dialogRef = this.dialog.open(ContractsDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        contract:
          operation === 'edit' || operation === 'view'
            ? _contract
            : {
                contractType: '',
                hoursNumber: 0,
                startDate: null,
                endDate: null,
                userId: '',
                timesheetType: '',
                status: '',
                salary: {
                  seniority: '',
                  annualCompensation: {
                    annual: '',
                    effective: '',
                    gross: '',
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
