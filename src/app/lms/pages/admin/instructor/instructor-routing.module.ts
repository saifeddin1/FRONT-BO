import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListInstructorComponent } from './list-instructor/list-instructor.component';
import { EditInstructorNiveauComponent } from './edit-instructor-niveau/edit-instructor-niveau.component';
import { EditInstructorNivmatComponent } from './edit-instructor-nivmat/edit-instructor-nivmat.component';


const routes: Routes = [
  { path: '', component: ListInstructorComponent },
  { path: 'list', component: ListInstructorComponent },
  { path: 'edit/niv/:userId', component: EditInstructorNiveauComponent },
  { path: 'edit/nivmat/:userId/:nivId', component: EditInstructorNivmatComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule { }
