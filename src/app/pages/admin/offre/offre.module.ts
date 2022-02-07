import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OffreRoutingModule } from './offre-routing.module';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxFileDropModule } from 'ngx-file-drop';
import { MatTableModule } from '@angular/material/table';
import { ListOffreComponent } from './list-offre/list-offre.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
@NgModule({
  declarations: [ListOffreComponent],
  imports: [
    CommonModule,
    OffreRoutingModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxFileDropModule,
    MatTableModule,
    MatSlideToggleModule,
  ]
})
export class OffreModule { }
