import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ADMIN } from 'src/app/lms/constants/roles.constant';
import { UserService } from 'src/app/lms/services/user.service';
import { environment } from 'src/environments/environment';
import { CollaboratorDialogComponent } from '../../components/collaborator-dialog/collaborator-dialog.component';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-collabortors',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.css'],
})
export class CollaboratorsComponent implements OnInit {
  // public collaborators: File[];
  public allEmployees: File[];
  isAdmin: boolean;

  color: ThemePalette = 'accent';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;
  isLoading: boolean = true;
  user: any;

  constructor(
    private summaryService: EmployeeSummaryService,
    public dialog: MatDialog,
    private userService: UserService
  ) {
    this.user = this.userService.user;
    this.isAdmin = this.user?.type === ADMIN;
  }

  ngOnInit(): void {
    this.getAllEmployeesFiles();
  }
  getAllEmployeesFiles() {
    return this.isAdmin
      ? this.summaryService.getFiles('').subscribe((result) => {
          console.log('⚡ getAllEmployeesFiles ~', result);
          let res = result['response'][0]['totalData'];
          res.forEach((element) => {
            if (element.profile.image) {
              element.profile.image = `${environment.HRApi}/files/documents/${element.profile.image}`;
            }
          });
          this.allEmployees = res;
          this.isLoading = false;
        })
      : this.summaryService.getCollaborators().subscribe((result) => {
          let res = result['response'][0]['totalData'];
          res.forEach((element) => {
            if (element.profile.image) {
              element.profile.image = `${environment.HRApi}/files/documents/${element.profile.image}`;
            }
          });
          this.allEmployees = res;
          this.isLoading = false;
        });
  }

  openDialog(event, file) {
    const dialogRef = this.dialog.open(CollaboratorDialogComponent, {
      height: 'auto',
      width: '500px',
      data: {
        collaborator: file,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
