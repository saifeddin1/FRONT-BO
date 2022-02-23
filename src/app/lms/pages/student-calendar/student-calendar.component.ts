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
import { SeanceService } from '../admin/seance/seance.service';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { UserService } from '../../services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Media } from '../admin/media/media.service';
import { MediaAssign } from '../admin/niveau/list-assign-media/mediaAssign.service';
import { ImageService } from '../../services/image.service';
import { User } from '../../models/user.model';
import { STUDENT } from '../../constants/roles.constant';
// the second parameter 'fr' is optional
registerLocaleData(localeFr, 'fr');
const colors: any = {
  red: {
    primary: '#e1e1e1',
    secondary: '#e8fde7',
  },
};
@Component({
  selector: 'app-student-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './student-calendar.component.html',
  styleUrls: ['./student-calendar.component.css'],
})
export class StudentCalendarComponent implements OnChanges, OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Month;
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
  constructor(
    private seanceService: SeanceService,
    private imageService: ImageService,
    private userService: UserService
  ) {
    if (window.innerWidth < 768) {
      console.log('mobileMode');
      this.mobileMode = true;
      this.view = CalendarView.Day;
    } else {
      console.log('webmode');
    }
    var user = this.userService.getDecodedToken();
    if (user) {
      this.getAll();
    }
  }
  isStudent: boolean = false;
  ngOnInit(): void {
    var user: User = this.userService.getCurrentUser();
    if (user.type === STUDENT) {
      this.isStudent = true;
    }
  }
  getAll() {
    const viewDateStr = this.viewDate.toISOString().split('T')[0];
    this.seanceService.getAllByNivMat(viewDateStr, this.view).subscribe(
      (res) => {
        console.log('res :', res);
        if (res && res.length) {
          this.events = res.map((body: any) => ({
            title: body.name,
            start: new Date(body.startDate),
            end: new Date(body.endDate),
            color: colors.red,
            meta: body,
          }));
          this.refreshView();
        }
      },
      (error) => {
        console.error('error :', error);
      }
    );
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
    // this.handleEvent('Dropped or resized', event);
  }
  modalData: CalendarEvent;
  // START : VARIABLES MEDIA ASSIGNS TABLE
  assignMedias: MatTableDataSource<MediaAssign> =
    new MatTableDataSource<MediaAssign>();
  displayedAssignMediaColumns: string[] = ['name', 'videoUrl', 'action'];
  // END
  handleEvent(event: CalendarEvent, DialogContent): void {
    this.modalData = event;
    console.log('this.modalData: ', this.modalData);
    this.assignMedias = new MatTableDataSource<MediaAssign>(
      this.modalData.meta.mediaAssigns
    );
    console.log('this.assignMedias: ', this.assignMedias.data);
    this.openModal();
  }
  // START : VARIABLES ASSIGN MEDIA FILES TABLE
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  assignMediaFiles: MatTableDataSource<Media> = new MatTableDataSource<Media>();
  displayedAssignMediaFilesColumns: string[] = ['name', 'action'];
  paginatorOptions = { length: 100, pageSize: 10, currentPage: 0 };
  // END
  selectedAssignMedia: MediaAssign = null;
  selectAssignMedia(assignMedia: MediaAssign) {
    console.log('assignMedia : ', assignMedia);
    if (assignMedia && assignMedia.files && assignMedia.files.length) {
      this.assignMediaFiles = new MatTableDataSource<Media>(assignMedia.files);
      this.paginatorOptions.length = assignMedia.files.length;
      console.log('assignMediaFiles : ', this.assignMediaFiles.data);
    } else {
      this.assignMediaFiles = new MatTableDataSource<Media>();
      this.assignMediaFiles.paginator = this.paginator;
      this.paginatorOptions.length = 0;
    }
    this.selectedAssignMedia = assignMedia;
  }
  initializeFiles() {
    this.assignMediaFiles = new MatTableDataSource<Media>();
    this.assignMediaFiles.paginator = this.paginator;
    this.paginatorOptions.length = 0;
    this.selectedAssignMedia = null;
  }
  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }
  setView(view: CalendarView) {
    this.view = view;
    this.getAll();
  }
  refreshView(): void {
    this.refresh.next();
  }
  getSeanceNiv(seanceNivs) {
    if (seanceNivs) {
      return seanceNivs.map((x) => x.name);
    }
  }
}
