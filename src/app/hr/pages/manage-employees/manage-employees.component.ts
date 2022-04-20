import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { AddEmployeeDialogComponent } from '../../components/add-employee-dialog/add-employee-dialog.component';
import { AddInterviewDialogComponent } from '../../components/add-interview-dialog/add-interview-dialog.component';
import { ContractsDialogComponent } from '../../components/contracts-dialog/contracts-dialog.component';
import { EmployeeDialogComponent } from '../../components/employee-dialog/employee-dialog.component';
import { File } from '../../models/file.models';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-manage-employees',
  templateUrl: './manage-employees.component.html',
  styleUrls: ['./manage-employees.component.css'],
})
export class ManageEmployeesComponent implements OnInit {
  users: User[];
  displayedColumns: string[] = ['#', 'EMPLOYEE', 'EMAIL', 'ADDRESS', 'ACTIONS'];
  p: number = 0;
  limit: number = 7;
  total: number = 7;
  displayedOptionColumns: string[] = ['name', 'action'];
  viewType: string;
  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private employeeService: EmployeeSummaryService,
    public dialog: MatDialog,
    private router: Router,
    private toaster: ToasterService
  ) {
    this.viewType = 'table';
  }
  employees: MatTableDataSource<File>;

  allEmployees: any;

  ngOnInit(): void {
    this.getAllEmployeesFiles();
    this.getUsers();
  }
  viewContracts(employee): void {
    console.log(this.router.url);

    this.router.navigateByUrl(
      `${this.router.url}/contracts/${employee.userId}`
    );
  }
  viewInterviews(employee): void {
    console.log(this.router.url);

    this.router.navigateByUrl(
      `${this.router.url}/interviews/${employee.userId}`
    );
  }
  setViewType(view) {
    console.log(this.viewType);

    this.viewType = view;
  }

  getUsers() {
    this.employeeService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      console.log('result', this.users);
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.employees.filter = filterValue.trim().toLowerCase();
  }

  changePage(event) {
    console.log(event);
    this.p = event.pageIndex;
    this.limit = event.pageSize;
    this.getUsers();
  }
  getAllEmployeesFiles() {
    this.isLoading = true;
    this.employeeService.getFiles().subscribe((result) => {
      if (
        result['response'][0]['totalData'] &&
        result['response'][0]['totalData'].length
      ) {
        this.employees = new MatTableDataSource(
          result['response'][0]['totalData']
        );
        this.employees.filterPredicate = (data: any, filter) => {
          const accumulator = (currentTerm, key) => {
            return this.nestedFilterCheck(currentTerm, data, key);
          };
          const dataStr = Object.keys(data)
            .reduce(accumulator, '')
            .toLowerCase();

          // Transform the filter by converting it to lowercase and removing whitespace.
          const transformedFilter = filter.trim().toLowerCase();
          return dataStr.indexOf(transformedFilter) !== -1;
        };
        this.employees.paginator = this.paginator;
        setTimeout(() => {
          this.paginator.pageIndex = this.p;
          this.paginator.length =
            result['response'][0]['totalCount'][0]['count'] || 0;
        });
        this.total = result['response'][0]['totalCount'][0]['count'] || 0;
        this.allEmployees = result['response'][0]['totalData'];
        this.isLoading = false;
      } else {
        this.isLoading = false;
        this.employees = new MatTableDataSource();
      }
    });
  }
  nestedFilterCheck(search, data, key) {
    if (typeof data[key] === 'object') {
      for (const k in data[key]) {
        if (data[key][k] !== null) {
          search = this.nestedFilterCheck(search, data[key], k);
        }
      }
    } else {
      search += data[key];
    }
    return search;
  }
  deleteEmployee(id: string) {
    this.employeeService.deleteEmployeeFile(id).subscribe(
      (result) => {
        console.log('❌ ManageEmployeesComponent ~ deleteEmployee', result);
        this.getAllEmployeesFiles();
        this.toaster.success('Successfuly Deleted');
      },
      (error) => {
        this.toaster.error('Something Went Wrong!');
      }
    );
  }
  openUpdateDialog(event, _employee) {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        employee: _employee,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateDialog(event) {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        users: this.users,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getAllEmployeesFiles();
    });
  }
}
