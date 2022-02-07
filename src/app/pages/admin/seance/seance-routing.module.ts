import { ListSeanceComponent } from './list-seance/list-seance.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditSeanceNiveauComponent } from './edit-seance-niveau/edit-seance-niveau.component';
import { EditSeanceNivmatComponent } from './edit-seance-nivmat/edit-seance-nivmat.component';
import { ListSeanceAssignMediaComponent } from './list-seance-assign-media/list-seance-assign-media.component';
import { ListSeanceAssignFileMediaComponent } from './list-seance-assign-file-media/list-seance-assign-file-media.component';


const routes: Routes = [
  { path: '', component: ListSeanceComponent },
  { path: 'list', component: ListSeanceComponent },
  { path: 'edit/niv/:seanceId', component: EditSeanceNiveauComponent },
  { path: 'edit/nivmat/:seanceId/:nivId', component: EditSeanceNivmatComponent },
  { path: 'edit/mediaAssign/list/:seanceId', component: ListSeanceAssignMediaComponent },
  { path: 'edit/mediaAssignFile/list/:seanceId/:mediaAssignId', component: ListSeanceAssignFileMediaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SeanceRoutingModule { }
