import { IdentityComponent } from './identity.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from '../lms/pages/home-pages/about/about.component';
import { AuthGuard } from '../lms/core/guards/auth.guard';
import { PreventStudentGuard } from '../hr/helpers/prevent-student.guard';
import { UsersComponent } from './pages/users/users.component';
import { CompanyComponent } from './pages/company/company.component';
import { DepartementComponent } from './pages/departement/departement.component';

const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  {
    path: 'identity',
    component:  IdentityComponent,
    canActivate: [AuthGuard, PreventStudentGuard],
    children: [
      { path: 'users', component:UsersComponent, pathMatch: 'full' },
      { path: 'companies', component:CompanyComponent, pathMatch: 'full' },
      { path: 'departements', component:DepartementComponent, pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EidentityRoutingModule { }
