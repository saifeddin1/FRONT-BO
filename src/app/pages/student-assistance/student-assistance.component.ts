import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-student-assistance',
  templateUrl: './student-assistance.component.html',
  styleUrls: ['./student-assistance.component.css']
})
export class StudentAssistanceComponent implements OnInit {

  phoneNumber =  "+21622033557" 
  constructor() { }
  ngOnInit(): void {
  }

}
