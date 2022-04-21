import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import moment from 'moment';
import { ADMIN, STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { AddInterviewDialogComponent } from '../../components/add-interview-dialog/add-interview-dialog.component';
import { InterviewDialog } from '../../components/interviewDialog/interview-dialog-componenet';
import { Interview } from '../../models/interview.model';
import { JsonFormData } from '../../models/jsonFormData';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-interviews',
  templateUrl: './interviews.component.html',
  styleUrls: ['./interviews.component.css'],
})
export class InterviewsComponent implements OnInit {
  public interviews: Interview[];
  public currentUser;
  isOpen: boolean = false;
  employeeImgPath: string;
  // public jsonFormData: JsonFormData;

  isAdmin: boolean;
  users: User[];

  displayedColumns: string[] = ['#', 'title', 'date', 'action'];

  displayedOptionColumns: string[] = ['name', 'action'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;
  page: number = 0;
  limit: number = 7;
  total: number = 7;
  dataSource: MatTableDataSource<Interview> =
    new MatTableDataSource<Interview>();
  constructor(
    private summaryService: EmployeeSummaryService,
    public dialog: MatDialog,
    private http: HttpClient,
    private toaster: ToasterService
  ) {
    this.currentUser = this.summaryService.getUser();
    this.isAdmin = this.currentUser['type'] === ADMIN;
    this.isAdmin ? this.getAllnterviews() : this.getEmployeeInterview();
    this.isAdmin && this.displayedColumns.splice(1, 0, 'user');
  }

  ngOnInit(): void {
    this.getUsers();
  }
  getUsers() {
    this.summaryService.getAllUsers(STUDENT).subscribe((result) => {
      this.users = result['response'];
      console.log('result', this.users);
    });
  }

  deleteRecord(interview: Interview) {
    this.summaryService.deleteInterview(interview._id).subscribe(
      (result) => {
        console.log('🔴 ~  Deleted interview: ', result);
        this.toaster.success('Deleted Successfuly');
        this.getAllnterviews();
      },
      (error) => this.toaster.error(error.message)
    );
  }

  formatDate(date) {
    let newDate = moment.utc(date)?.format('D/MM/YYYY');
    return newDate;
  }

  getAllnterviews() {
    this.isLoading = true;
    this.summaryService
      .getAllInterviews(this.page, this.limit)
      .subscribe((result) => {
        if (
          result['response'][0]['totalData'] &&
          result['response'][0]['totalData'].length
        ) {
          this.interviews = result['response'][0]['totalData'];
          this.total = result['response'][0]['totalCount'][0]?.count;
          this.dataSource = new MatTableDataSource(
            result['response'][0]['totalData']
          );
          this.dataSource.paginator = this.paginator;
          setTimeout(() => {
            this.paginator.pageIndex = this.page;
            this.paginator.length =
              result['response'][0]['totalCount'][0]['count'] || 0;
          });
          this.isLoading = false;
          console.log(
            '⚡ this.interviews and totel',
            this.interviews,
            this.total
          );
        } else {
          this.dataSource = new MatTableDataSource();
          this.isLoading = false;
        }
      });
  }
  getEmployeeInterview() {
    this.isLoading = true;
    this.summaryService
      .getInterviews(this.page, this.limit)
      .subscribe((result) => {
        if (
          result['response'][0]['totalData'] &&
          result['response'][0]['totalData'].length
        ) {
          this.interviews = result['response'][0]['totalData'];
          this.total = result['response'][0]['totalCount'][0]?.count;
          this.dataSource = new MatTableDataSource(
            result['response'][0]['totalData']
          );
          this.dataSource.paginator = this.paginator;
          setTimeout(() => {
            this.paginator.pageIndex = this.page;
            this.paginator.length =
              result['response'][0]['totalCount'][0]['count'] || 0;
          });
          this.isLoading = false;
          console.log(
            '⚡ this.interviews and totel',
            this.interviews,
            this.total
          );
        } else {
          this.dataSource = new MatTableDataSource();
          this.isLoading = false;
        }
      });
  }

  changePage(event) {
    console.log(event);
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.isAdmin ? this.getAllnterviews() : this.getEmployeeInterview();
  }
  openDialog(event, _interview) {
    const dialogRef = this.dialog.open(InterviewDialog, {
      height: 'auto',
      width: '700px',
      data: {
        interview: _interview,
        user: this.currentUser,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openCreateDialog(event) {
    this.isOpen = true;
    const dialogRef = this.dialog.open(AddInterviewDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        users: this.users,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.isOpen = false;
      this.getAllnterviews();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }
  }
}
