import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule }   from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser'
import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingComponent } from './accounting.component';
import { ProgramComponent } from './pages/program/program.component';
import { ClarityModule } from '@clr/angular';
import { CdkTableModule} from '@angular/cdk/table'
import { ClrIconModule } from '@clr/angular';
import { MatTableModule } from '@angular/material/table'  
import { MatSortModule } from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import { FeeCategoryComponent } from './pages/fee-category/fee-category.component';
import { AcademicyearComponent } from './pages/academicyear/academicyear.component';
import { FeestructureComponent } from './pages/feestructure/feestructure.component';
import { AcademictermComponent } from './pages/academicterm/academicterm.component';

@NgModule({
  declarations: [AccountingComponent, ProgramComponent, FeeCategoryComponent, AcademicyearComponent, FeestructureComponent, AcademictermComponent],
  imports: [
    CommonModule,
    AccountingRoutingModule,
    ClarityModule,
    ClrIconModule,
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    CdkTableModule
  ],
  exports:[
    AccountingComponent,
    ProgramComponent,
    FeeCategoryComponent,
    AcademicyearComponent,
    AcademictermComponent,
    FeestructureComponent
  ]
})
export class AccountingModule { }
