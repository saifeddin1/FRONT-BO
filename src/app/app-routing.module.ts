import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginSignupComponent } from './pages/login-signup/login-signup.component';
import { AnonymousGuard } from './core/guards/anonymous.guard';

const routes: Routes = [
  {
    path: 'signup/',
    component: LoginSignupComponent,
    canActivate: [AnonymousGuard],
  },
  {
    path: 'signup/:type',
    component: LoginSignupComponent,
    canActivate: [AnonymousGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
