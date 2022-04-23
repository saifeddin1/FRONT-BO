import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/events.service';

@Component({
  selector: 'app-vc-events',
  templateUrl: './vc-events.component.html',
  styleUrls: ['./vc-events.component.css'],

})
export class VcEventsComponent implements OnInit {
  filter:any
  constructor(private eventsService:EventsService) { }
  events:any;
  ngOnInit() {
      this.eventsService.getAllEvents().subscribe(res=>{
          this.events=res['response']
          console.log(this.events)
      })
  }
  getEvents(){
    
  }
  

}
