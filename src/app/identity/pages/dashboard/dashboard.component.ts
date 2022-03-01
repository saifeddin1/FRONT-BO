import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/lms/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
 

  constructor(public userService:UserService) { }

  ngOnInit(): void {
  }
  
  logout() {
    this.userService.logOut();
  }
}
