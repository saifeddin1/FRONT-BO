import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ADMIN, STUDENT } from 'src/app/lms/constants/roles.constant';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { ContractsDialogComponent } from '../../components/contracts-dialog/contracts-dialog.component';
import { Contract } from '../../models/contract.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-employee-contracts',
  templateUrl: './employee-contracts.component.html',
  styleUrls: ['./employee-contracts.component.css'],
})
export class EmployeeContractsComponent implements OnInit {
  dialogOperation: string;
  form: FormGroup;
  p: number = 1;
  limit: number = 7;
  total: number = 7;
  displayedColumns: string[] = ['#', 'startdate', 'status', 'type', 'action'];
  userId: string;
  displayedOptionColumns: string[] = ['name', 'action'];
  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;
  users: any;

  constructor(
    private employeeService: EmployeeSummaryService,
    public dialog: MatDialog,
    private toaster: ToasterService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {}

  contracts: MatTableDataSource<Contract> = new MatTableDataSource<Contract>();
  allContracts: Contract[];

  goBack() {
    console.log('back clicked');

    this.location.back();
  }
  ngOnInit(): void {
    this.getUsers();
    this.activatedRoute.params.subscribe((param) => {
      this.userId = param.userId;
      console.log('⚡ ~ .params.subscribe ~ userid', this.userId);
    });
    this.getContractsByUserId();
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
      this.getContractsByUserId();
      this.toaster.success('Successfuly Deleted');
    });
  }
  addContract(event, employeeUserId) {
    const dialogRef = this.dialog.open(ContractsDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        contract: {
          contractType: '',
          hoursNumber: 0,
          startDate: null,
          endDate: null,
          userId: employeeUserId || '',
          salary: {
            seniority: '',
            annualCompensation: {
              annual: 0,
              effective: 0,
              gross: 0,
            },
          },
        },

        users: this.users,
        dialogOperation: 'add',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.getContractsByUserId();
    });
  }
  getContractsByUserId() {
    this.employeeService
      .getContractsByUserId(this.userId)
      .subscribe((result) => {
        this.contracts = result['response'][0]['totalData'];
        this.allContracts = result['response'][0]['totalData'];
        this.total = result['response'][0]['totalCount'][0]['count'] || 0;
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

    this.getContractsByUserId();
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
                timesheetType: '',
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

      this.getContractsByUserId();
    });
  }
}
