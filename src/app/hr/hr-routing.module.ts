import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './pages/summary/summary.component';
import { HrdashboardComponent } from './pages/hrdashboard/hrdashboard.component';
import { InterviewsComponent } from './pages/interviews/interviews.component';
import { CollaboratorsComponent } from './pages/collaborators/collaborators.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { TimetableComponent } from './pages/timetable/timetable.component';
import { TimesheetsComponent } from './pages/timesheets/timesheets.component';
import { TimeoffsComponent } from './pages/timeoffs/timeoffs.component';
import { AuthGuard } from '../lms/core/guards/auth.guard';
import { ManageTimesheetsComponent } from './pages/manage-timesheets/manage-timesheets.component';
import { PreventStudentGuard } from './helpers/prevent-student.guard';
import { ManageEmployeesComponent } from './pages/manage-employees/manage-employees.component';
import { ManageContractsComponent } from './pages/manage-contracts/manage-contracts.component';
import { UserTimesheetsComponent } from './pages/user-timesheets/user-timesheets.component';
import { EmployeeContractsComponent } from './pages/employee-contracts/employee-contracts.component';
import { EmployeeInterviewsComponent } from './pages/employee-interviews/employee-interviews.component';
import { YearMonthsComponent } from './pages/year-months/year-months.component';
import { ContractSettingsComponent } from './pages/contract-settings/contract-settings.component';
import { DeclarationsComponent } from './pages/declarations/declarations.component';

const routes: Routes = [
  {
    path: 'hr-administration',
    component: HrdashboardComponent,
    canActivate: [AuthGuard, PreventStudentGuard],
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
        path: 'manage-employees/interviews/:userId',
        component: EmployeeInterviewsComponent,
      },
      {
        path: 'collaborators',
        component: CollaboratorsComponent,
      },
      {
        path: 'timesheetManagement/detail/:userId',
        component: UserTimesheetsComponent,
      },
      {
        path: 'declarations',
        component: DeclarationsComponent,
      },
      {
        path: 'manage-employees',
        component: ManageEmployeesComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },

      {
        path: 'manage-contracts',
        component: ManageContractsComponent,
      },
      {
        path: 'manage-employees/contracts/:userId',
        component: EmployeeContractsComponent,
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
      {
        path: 'year-months',
        component: YearMonthsComponent,
      },
      {
        path: 'contract-settings',
        component: ContractSettingsComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HRRoutingModule {}
