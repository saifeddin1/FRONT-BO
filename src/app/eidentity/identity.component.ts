import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../lms/models/user.model';
import { UserService } from '../lms/services/user.service';

interface Route {
  link: string;
  icon: string;
  label: string;
}

const ROUTES: Array<Route> = [
  {
    link: './users',
    icon: 'layers',
    label: 'Students',
  },
  {
    link: './admins',
    icon: 'layers',
    label: 'Admins',
  },
  {
    link: './companies',
    icon: 'organization',
    label: 'Company',
  },
  {
    link: './departements',
    icon: 'bank',
    label: 'Departements',
  },
  // {
  //   link: './companies',
  //   icon: 'layers',
  //   label: 'Company',
  // },
  // {
  //   link: './departements',
  //   icon: 'layers',
  //   label: 'Departements',
  // },
  {
    link: './hrusers',
    icon: 'layers',
    label: 'Hr users',
  },

  // {
  //   link: './employees',
  //   icon: 'layers',
  //   label: 'Employee',
  // },
  {
    link: './hrinstructor',
    icon: 'layers',
    label: 'Instructor users',
  },
  {
    link: './eoousers',
    icon: 'administrator',
    label: 'Oranization owners',
  },
  // {
  //   link: './hrinstructor',
  //   icon: 'layers',
  //   label: 'Instructor users',
  // },
];
@Component({
  selector: 'app-identity',
  templateUrl: './identity.component.html',
  styleUrls: ['./identity.component.css'],
})
export class IdentityComponent implements OnInit {
  user: User;
  routes: Array<Route> = ROUTES;
  constructor(private router: Router, public userService: UserService) {}

  ngOnInit(): void {}

  shouldNavShow = (): Boolean => {
    if (this.isHomePages()) return false;
    return !!this.user && this.router.url !== '/signup';
  };

  shouldHeaderShow(): Boolean {
    return !this.shouldNavShow();
  }

  shouldFooterShow(): Boolean {
    return (
      this.isHomePages() || (!this.user && this.router.url.includes('user'))
    );
  }

  isHomePages(): Boolean {
    return this.router.url === '/about' || this.router.url === '/solutions';
  }

  logout() {
    this.userService.logOut();
  }
}
