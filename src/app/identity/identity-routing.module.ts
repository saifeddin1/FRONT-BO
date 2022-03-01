import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateUserComponent } from './pages/create-user/create-user.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  {
    path: 'identity/dashboard',
    component: DashboardComponent,
    
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: UsersComponent,
      },
      {
        path: 'createuser',
        pathMatch: 'full',
        component: CreateUserComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdentityRoutingModule { }
