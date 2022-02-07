import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NiveauRoutingModule } from './niveau-routing.module';
import { ListNiveauComponent } from './list-niveau/list-niveau.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ListNiveauMatiereComponent } from './list-niveau-matiere/list-niveau-matiere.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ListChapitreComponent } from './list-chapitre/list-chapitre.component';
import { ListCoursComponent } from './list-cours/list-cours.component';
import { ListAssignMediaComponent } from './list-assign-media/list-assign-media.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ListAssignFileMediaComponent } from './list-assign-file-media/list-assign-file-media.component';
import { MatSelectModule } from '@angular/material/select';
import { ListEnregistrementComponent } from './list-enregistrement/list-enregistrement.component';

@NgModule({
  declarations: [ListNiveauComponent, ListNiveauMatiereComponent, ListChapitreComponent, ListCoursComponent, ListAssignMediaComponent, ListAssignFileMediaComponent, ListEnregistrementComponent],
  imports: [
    CommonModule,
    NiveauRoutingModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PdfViewerModule,
    NgxFileDropModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    DragDropModule,
    MatSelectModule
  ]
})
export class NiveauModule { }
