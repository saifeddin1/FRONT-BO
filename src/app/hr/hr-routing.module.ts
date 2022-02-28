import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './pages/summary/summary.component';
import { HrdashboardComponent } from './pages/hrdashboard/hrdashboard.component';
import { InterviewsComponent } from './pages/interviews/interviews.component';
import { CollaboratorsComponent } from './pages/collaborators/collaborators.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ContractsComponent } from './pages/contracts/contracts.component';
import { TimetableComponent } from './pages/timetable/timetable.component';
import { TimesheetsComponent } from './pages/timesheets/timesheets.component';
import { TimeoffsComponent } from './pages/timeoffs/timeoffs.component';
import { AuthGuard } from '../lms/core/guards/auth.guard';
import { ManageTimesheetsComponent } from './pages/manage-timesheets/manage-timesheets.component';

const routes: Routes = [
  {
    path: 'hr/administration',
    component: HrdashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: SummaryComponent,
      },
      {
        path: 'interviews',
        component: InterviewsComponent,
      },
      {
        path: 'collaborators',
        component: CollaboratorsComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'contracts',
        component: ContractsComponent,
      },
      {
        path: 'timetable',
        component: TimetableComponent,
      },
      {
        path: 'timesheets',
        component: TimesheetsComponent,
      },
      {
        path: 'timesheetManagement',
        component: ManageTimesheetsComponent,
      },
      {
        path: 'timeoffs',
        component: TimeoffsComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HRRoutingModule {}
