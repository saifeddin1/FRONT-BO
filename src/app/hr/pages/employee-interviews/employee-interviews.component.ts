import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { User } from 'src/app/eidentity/models/user.model';
import { ADMIN, STUDENT } from 'src/app/lms/constants/roles.constant';
import { ToasterService } from 'src/app/lms/services/toaster.service';
import { UserService } from 'src/app/lms/services/user.service';
import { AddInterviewDialogComponent } from '../../components/add-interview-dialog/add-interview-dialog.component';
import { InterviewDialog } from '../../components/interviewDialog/interview-dialog-componenet';
import { Interview } from '../../models/interview.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-employee-interviews',
  templateUrl: './employee-interviews.component.html',
  styleUrls: ['./employee-interviews.component.css'],
})
export class EmployeeInterviewsComponent implements OnInit {
  public interviews: Interview[];
  public currentUser;
  isOpen: boolean = false;
  employeeImgPath: string;
  // public jsonFormData: JsonFormData;

  isAdmin: boolean;
  users: User[];

  displayedColumns: string[] = [
    '#',
    'user',
    'title',
    'date',
    'status',
    'action',
  ];

  displayedOptionColumns: string[] = ['name', 'action'];

  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;
  page: number = 1;
  limit: number = 7;
  total: number = 7;
  dataSource: MatTableDataSource<Interview> =
    new MatTableDataSource<Interview>();
  userId: string;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private summaryService: EmployeeSummaryService,
    public dialog: MatDialog,
    private toaster: ToasterService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private userService: UserService
  ) {
    this.currentUser = this.userService.user;
    this.isAdmin = this.currentUser?.type === ADMIN;
    this.getAllnterviews();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((param) => {
      this.userId = param.userId;
      console.log('⚡ ~ .params.subscribe ~ userid', this.userId);
    });
    this.getAllnterviews();
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
    this.summaryService
      .getInterviewsByUserId(this.userId, '')
      .subscribe((result) => {
        if (
          result['response'][0]['totalData'] &&
          result['response'][0]['totalData'].length
        ) {
          this.dataSource = new MatTableDataSource(
            result['response'][0]['totalData']
          );
          this.dataSource.paginator = this.paginator;
          setTimeout(() => {
            this.paginator.pageIndex = this.page;
            this.paginator.length =
              result['response'][0]['totalCount'][0]['count'] || 0;
          });
          this.interviews = result['response'][0]['totalData'];
          this.total = result['response'][0]['totalCount'][0]['count'] || 0;
          this.isLoading = false;
        } else {
          this.dataSource = new MatTableDataSource();
          this.isLoading = false;
        }
      });
  }
  goBack() {
    console.log('back clicked');

    this.location.back();
  }
  changePage(event) {
    console.log(event);
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getAllnterviews();
  }
  openDialog(event, _interview) {
    this.getUsers();
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

  addInterview(event, userid) {
    const dialogRef = this.dialog.open(AddInterviewDialogComponent, {
      height: 'auto',
      width: '700px',
      data: {
        users: this.users,
        interview: {
          userId: this.userId || '',
          title: '',
          date: null,
          files: null,
          test: {
            title: '',
            description: '',
            url: '',
          },
        },
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
