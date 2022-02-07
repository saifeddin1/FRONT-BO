import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListOffreComponent } from './list-offre/list-offre.component';

const routes: Routes = [
  { path: '', component: ListOffreComponent },
  { path: 'list', component: ListOffreComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffreRoutingModule { }
