import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CollaboratorDialogComponent } from '../../components/collaborator-dialog/collaborator-dialog.component';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

@Component({
  selector: 'app-collabortors',
  templateUrl: './collaborators.component.html',
  styleUrls: ['./collaborators.component.css'],
})
export class CollaboratorsComponent implements OnInit {
  public collaborators: File[];

  constructor(
    private summaryService: EmployeeSummaryService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getCollaborators();
  }
  getCollaborators() {
    this.summaryService
      .getCollaborators()
      .subscribe(
        (result) => (this.collaborators = result['response'][0]?.totalData)
      );
  }

  openDialog(event) {
    let _cid = event?.target?.id;
    console.log(_cid);

    const dialogRef = this.dialog.open(CollaboratorDialogComponent, {
      height: 'auto',
      width: '500px',
      data: {
        collaborator: this.collaborators.filter(
          (collaborator) => collaborator['_id'] === _cid
        )[0],
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
