import { Component, OnInit } from '@angular/core';
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
    link: './liveSession',
    icon: 'video-gallery',
    label: 'Live class',
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
  constructor() { }

  ngOnInit(): void {
  }

}
