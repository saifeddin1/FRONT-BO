import { ForgetpasswordComponent } from './pages/forgetpassword/forgetpassword.component';
// import { BannerComponent } from './pages/home-pages/banner/banner.component';
// import { ChatComponent } from './pages/chat/chat.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AuthGuard } from './core/guards/auth.guard';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
// import { SettingsComponent } from './pages/settings/settings.component';
// import { UserProfileComponent } from './pages/user-profile/user-profile.component';
// import { SearchResultsComponent } from './pages/search-results/search-results.component';
// import { AboutComponent } from './pages/about/about.component';
// import { SolutionsComponent } from './pages/home-pages/solutions/solutions.component';
// import { StudentCalendarComponent } from './pages/student-calendar/student-calendar.component';
// import { StudentAssistanceComponent } from './pages/student-assistance/student-assistance.component';
// import { StudentOffreComponent } from './pages/student-offre/student-offre.component';
// import { StudentMatiereComponent } from './pages/student-matiere/student-matiere.component';
// import { MatiereDetailsComponent } from './pages/student-matiere/matiere-details/matiere-details.component';
import { ButtonFilledComponent } from './shared/components/button-filled/button-filled.component';
import { ButtonOutlineComponent } from './shared/components/button-outline/button-outline.component';
import { CustomTextInputComponent } from './shared/components/custom-text-input/custom-text-input.component';
import { CustomDateInputComponent } from './shared/components/custom-date-input/custom-date-input.component';
import { CustomSwitchComponent } from './shared/components/custom-switch/custom-switch.component';
import { CustomDropdownComponent } from './shared/components/custom-dropdown/custom-dropdown.component';
import { CustomSearchButtonComponent } from './shared/components/custom-search-button/custom-search-button.component';
import { AnonymousGuard } from './core/guards/anonymous.guard';

const routes: Routes = [
  // { path: '', redirectTo: 'about', pathMatch: 'full' },
  {
    path: 'signup',
    component: LoginSignupComponent,
    canActivate: [AnonymousGuard],
  },
  {
    path: 'signup/:type',
    component: LoginSignupComponent,
    canActivate: [AnonymousGuard],
  },
  
  // { path: 'about', component: AboutComponent },
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   canActivate: [AuthGuard],
  // },
  // // { path: 'solutions', component: SolutionsComponent },
  // {
  //   path: 'niveau',
  //   loadChildren: () =>
  //     import('./pages/admin/niveau/niveau.module').then((m) => m.NiveauModule),
  // },
  // {
  //   path: 'offre',
  //   loadChildren: () =>
  //     import('./pages/admin/offre/offre.module').then((m) => m.OffreModule),
  // },
  // {
  //   // for admin
  //   path: 'matiere',
  //   loadChildren: () =>
  //     import('./pages/admin/matiere/matiere.module').then(
  //       (m) => m.MatiereModule
  //     ),
  // },
  // {
  //   path: 'seances',
  //   loadChildren: () =>
  //     import('./pages/admin/seance/seance.module').then((m) => m.SeanceModule),
  // },
  // {
  //   path: 'media',
  //   loadChildren: () =>
  //     import('./pages/admin/media/media.module').then((m) => m.MediaModule),
  // },
  // {
  //   path: 'students',
  //   loadChildren: () =>
  //     import('./pages/admin/student/student.module').then(
  //       (m) => m.StudentModule
  //     ),
  // },
  // {
  //   path: 'instructors',
  //   loadChildren: () =>
  //     import('./pages/admin/instructor/instructor.module').then(
  //       (m) => m.InstructorModule
  //     ),
  // },
  // {
  //   // For student
  //   path: 'matieres',
  //   component: StudentMatiereComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   // For student
  //   path: 'matiere/details/:nivMatId',
  //   component: MatiereDetailsComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'chat',
  //   component: ChatComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'banner',
  //   component: BannerComponent,
  // },
  // { path: 'user/:username', component: UserProfileComponent },
  // { path: 'user', redirectTo: 'about', canActivate: [AuthGuard] },
  // {
  //   path: 'search/:type/:query',
  //   component: SearchResultsComponent,
  //   canActivate: [AuthGuard],
  // },
  // { path: 'search', redirectTo: 'dashboard', canActivate: [AuthGuard] },
  // { path: 'search/:type', redirectTo: 'about', canActivate: [AuthGuard] },
  // {
  //   path: 'offres',
  //   component: StudentOffreComponent,
  //   canActivate: [AuthGuard],
  // },
  // {
  //   path: 'calendar',
  //   component: StudentCalendarComponent,
  //   canActivate: [AuthGuard],
  // },
  // { path: 'settings', component: SettingsComponent, canActivate: [AuthGuard] },
  // {
  //   path: 'assistance',
  //   component: StudentAssistanceComponent,
  //   canActivate: [AuthGuard],
  // },

  // TO BE DELETED ❌
  { path: 'button-filled', component: ButtonFilledComponent },
  { path: 'button-outline', component: ButtonOutlineComponent },
  { path: 'custom-text', component: CustomTextInputComponent },
  { path: 'custom-date', component: CustomDateInputComponent },
  { path: 'custom-switch', component: CustomSwitchComponent },
  { path: 'custom-drop', component: CustomDropdownComponent },
  { path: 'custom-search', component: CustomSearchButtonComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
