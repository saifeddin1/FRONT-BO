import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './pages/summary/summary.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { AuthInterceptor } from './helpers/auth.interceptor';
import { EmployeeSummaryService } from './services/employee-summary.service';
import { HrdashboardComponent } from './pages/hrdashboard/hrdashboard.component';
import { HRRoutingModule } from './hr-routing.module';
import { InterviewsComponent } from './pages/interviews/interviews.component';
import { RouterModule } from '@angular/router';
import { ClarityModule, ClrIconModule } from '@clr/angular';

import { SharedModule } from '../shared/shared.module';
import { CollaboratorsComponent } from './pages/collaborators/collaborators.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InterviewDialog } from './components/interviewDialog/interview-dialog-componenet';
import { ToastrModule } from 'ngx-toastr';
import { JsonFormComponent } from './components/json-form/json-form.component';
import { CalendarModule } from 'angular-calendar';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { TimetableComponent } from './pages/timetable/timetable.component';
import { TimesheetsComponent } from './pages/timesheets/timesheets.component';
import { TimeoffsComponent } from './pages/timeoffs/timeoffs.component';
import { CollaboratorDialogComponent } from './components/collaborator-dialog/collaborator-dialog.component';
import { ManageTimesheetsComponent } from './pages/manage-timesheets/manage-timesheets.component';
import { ManageEmployeesComponent } from './pages/manage-employees/manage-employees.component';
import { EmployeeDialogComponent } from './components/employee-dialog/employee-dialog.component';
import { AddEmployeeDialogComponent } from './components/add-employee-dialog/add-employee-dialog.component';
import { AddInterviewDialogComponent } from './components/add-interview-dialog/add-interview-dialog.component';
import { ManageContractsComponent } from './pages/manage-contracts/manage-contracts.component';
import { ContractsDialogComponent } from './components/contracts-dialog/contracts-dialog.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserTimesheetsComponent } from './pages/user-timesheets/user-timesheets.component';
import { AddYearMonthDialogComponent } from './components/add-year-month-dialog/add-year-month-dialog.component';
import { TimeoffAddDialogComponent } from './components/timeoff-add-dialog/timeoff-add-dialog.component'; // <-- import the module
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { CdkTableModule } from '@angular/cdk/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    SummaryComponent,
    InterviewsComponent,
    HrdashboardComponent,
    CollaboratorsComponent,
    ProfileComponent,
    InterviewDialog,
    JsonFormComponent,
    ContractsComponent,
    TimetableComponent,
    TimesheetsComponent,
    TimeoffsComponent,
    CollaboratorDialogComponent,
    ManageTimesheetsComponent,
    ManageEmployeesComponent,
    EmployeeDialogComponent,
    AddEmployeeDialogComponent,
    AddInterviewDialogComponent,
    ManageContractsComponent,
    ContractsDialogComponent,
    UserTimesheetsComponent,
    AddYearMonthDialogComponent,
    TimeoffAddDialogComponent,
  ],
  imports: [
    HRRoutingModule,
    RouterModule,
    SharedModule,
    ClarityModule,
    ClrIconModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
    ToastrModule,
    CalendarModule,
    MatIconModule,
    NgxPaginationModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    CdkTableModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [
    SummaryComponent,
    InterviewsComponent,
    HrdashboardComponent,
    CollaboratorsComponent,
    ProfileComponent,
    InterviewDialog,
    CollaboratorDialogComponent,
  ],
  providers: [
    EmployeeSummaryService,

    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class HRModule {}
