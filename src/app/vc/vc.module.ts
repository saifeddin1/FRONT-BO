import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { VcRoutingModule } from './vc-routing.module';
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
import { VcRecordsComponent } from './pages/vc-records/vc-records.component';
import { BrowserModule } from '@angular/platform-browser';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ToastrModule } from 'ngx-toastr';
import { VcEventsComponent } from './pages/vc-events/vc-events.component';
import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { AngularFireModule } from '@angular/fire';
import { firebaseConfig } from './constants/notifEnv';
import { ChatClassComponent } from './pages/chat-class/chat-class.component';
import { ScreenShareComponent } from './pages/screen-share/screen-share.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({

  declarations: [
      ChatClassComponent,
      VcProfileComponent,
      VcCalendarComponent,
      VcDashboardComponent,
      VcSettingsComponent,
      VcDevoirsComponent,
      VcRecordsComponent,
      VcEventsComponent,
      ScreenShareComponent,
      
  ],
  imports: [
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireMessagingModule,
    ScrollingModule,
    ToastrModule,
    Ng2SearchPipeModule,
    BrowserModule,
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
    ReactiveFormsModule,
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
    HttpClientModule,
     


  ],

  // providers: [DayService,WeekService,WorkWeekService,MonthService,MonthAgendaService],


})
export class VcModule { }
