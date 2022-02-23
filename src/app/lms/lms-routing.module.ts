import { BannerComponent } from './pages/home-pages/banner/banner.component';
import { ChatComponent } from './pages/chat/chat.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { AboutComponent } from './pages/home-pages/about/about.component';
import { SolutionsComponent } from './pages/home-pages/solutions/solutions.component';
import { StudentCalendarComponent } from './pages/student-calendar/student-calendar.component';
import { StudentAssistanceComponent } from './pages/student-assistance/student-assistance.component';
import { StudentOffreComponent } from './pages/student-offre/student-offre.component';
import { StudentMatiereComponent } from './pages/student-matiere/student-matiere.component';
import { MatiereDetailsComponent } from './pages/student-matiere/matiere-details/matiere-details.component';
import { LmsComponent } from './lms.component';
const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  {
    path: 'lms',
    component: LmsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'calendar', pathMatch: 'full' },

      {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'niveau',
        loadChildren: () =>
          import('./pages/admin/niveau/niveau.module').then(
            (m) => m.NiveauModule
          ),
      },
      {
        path: 'offre',
        loadChildren: () =>
          import('./pages/admin/offre/offre.module').then((m) => m.OffreModule),
      },
      {
        // for admin
        path: 'matiere',
        loadChildren: () =>
          import('./pages/admin/matiere/matiere.module').then(
            (m) => m.MatiereModule
          ),
      },
      {
        path: 'seances',
        loadChildren: () =>
          import('./pages/admin/seance/seance.module').then(
            (m) => m.SeanceModule
          ),
      },
      {
        path: 'media',
        loadChildren: () =>
          import('./pages/admin/media/media.module').then((m) => m.MediaModule),
      },
      {
        path: 'students',
        loadChildren: () =>
          import('./pages/admin/student/student.module').then(
            (m) => m.StudentModule
          ),
      },
      {
        path: 'instructors',
        loadChildren: () =>
          import('./pages/admin/instructor/instructor.module').then(
            (m) => m.InstructorModule
          ),
      },
      {
        // For student
        path: 'matieres',
        component: StudentMatiereComponent,
        canActivate: [AuthGuard],
      },
      {
        // For student
        path: 'matiere/details/:nivMatId',
        component: MatiereDetailsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'chat',
        component: ChatComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'banner',
        component: BannerComponent,
      },
      { path: 'user/:username', component: UserProfileComponent },
      { path: 'user', redirectTo: 'about', canActivate: [AuthGuard] },
      {
        path: 'search/:type/:query',
        component: SearchResultsComponent,
        canActivate: [AuthGuard],
      },
      { path: 'search', redirectTo: 'dashboard', canActivate: [AuthGuard] },
      { path: 'search/:type', redirectTo: 'about', canActivate: [AuthGuard] },
      {
        path: 'offres',
        component: StudentOffreComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'calendar',
        component: StudentCalendarComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'assistance',
        component: StudentAssistanceComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  // { path: 'solutions', component: SolutionsComponent },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LmsRoutingModule {}
