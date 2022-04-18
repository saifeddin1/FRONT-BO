import { Component, OnInit } from '@angular/core';
import { UserService } from './../../../lms/services/user.service';
interface Route {
  link: string;
  icon: string;
  label: string;
}
const ROUTES: Array<Route> = [

  {
    link: './profile',
    icon: 'user',
    label: 'Profile',
  },
  {
    link: './calendar',
    icon: 'calendar',
    label: 'Calendar',
  },
  {
    link: './chatClass',
    icon: 'chat-bubble',
    label: 'Class chat',
  },
  {
    link: './records',
    icon: 'replay-all',
    label: 'Records',
  },
  {
    link: './events',
    icon: 'event',
    label: 'Events',
  },
  {
    link: './cantine',
    icon: 'fish',
    label: 'Cantine',
  },
  {
    link: './notification',
    icon: 'notification',
    label: 'Notifications',
  },
  {
    link: './settings',
    icon: 'form',
    label: 'settings',
  },

];
@Component({
  selector: 'app-vc-dashboard',
  templateUrl: './vc-dashboard.component.html',
  styleUrls: ['./vc-dashboard.component.css']
})


export class VcDashboardComponent implements OnInit {
  routes: Array<Route> = ROUTES;
  constructor(private userService:UserService) { }

  ngOnInit(): void {
  }
  logOut() {
    this.userService.logOut();
  }
}
