import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './pages/summary/summary.component';
import { HrdashboardComponent } from './pages/hrdashboard/hrdashboard.component';
import { InterviewsComponent } from './pages/interviews/interviews.component';
import { CollaboratorsComponent } from './pages/collaborators/collaborators.component';
import { ProfileComponent } from './pages/profile/profile.component';

const routes: Routes = [
  {
    path: 'hr/administration',
    component: HrdashboardComponent,
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
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HRRoutingModule {}
