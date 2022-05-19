import { IdentityComponent } from './identity.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from '../lms/pages/home-pages/about/about.component';
import { AuthGuard } from '../lms/core/guards/auth.guard';
import { PreventStudentGuard } from '../hr/helpers/prevent-student.guard';
import { UsersComponent } from './pages/users/users.component';
import { CompanyComponent } from './pages/company/company.component';
import { DepartementComponent } from './pages/departement/departement.component';
import { HrusersComponent } from './pages/hrusers/hrusers.component';
import { InstructorusersComponent } from './pages/instructorusers/instructorusers.component';
import { EoousersComponent } from './pages/eoousers/eoousers.component';
import { AdminComponent } from './pages/admin/admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  {
    path: 'identity',
    component: IdentityComponent,
    canActivate: [AuthGuard, PreventStudentGuard],
    children: [
      { path: 'users', component:UsersComponent, pathMatch: 'full' },
      { path: 'companies', component:CompanyComponent, pathMatch: 'full' },
      { path: 'departements/:id', component:DepartementComponent, pathMatch: 'full' },
      { path: 'departements', component:DepartementComponent, pathMatch: 'full' },
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users', component: UsersComponent, pathMatch: 'full' },
      { path: 'admins', component: AdminComponent, pathMatch: 'full' },
      { path: 'hrusers', component: HrusersComponent, pathMatch: 'full' },
      { path: 'hrinstructor', component: InstructorusersComponent, pathMatch: 'full' },
      { path: 'eoousers', component: EoousersComponent, pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EidentityRoutingModule {}
