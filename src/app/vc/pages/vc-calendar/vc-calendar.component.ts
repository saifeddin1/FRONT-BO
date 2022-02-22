import { Component, OnInit, SimpleChanges } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { Subject } from 'rxjs';
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { MatPaginator } from '@angular/material/paginator';
import { VcCalenderService } from 'src/app/services/vc-calender.service';
import { MatDialog } from '@angular/material/dialog';

const colors: any = {
  red: {
    primary: '#e1e1e1',
    secondary: '#e8fde7',
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
  today = new Date();
  meet={
    name:"",
    description:"",
    url:"",
    startDate:new Date(),
    endDate:new Date(),
    classId:""
  }
  mt:any;
  date = this.today.getFullYear()+'-'+( this.today.getMonth()+1)+'-'+ this.today.getDate()
  openModal() {
    this.clrModalOpen = true;
  }
  closeModal() {
    this.clrModalOpen = false;
  }
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  mobileMode: boolean = false;
  constructor(private calendarService:VcCalenderService, public dialog:MatDialog) {
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
    console.log(this.events)
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
    this.calendarService.getAll().subscribe(
      res=>{

        this.events = res['response'].map((body: any) => ({
          start: new Date(body?.startDate),
          end:new Date(body?.endDate) ,
          title: body?.description,
          color: colors.primary,
        }
        ),
        console.log(this.events),
        console.log(res['response'])
        );
      }
    )
  }
  openDialog(templateRef) {
    let dialogRef = this.dialog.open(templateRef, {

    });
  }
  // *****add new meet*****
  addNewMeet(){
    this.mt=this.meet;
    // this.toastr.warning('verify your infos', '')
    this.calendarService.addVC(this.meet).subscribe(res=>{

    });
  }

}
