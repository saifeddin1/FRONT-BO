import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MediaListComponent } from './media-list/media-list.component';
import { MediaTypeListComponent } from './media-type-list/media-type-list.component';

const routes: Routes = [
  { path: 'types/list', component: MediaTypeListComponent },
  { path: 'list', component: MediaListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MediaRoutingModule { }
