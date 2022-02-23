import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListAssignFileMediaComponent } from './list-assign-file-media/list-assign-file-media.component';
import { ListAssignMediaComponent } from './list-assign-media/list-assign-media.component';
import { ListChapitreComponent } from './list-chapitre/list-chapitre.component';
import { ListCoursComponent } from './list-cours/list-cours.component';
import { ListEnregistrementComponent } from './list-enregistrement/list-enregistrement.component';
import { ListNiveauMatiereComponent } from './list-niveau-matiere/list-niveau-matiere.component';
import { ListNiveauComponent } from './list-niveau/list-niveau.component';

const routes: Routes = [
  { path: '', redirectTo: 'list' },
  { path: 'list', component: ListNiveauComponent },
  { path: 'matieres/list/:id', component: ListNiveauMatiereComponent },
  { path: 'matiere/chapitres/list/:nivId/:nivMatId', component: ListChapitreComponent },
  { path: 'matiere/enregistrements/list/:nivId/:nivMatId', component: ListEnregistrementComponent },
  { path: 'matiere/chapitre/cours/list/:nivId/:nivMatId/:chapId', component: ListCoursComponent },
  { path: 'matiere/chapitre/mediaAssign/list/:nivId/:nivMatId/:mediaTypeId/:chapId', component: ListAssignMediaComponent },
  { path: 'matiere/chapitre/mediaAssignFile/list/:nivId/:nivMatId/:mediaTypeId/:chapId/:mediaAssignId', component: ListAssignFileMediaComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NiveauRoutingModule { }
