import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { VcRoutingModule } from './vc-routing.module';
import { VcLiveSessionsComponent } from './pages/vc-live-sessions/vc-live-sessions.component';
import { VcChatComponent } from './pages/vc-chat/vc-chat.component';
import { VcSettingsComponent } from './pages/vc-settings/vc-settings.component';
import { VcDashboardComponent } from './pages/vc-dashboard/vc-dashboard.component';
import { VcCalendarComponent } from './pages/vc-calendar/vc-calendar.component';
import { VcDevoirsComponent } from './pages/vc-devoirs/vc-devoirs.component';


@NgModule({
  declarations: [
      VcDashboardComponent,
      VcLiveSessionsComponent,
      VcChatComponent,
      VcSettingsComponent,
      VcCalendarComponent,
      VcDevoirsComponent
  ],
  imports: [

    CommonModule,
    VcRoutingModule,
    FormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,})

  ],
  // providers: [DayService,WeekService,WorkWeekService,MonthService,MonthAgendaService],


})
export class VcModule { }
