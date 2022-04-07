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
import { MatDialog } from '@angular/material/dialog';
import { VcCalenderService } from '../../services/vc-calender.service';
import { ToastrService } from 'ngx-toastr';

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
  styleUrls: ['./vc-calendar.component.scss']
})

export class VcCalendarComponent implements OnInit {
  formElemet = document.getElementById('123');
  seanceId:any;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Week;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  clrModalOpen: boolean = false;
  today = new Date();
  oneSeance:any={
    name:"",
    description:"",
    url:"",
    urlInstructor:"",
    urlAuthInstructor:"464",
    startDate:new Date(),
    endDate:new Date(),
    userId:"",
    niveauId:"",
    seanceId:""
  }
  seance={
    name:"",
    description:"",
    url:"",
    urlInstructor:"564",
    urlAuthInstructor:"4564",
    startDate:new Date(),
    endDate:new Date(),
    userId:"456",
    niveauId:"dsi",
    seanceId:"123"
  }
  mt:any;
  date = this.today.getFullYear()+'-'+( this.today.getMonth()+1)+'-'+ this.today.getDate()
  openModal() {
    this.clrModalOpen = true;
  }
  closeModal() {
    this.dialog.ngOnDestroy;
  }
  refresh: Subject<any> = new Subject();
  events: CalendarEvent[] = [];
  mobileMode: boolean = false;
  constructor(private calendarService:VcCalenderService, public dialog:MatDialog,private toastr: ToastrService) {
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
    // if (changes.viewDate) {
      this.getAll();
    // }
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
  seances:any
  getAll() {
    this.calendarService.getAll().subscribe(
      res=>{
          this.seances=res['response']
          console.log(this.seances)
          console.log(res['response'])
          this.events = res['response'].map((body: any) => ({
          start: new Date(body?.startDate),
          end:new Date(body?.endDate) ,
          title: body?.name,
          color: colors.primary,
        }
        ),
        console.log(this.events),
        console.log(res)
        );
      }
    )
  }
  openMainModal(templateRef){
    this.dialog.open(templateRef);
  }
  openDialog(templateRef,id) {
    
    this.dialog.open(templateRef);
    this.seanceId=id
    console.log(this.seanceId)
    this.getoneSeance()
  }
  // *****add new meet*****
  addNewseance(){
    console.log(this.seance)
    if (this.seance.startDate>this.seance.endDate){
      this.toastr.warning("Warning","Verify your dates");
        }
    else if(this.seance.description=="" || this.seance.name==""|| this.seance.url==""){
    this.toastr.warning("Warning","Verify your data");
       }
    else{
      this.calendarService.addSeance(this.seance).subscribe(res=>{
        
        this.toastr.success("Success","added successfully");
        this.seance={
          name:"",
          description:"",
          url:"",
          urlInstructor:"564",
          urlAuthInstructor:"4564",
          startDate:new Date(),
          endDate:new Date(),
          userId:"456",
          niveauId:"dsi",
          seanceId:"123"
        }
        this.dialog.ngOnDestroy()
        this.ngOnInit()
    });
    
  }
  }
  closeeeModal(){
    this.dialog.ngOnDestroy()
  }

  deleteSeance(){
    this.calendarService.deleteOne(this.seanceId).subscribe(res=>{
      this.toastr.success("Success","deleted successfully")
      this.ngOnInit()
     
    })
    this.dialog.ngOnDestroy()
  }
  updateSeance(){
    if (this.oneSeance.startDate>this.oneSeance.endDate){
      this.toastr.warning("Warning","Verify your dates");
        }
    else if(this.oneSeance.description=="" || this.oneSeance.name==""|| this.oneSeance.url==""){
    this.toastr.warning("Warning","Verify your data");
       }
    else{
      this.calendarService.updateSeance(this.seanceId,this.oneSeance).subscribe(res=>{
        
        this.toastr.success("Success","updated successfully");
        this.oneSeance={
          name:"",
          description:"",
          url:"",
          urlInstructor:"",
          urlAuthInstructor:"",
          startDate:new Date(),
          endDate:new Date(),
          userId:"",
          niveauId:"",
          seanceId:""
        }
        this.dialog.ngOnDestroy()
        this.ngOnInit()
    });
    
  }
   
  }

  getoneSeance(){
    this.calendarService.getOneSeance(this.seanceId).subscribe(res=>{
          this.oneSeance=res
          console.log(this.oneSeance)
    })
  }


}
