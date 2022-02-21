import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VcCalendarComponent } from './pages/vc-calendar/vc-calendar.component';
import { VcChatComponent } from './pages/vc-chat/vc-chat.component';
import { VcDashboardComponent } from './pages/vc-dashboard/vc-dashboard.component';
import { VcDevoirsComponent } from './pages/vc-devoirs/vc-devoirs.component';
import { VcLiveSessionsComponent } from './pages/vc-live-sessions/vc-live-sessions.component';
import { VcSettingsComponent } from './pages/vc-settings/vc-settings.component';


const routes: Routes = [
  {path:'VCDASHBOARD',component:VcDashboardComponent,children:[
    { path:'',component:VcSettingsComponent },
    { path:'settings',component:VcSettingsComponent },
    { path:'calendar',component:VcCalendarComponent },
    { path:'liveSession',component:VcLiveSessionsComponent },
    { path:'chat',component:VcChatComponent },
    { path:'devoirs',component:VcDevoirsComponent }
]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VcRoutingModule { }
