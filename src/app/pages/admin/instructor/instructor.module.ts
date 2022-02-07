import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClarityModule } from '@clr/angular';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { InstructorRoutingModule } from './instructor-routing.module';
import { ListInstructorComponent } from './list-instructor/list-instructor.component';
import { EditInstructorNiveauComponent } from './edit-instructor-niveau/edit-instructor-niveau.component';
import { EditInstructorNivmatComponent } from './edit-instructor-nivmat/edit-instructor-nivmat.component';
import { MatSelectModule } from '@angular/material/select';


@NgModule({
  declarations: [ListInstructorComponent, EditInstructorNiveauComponent, EditInstructorNivmatComponent],
  imports: [
    CommonModule,
    InstructorRoutingModule,
    ClarityModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule
  ]
})
export class InstructorModule { }
