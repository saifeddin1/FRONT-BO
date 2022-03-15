import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SeanceRoutingModule } from './seance-routing.module';
import { ListSeanceComponent } from './list-seance/list-seance.component';
import { EditSeanceNiveauComponent } from './edit-seance-niveau/edit-seance-niveau.component';
import { EditSeanceNivmatComponent } from './edit-seance-nivmat/edit-seance-nivmat.component';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListSeanceAssignMediaComponent } from './list-seance-assign-media/list-seance-assign-media.component';
import { ListSeanceAssignFileMediaComponent } from './list-seance-assign-file-media/list-seance-assign-file-media.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [ListSeanceComponent, EditSeanceNiveauComponent, EditSeanceNivmatComponent, ListSeanceAssignMediaComponent, ListSeanceAssignFileMediaComponent],
  imports: [
    CommonModule,
    SeanceRoutingModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PdfViewerModule,
    NgxFileDropModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    DragDropModule,
  ]
})
export class SeanceModule { }
