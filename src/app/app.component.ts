import { Component } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(private router: Router) {}
  shoudNavShow() {
    return !(
      this.router.url.includes('/signup') || this.router.url.includes('/about')
    );
  }
  token: string = localStorage.getItem('token');

  navigateTo(here: string) {
    this.router.navigate([here]);
  }
}
