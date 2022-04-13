import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { ADMIN } from 'src/app/lms/constants/roles.constant';
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

  constructor(
    private summaryService: EmployeeSummaryService,
    public dialog: MatDialog
  ) {
    this.isAdmin = this.summaryService.getUser()['type'] === ADMIN;
  }

  ngOnInit(): void {
    // this.getCollaborators();
    this.getAllEmployeesFiles();
  }
  // getCollaborators() {
  //   this.summaryService
  //     .getCollaborators()
  //     .subscribe(
  //       (result) => (this.collaborators = result['response'][0]?.totalData)
  //     );
  // }

  getAllEmployeesFiles() {
    return this.isAdmin
      ? this.summaryService.getFiles().subscribe((result) => {
          console.log('⚡ getAllEmployeesFiles ~', result);
          this.allEmployees = result['response'][0]['totalData'];
          this.isLoading = false;
        })
      : this.summaryService.getCollaborators().subscribe((result) => {
          this.allEmployees = result['response'][0]?.totalData;
          this.isLoading = false;
        });
  }

  openDialog(event) {
    let _cid = event?.target?.id;
    console.log(_cid);

    const dialogRef = this.dialog.open(CollaboratorDialogComponent, {
      height: 'auto',
      width: '500px',
      data: {
        collaborator: this.allEmployees.filter(
          (collaborator) => collaborator['_id'] === _cid
        )[0],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
