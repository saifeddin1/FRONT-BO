import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  SimpleChanges,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EmployeeSummaryService } from '../../services/employee-summary.service';

const colors: any = [
  '#EB5353',
  '#36AE7C',
  '#205375',
  '#764AF1',
  '#DEA057',
  '#FF6363',
  '#E78EA9',
  '#8479E1',
];

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css'],
})
export class TimetableComponent implements OnInit, OnChanges {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  clrModalOpen: boolean = false;
  openModal() {
    this.clrModalOpen = true;
  }
  closeModal() {
    this.clrModalOpen = false;
  }
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  mobileMode: boolean = false;
  constructor(private summaryService: EmployeeSummaryService) {
    if (window.innerWidth < 768) {
      console.log('mobileMode');
      this.mobileMode = true;
      this.view = CalendarView.Day;
    } else {
      console.log('webmode');
    }
  }
  isStudent: boolean = false;
  ngOnInit(): void {
    this.getAll();
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    console.log('date : ', date);
    console.log('events : ', events);
    if (this.view === CalendarView.Month) {
      this.viewDate = date;
      this.view = CalendarView.Week;
      this.getAll();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes.viewDate) {
      this.getAll();
    }
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
  }
  modalData: CalendarEvent;
  displayedAssignMediaColumns: string[] = ['name', 'videoUrl', 'action'];
  handleEvent(event: CalendarEvent, DialogContent): void {
    this.modalData = event;
    console.log('this.modalData: ', this.modalData);
    this.openModal();
  }
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedAssignMediaFilesColumns: string[] = ['name', 'action'];
  paginatorOptions = { length: 100, pageSize: 10, currentPage: 0 };
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }
  setView(view: CalendarView) {
    this.view = view;
    this.getAll();
  }
  refreshView(): void {
    console.log(this.events);
    this.refresh.next();
  }
  getSeanceNiv(seanceNivs) {
    if (seanceNivs) {
      return seanceNivs.map((x) => x.name);
    }
  }
  getAll() {
    this.summaryService.getEmployeeTimeSheets(1, 31).subscribe(
      (result) => {
        if (result['response'] && result['response'].length) {
          console.log('⚡ TimetableComponent ~ getAll ~ result', result);

          this.events = result['response'][0]['totalData'].map((body: any) => ({
            start: new Date(body.date),
            end: new Date(
              new Date(body.date).setHours(
                new Date(body.date).getHours() + body.workingHours
              )
            ),
            title: body.note,
            color: {
              primary: '#000',
              secondary: colors[Math.floor(Math.random() * colors.length)],
            },
          }));
          this.refreshView();
        }
      },
      (error) => console.log(error)
    );
  }
}
