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
import { MatTableModule } from '@angular/material/table' ;
import { MatSortModule } from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { ChartModule } from 'angular-highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import {MatIconModule} from '@angular/material/icon';
import { FeeCategoryComponent } from './pages/fee-category/fee-category.component';
import { AcademicyearComponent } from './pages/academicyear/academicyear.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { FeestructureComponent } from './pages/feestructure/feestructure.component';
import { AcademictermComponent } from './pages/academicterm/academicterm.component';
import { GroupstudentComponent } from './pages/groupstudent/groupstudent.component';
import { FeescheduleComponent } from './pages/feeschedule/feeschedule.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { SummaryComponent } from './pages/summary/summary.component';


@NgModule({
  declarations: [AccountingComponent, ProgramComponent, FeeCategoryComponent, AcademicyearComponent, FeestructureComponent, AcademictermComponent, GroupstudentComponent, FeescheduleComponent, SummaryComponent],
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
    CdkTableModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    ChartModule,
    HighchartsChartModule
  
    
  ],
  exports:[
    AccountingComponent,
    ProgramComponent,
    FeeCategoryComponent,
    AcademicyearComponent,
    AcademictermComponent,
    FeestructureComponent,
    GroupstudentComponent,
    SummaryComponent,
    FeescheduleComponent
  ]
})
export class AccountingModule { }
