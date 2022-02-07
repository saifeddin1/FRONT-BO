import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MediaRoutingModule } from './media-routing.module';
import { MediaTypeListComponent } from './media-type-list/media-type-list.component';
import { MediaListComponent } from './media-list/media-list.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { ClarityModule } from '@clr/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [MediaTypeListComponent, MediaListComponent],
  imports: [
    CommonModule,
    MediaRoutingModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    PdfViewerModule,
    NgxFileDropModule,
    MatTableModule,
    DragDropModule,
    MatPaginatorModule

  ]
})
export class MediaModule { }
