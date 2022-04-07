import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VcCalendarComponent } from './pages/vc-calendar/vc-calendar.component';
import { VcChatComponent } from './pages/vc-chat/vc-chat.component';
import { VcDashboardComponent } from './pages/vc-dashboard/vc-dashboard.component';
import { VcDevoirsComponent } from './pages/vc-devoirs/vc-devoirs.component';
import { VcEventsComponent } from './pages/vc-events/vc-events.component';
import { VcLiveSessionsComponent } from './pages/vc-live-sessions/vc-live-sessions.component';
import { VcNotificationComponent } from './pages/vc-notification/vc-notification.component';
import { VcProfileComponent } from './pages/vc-profile/vc-profile.component';
import { VcRecordsComponent } from './pages/vc-records/vc-records.component';
import { VcSettingsComponent } from './pages/vc-settings/vc-settings.component';


const routes: Routes = [
  {path:'VCDASHBOARD',component:VcDashboardComponent,children:[
    { path:'',component:VcProfileComponent },
    { path:'profile',component:VcProfileComponent },
    { path:'records',component:VcRecordsComponent },
    { path:'settings',component:VcSettingsComponent },
    { path:'calendar',component:VcCalendarComponent },
    { path:'liveSession',component:VcLiveSessionsComponent },
    { path:'chat',component:VcChatComponent },
    { path:'devoirs',component:VcDevoirsComponent },
    { path:'events',component:VcEventsComponent },
    {path:'notification',component:VcNotificationComponent}
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VcRoutingModule { }
