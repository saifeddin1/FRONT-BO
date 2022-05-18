import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VcCalendarComponent } from './pages/vc-calendar/vc-calendar.component';
import { VcDashboardComponent } from './pages/vc-dashboard/vc-dashboard.component';
import { VcDevoirsComponent } from './pages/vc-devoirs/vc-devoirs.component';
import { VcEventsComponent } from './pages/vc-events/vc-events.component';
import { VcProfileComponent } from './pages/vc-profile/vc-profile.component';
import { VcRecordsComponent } from './pages/vc-records/vc-records.component';
import { VcSettingsComponent } from './pages/vc-settings/vc-settings.component';
import { AuthGuard } from '../lms/core/guards/auth.guard';
import { ChatClassComponent } from './pages/chat-class/chat-class.component';
import { ScreenShareComponent } from './pages/screen-share/screen-share.component';

const routes: Routes = [
  {path:'VCDASHBOARD',component:VcDashboardComponent,
  canActivate: [AuthGuard],
  children:[
    { path:'',component:VcProfileComponent },
    { path:'profile',component:VcProfileComponent },
    { path:'records',component:VcRecordsComponent },
    { path:'settings',component:VcSettingsComponent },
    { path:'calendar',component:VcCalendarComponent },
    { path:'chatClass',component:ChatClassComponent },
    { path:'devoirs',component:VcDevoirsComponent },
    { path:'events',component:VcEventsComponent },
    {path:'videoclass',component:ScreenShareComponent}
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VcRoutingModule { }
