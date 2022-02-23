import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user.model';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  user: User;

  onPress(): void {
    this.router.navigateByUrl('/signup');
  }

  windowScrolled: boolean | undefined;
  closeResult: string | undefined;
  constructor(private router: Router, private userService: UserService) {}
  // Sticky Nav
  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.windowScrolled = window.scrollY > 100;
  }
  scrollToTop() {
    (function smoothscroll() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    })();
  }
  // navigation
  navMethod: boolean = false;
  toggleNav() {
    this.navMethod = !this.navMethod;
  }
  // Canvas
  canvasMethod: boolean = false;
  toggleCanvas() {
    this.canvasMethod = !this.canvasMethod;
  }
  //Mobile
  open: boolean = false;
  trigger(item: { open: boolean }) {
    item.open = !item.open;
  }
  // Add class on resize and onload window
  visible: boolean = false;
  breakpoint: number = 1199;
  public innerWidth: any;
  detectHeader() {
    this.innerWidth = window.innerWidth;
    this.visible = this.innerWidth >= this.breakpoint;
  }
  ngOnInit(): void {
    console.log('header.component.ts : ngOnInit');
    this.user = this.userService.getCurrentUser();
    if (this.user) {
      this.navigations = this.connectedNavigations(this.user.username);
    } else {
      this.navigations = this.defaultNavigations;
    }
    this.detectHeader();
  }
  navigations = [];

  defaultNavigations = [
    {
      id: 1,
      link: '/signup',
      code: 'register',
      linkText: 'Inscription',
    },
    {
      id: 2,
      link: '/signup/login',
      code: 'login',
      linkText: 'Connexion',
    },
  ];

  connectedNavigations = (username) => [
    {
      id: 0,
      link: `/lms/user/${username}`,
      code: 'profile',
      linkText: 'Profile',
    },
  ];

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
    } else if (type && type === 'register') {
      this.router.navigate(['signup']);
    } else if (type && type === 'profile') {
      this.userService.goToProfile();
    }
  }
}
