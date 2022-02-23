import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/lms/services/user.service';

@Component({
  selector: 'app-hrdashboard',
  templateUrl: './hrdashboard.component.html',
  styleUrls: ['./hrdashboard.component.css'],
})
export class HrdashboardComponent implements OnInit {
  constructor(public userService: UserService) {}

  ngOnInit(): void {}

  logout() {
    this.userService.logOut();
  }
}
