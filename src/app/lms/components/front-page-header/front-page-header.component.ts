import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-front-page-header',
  templateUrl: './front-page-header.component.html',
  styleUrls: ['./front-page-header.component.css'],
})
export class FrontPageHeaderComponent implements OnInit {
  constructor(private router: Router, private userService: UserService) {}

  user: User;

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
  }

  showIcon() {
    return !this.router.url.includes('/about');
  }

  shouldShow(): Boolean {
    return !this.router.url.includes('/signup');
    // return this.router.url !== '/signup';
  }

  navigate(type?: string): void {
    if (type && type === 'login') {
      this.router.navigate(['signup', 'login']);
    } else {
      this.router.navigate(['signup']);
    }
  }
}
