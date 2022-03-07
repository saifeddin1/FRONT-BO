import { FeestructureComponent } from './pages/feestructure/feestructure.component';
import { AcademicyearComponent } from './pages/academicyear/academicyear.component';
import { FeeCategoryComponent } from './pages/fee-category/fee-category.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PreventStudentGuard } from '../hr/helpers/prevent-student.guard';
import { AuthGuard } from '../lms/core/guards/auth.guard';
import { AboutComponent } from '../lms/pages/home-pages/about/about.component';
import { AccountingComponent } from './accounting.component';
import { ProgramComponent } from './pages/program/program.component';




const routes: Routes = [
  { path: '', redirectTo: 'about', pathMatch: 'full' },
  { path: 'about', component: AboutComponent },
  {
    path: 'accounting',
    component:  AccountingComponent,
    canActivate: [AuthGuard, PreventStudentGuard],
    children: [
      { path: 'program', component:ProgramComponent, pathMatch: 'full' },
      {path:'feeCategory',component:FeeCategoryComponent, pathMatch:'full'},
      {path:'academicyear',component:AcademicyearComponent, pathMatch:'full'},
      {path:'feestructure',component: FeestructureComponent, pathMatch:'full'}
    
    ],
  },
  // { path: 'solutions', component: SolutionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountingRoutingModule { }
