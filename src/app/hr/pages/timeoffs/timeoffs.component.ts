import { Component, OnInit, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/eidentity/models/user.model';
import { UsersService } from 'src/app/eidentity/services/users.service';
import { UserService } from 'src/app/lms/services/user.service';
import { ADMIN, HR } from '../../../lms/constants/roles.constant';
import { ToasterService } from '../../../lms/services/toaster.service';
import { TimeoffAddDialogComponent } from '../../components/timeoff-add-dialog/timeoff-add-dialog.component';
import { formatDate } from '../../helpers/formatDate';
import { Notification } from '../../models/notification.model';
import { Timeoff } from '../../models/timeoff.model';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-timeoffs',
  templateUrl: './timeoffs.component.html',
  styleUrls: ['./timeoffs.component.css'],
})
export class TimeoffsComponent implements OnInit {
  timeoffs: Timeoff[]; // to be used in dialog
  timeoffHistory: MatTableDataSource<Timeoff>;
  isOpen: boolean = false;
  newNotification: Notification;
  isAdmin: boolean;
  isHR: boolean;
  shouldDisplay: boolean;
  displayedColumns: string[] = [
    '#',
    'startdate',
    'from',
    'endDate',
    'to',
    'status',
  ];
  page: number = 0;
  limit: number = 7;
  total: number = 7;
  displayedOptionColumns: string[] = ['name', 'action'];
  notificationItems: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;
  currUser: User;
  constructor(
    private toaster: ToasterService,
    private employeeService: EmployeeSummaryService,
    private dialog: MatDialog,
    private usersService: UserService
  ) {
    this.currUser = this.usersService.user;
    this.isAdmin = this.currUser?.type === ADMIN;
    this.isHR = this.currUser?.type === HR;
    this.shouldDisplay = this.isHR || this.isAdmin;
    this.newNotification = {
      userId: '',
      content: '',
    };

    if (this.shouldDisplay) {
      // this.displayedColumns.splice(2, 0, 'offDays');
      this.displayedColumns.splice(1, 0, 'user');
    }
    // else {
    //   this.displayedColumns.splice(2, 0, 'endDate');
    // }

    if (this.shouldDisplay) {
      this.displayedColumns.splice(this.displayedColumns.length, 0, 'action');
    }
  }
  ngOnInit(): void {
    this.currUser = this.usersService.user;
    console.log(this.currUser);

    this.isAdmin = this.currUser?.type === ADMIN;
    this.isHR = this.currUser?.type === HR;
    console.log('is he an admin? => ', this.isAdmin);
    console.log('is he an HR? => ', this.isHR);

    this.getEmlpoyeeTimeoffs();
    this.shouldDisplay = this.isHR || this.isAdmin;
    console.log('should we display ? => ', this.shouldDisplay);
  }

  getEndDate(date: Date, days: number) {
    var someDate = new Date(date);
    var result = someDate.setDate(someDate.getDate() + days);

    return new Date(result);
  }

  deleteRequest(toff: Timeoff) {
    return this.employeeService.deleteTimeoff(toff._id).subscribe((result) => {
      console.log(result);
      this.getEmlpoyeeTimeoffs();
      this.toaster.success('Deleted Successfully');
    });
  }
  getEmlpoyeeTimeoffs() {
    this.isLoading = true;
    return this.isAdmin || this.isHR
      ? this.employeeService
          .getAllTimeoffs(this.page, this.limit)
          .subscribe((result) => {
            if (
              result['response'][0]['totalData'] &&
              result['response'][0]['totalData'].length
            ) {
              this.timeoffs = result['response'][0]['totalData'];
              this.timeoffHistory = new MatTableDataSource<Timeoff>(
                result['response'][0]['totalData']
              );
              this.timeoffHistory.paginator = this.paginator;
              setTimeout(() => {
                this.paginator.pageIndex = this.page;
                this.paginator.length =
                  result['response'][0]['totalCount'][0]['count'] || 0;
              });
              this.total = result['response'][0]['totalCount'][0]['count'];
              this.isLoading = false;
              console.log('⚡ TimeoffsComponent  this.timeoffHistory', result);
            } else {
              this.timeoffHistory = new MatTableDataSource<Timeoff>();
              this.isLoading = false;
            }
          })
      : this.employeeService
          .getEmployeeTimeoffHistory(this.page, this.limit)
          .subscribe((result) => {
            if (
              result['response'][0]['totalData'] &&
              result['response'][0]['totalData'].length
            ) {
              this.timeoffs = result['response'][0]['totalData'];
              this.timeoffHistory = new MatTableDataSource<Timeoff>(
                result['response'][0]['totalData']
              );
              this.timeoffHistory.paginator = this.paginator;
              setTimeout(() => {
                this.paginator.pageIndex = this.page;
                this.paginator.length =
                  result['response'][0]['totalCount'][0]['count'] || 0;
              });
              this.total = result['response'][0]['totalCount'][0]['count'];
              this.isLoading = false;
              console.log(
                '⚡ TimeoffsComponent  this.timeoffHistory',
                result['response'][0]['totalData']
              );
            } else {
              this.timeoffHistory = new MatTableDataSource<Timeoff>();
              this.isLoading = false;
            }
          });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.timeoffHistory) {
      this.timeoffHistory.filter = filterValue.trim().toLowerCase();
    }
  }
  changePage(event) {
    console.log(event);
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.getEmlpoyeeTimeoffs();
  }
  // for hr agent

  updateStatus(timeoff) {
    this.employeeService
      .updateTimeoffStatus({ status: timeoff.status }, timeoff._id)
      .subscribe(
        (result) => {
          console.log(
            result,
            result['response']['userId'],
            result['response']['content']
          );
          this.toaster.success(result['message']);
          this.createNotification({
            userId: result['response']['userId'],
            content: `Timeoff #${timeoff._id} has been ${timeoff.status}`,
          });
          this.getNotifications();
          // this.newNotification.userId = result['response']['userId'];
          // this.newNotification.content = result['response']['content'];
        },
        (error) => this.toaster.error(error['error']['message'])
      );
  }

  getNotifications() {
    this.employeeService.getUserNotifications().subscribe((result) => {
      this.notificationItems = result['response'][0]['totalData'];
      console.log(
        '🔕 ~ file: app.component.ts ~ line 47 getUserNotifications',
        result
      );
    });
  }

  createNotification(body) {
    return this.employeeService.createNotification(body).subscribe((result) => {
      console.log('🔕  ~ result', result);
    });
  }
  // for admin
  updateTimeoffRequest(timeoff) {
    return this.employeeService.updateTimeoff(timeoff._id, timeoff).subscribe(
      (result) => {
        console.log(result);
        this.toaster.success(result['message']);
      },
      (error) => this.toaster.error(error['error']['message'])
    );
  }

  openDialog(event, operation, toff_id) {
    this.isOpen = true;
    const dialogRef = this.dialog.open(TimeoffAddDialogComponent, {
      height: 'auto',
      width: 'auto',
      data: {
        timeoffRequest:
          operation === 'add'
            ? {
                startDateSpecs: {
                  date: null,
                  from: '',
                },
                endDateSpecs: {
                  date: null,
                  to: '',
                },
              }
            : this.timeoffs.filter((toff) => toff._id === toff_id)[0],
        operation: operation,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
      this.isOpen = false;
      this.getEmlpoyeeTimeoffs();
    });
  }
}
