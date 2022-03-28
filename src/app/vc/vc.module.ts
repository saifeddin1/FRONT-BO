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
import { VcDevoirsComponent } from './pages/vc-devoirs/vc-devoirs.component';
import { VcCalendarComponent } from './pages/vc-calendar/vc-calendar.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { VcProfileComponent } from './pages/vc-profile/vc-profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ClarityModule, ClrIconModule } from '@clr/angular';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { NgxMatDatetimePickerModule, NgxMatTimepickerModule, NgxMatNativeDateModule } from '@angular-material-components/datetime-picker';
import { MatTableModule } from '@angular/material/table';




@NgModule({

  declarations: [
      VcProfileComponent,
      VcCalendarComponent,
      VcDashboardComponent,
      VcLiveSessionsComponent,
      VcChatComponent,
      VcSettingsComponent,
      VcDevoirsComponent
  ],
  imports: [
    ClarityModule, 
    ClrIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDialogModule,
    CommonModule,
    VcRoutingModule,
    FormsModule,
    NgbModalModule,
    BrowserAnimationsModule,
    MatTableModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatFormFieldModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,

  ],



  // providers: [DayService,WeekService,WorkWeekService,MonthService,MonthAgendaService],


})
export class VcModule { }
