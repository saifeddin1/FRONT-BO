import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './pages/summary/summary.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './helpers/auth.interceptor';
import { EmployeeSummaryService } from './services/employee-summary.service';
import { HrdashboardComponent } from './pages/hrdashboard/hrdashboard.component';
import { HRRoutingModule } from './hr-routing.module';
import { InterviewsComponent } from './pages/interviews/interviews.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CollaboratorsComponent } from './pages/collaborators/collaborators.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { InterviewDialog } from './components/interviewDialog/interview-dialog-componenet';
import { ToastrModule } from 'ngx-toastr';
import { JsonFormComponent } from './components/json-form/json-form.component';
import { CalendarModule } from 'angular-calendar';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { TimetableComponent } from './pages/timetable/timetable.component';
import { TimesheetsComponent } from './pages/timesheets/timesheets.component';
import { TimeoffsComponent } from './pages/timeoffs/timeoffs.component';
import { CollaboratorDialogComponent } from './components/collaborator-dialog/collaborator-dialog.component';

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
  ],
  imports: [
    HRRoutingModule,
    RouterModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
    ToastrModule,
    CalendarModule,
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

    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
})
export class HRModule {}
