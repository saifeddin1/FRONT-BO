import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { matTabsAnimations } from '@angular/material/tabs';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { TimesheetDeclaration } from '../../models/timesheetDeclaration.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-declarations',
  templateUrl: './declarations.component.html',
  styleUrls: ['./declarations.component.css'],
})
export class DeclarationsComponent implements OnInit {
  timesheetDeclarations: MatTableDataSource<TimesheetDeclaration>;
  incomingDeclarations: MatTableDataSource<TimesheetDeclaration>;

  incomingDeclarationsdisplayedColumns: string[] = [
    'user',
    'name',
    'month',
    'status',
    'ACTION',
  ];
  incomingDeclarationsdisplayedOptionColumns: string[] = ['name', 'action'];
  timesheetDeclarationsdisplayedColumns: string[] = [
    'user',
    'name',
    'month',
    'status',
    'ACTION',
  ];
  timesheetDeclarationsdisplayedOptionColumns: string[] = ['name', 'action'];
  filterVal: string;
  isLoading: boolean = true;
  p: number = 0;
  limit: number = 7;
  total: number = 7;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  searchNotifier = new Subject();
  incomingDetailsVisible: boolean;
  incomingItem: any;
  constructor(
    private employeeService: EmployeeSummaryService,
    private dialog: MatDialog,
    private toaster: ToasterService
  ) {
    this.filterVal = '';
    this.incomingDetailsVisible = false;
  }

  ngOnInit(): void {
    this.getIncomingDeclarations();
    this.getApprovedRejected();
    this.searchNotifier
      .pipe(debounceTime(500))
      .subscribe((data) => this.getApprovedRejected());
  }

  getApprovedRejected() {
    this.employeeService
      .getApprovedRejected(this.p, this.limit, this.filterVal)
      .subscribe((result) => {
        console.log(result['response']);
        this.timesheetDeclarations = new MatTableDataSource(
          result['response'][0]['totalData']
        );
        this.timesheetDeclarations.paginator = this.paginator;
        setTimeout(() => {
          this.paginator.pageIndex = this.p;
          this.paginator.length =
            result['response'][0]['totalCount'][0]['count'] || 0;
        });
        this.total = result['response'][0]['totalCount'][0]['count'] || 0;
      });
  }

  getIncomingDeclarations() {
    this.employeeService
      .getIncomingDeclarations(this.p, this.limit, this.filterVal)
      .subscribe((result) => {
        console.log("⚡ ['totalData']", result['response'][0]['totalData']);
        this.incomingDeclarations = result['response'][0]['totalData'];

        this.incomingDeclarations.paginator = this.paginator;
        setTimeout(() => {
          this.paginator.pageIndex = this.p;
          this.paginator.length =
            result['response'][0]['totalCount'][0]['count'] || 0;
        });
        this.total = result['response'][0]['totalCount'][0]['count'] || 0;
      });
  }

  changePage(event) {
    console.log(event);
    this.p = event.pageIndex;
    this.limit = event.pageSize;
    this.getApprovedRejected();
  }

  deleteDeclaration(element) {
    this.employeeService.deleteDeclaration(element._id).subscribe(
      (result) => {
        this.toaster.success('Success');
        this.getIncomingDeclarations();
        this.getApprovedRejected();
      },
      (e) => this.toaster.error(e.error.message)
    );
  }

  toggleViewIncoming(element) {
    this.incomingItem = element;
    console.log('⚡ this.incomingItem', this.incomingItem);
    this.incomingDetailsVisible = !this.incomingDetailsVisible;
    console.log('⚡ this.incomingDetailsVisible', this.incomingDetailsVisible);
  }

  updateStatus(element, status) {
    this.employeeService
      .updateDeclarationStatus(element._id, { status: status })
      .subscribe(
        (result) => {
          this.toaster.success(result['message']);
          console.log(result['response']);
          this.getApprovedRejected();
          this.getIncomingDeclarations();
          this.incomingDetailsVisible = false;
        },
        (e) => this.toaster.error(e.error.message)
      );
  }
}
