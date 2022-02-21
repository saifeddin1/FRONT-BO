import { Component, OnInit, SimpleChanges } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { MatTableDataSource } from '@angular/material/table';
import { Media } from 'src/app/pages/admin/media/media.service';
import { MediaAssign } from 'src/app/pages/admin/niveau/list-assign-media/mediaAssign.service';
import { MatPaginator } from '@angular/material/paginator';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};


@Component({
  selector: 'app-vc-calendar',
  templateUrl: './vc-calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./vc-calendar.component.css']
})
export class VcCalendarComponent implements OnInit {
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
  constructor() {
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

  }

}
