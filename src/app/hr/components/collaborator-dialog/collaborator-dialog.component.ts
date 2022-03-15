import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogModule,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { File } from '../../models/file.models';

@Component({
  selector: 'app-collaborator-dialog',
  templateUrl: './collaborator-dialog.component.html',
  styleUrls: ['./collaborator-dialog.component.css'],
})
export class CollaboratorDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: File,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {}
}
