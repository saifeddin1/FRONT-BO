import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ADMIN, INSTRUCTOR, STUDENT } from './constants/roles.constant';
import { User } from './models/user.model';
import { UserService } from './services/user.service';

interface Route {
  roles: Array<string>;
  link: string;
  icon: string;
  label: string;
}
const ROUTES: Array<Route> = [
  {
    roles: [INSTRUCTOR, ADMIN],
    link: './dashboard',
    icon: 'home',
    label: 'Accueil',
  },
  {
    roles: [ADMIN],
    link: './offre',
    icon: 'layers',
    label: 'Gestion des Offres',
  },
  {
    roles: [INSTRUCTOR, ADMIN],
    link: './niveau',
    icon: 'layers',
    label: 'Gestion des Niveaux',
  },
  {
    roles: [ADMIN],
    link: './matiere',
    icon: 'layers',
    label: 'Gestion des Matières',
  },
  {
    roles: [INSTRUCTOR, ADMIN],
    link: './seances',
    icon: 'layers',
    label: 'Gestion des Séances',
  },
  {
    roles: [ADMIN],
    link: './media/types/list',
    icon: 'grid-view',
    label: 'Types Media',
  },
  {
    roles: [INSTRUCTOR, ADMIN],
    link: './media/list',
    icon: 'image-gallery',
    label: 'Medias',
  },
  {
    roles: [ADMIN],
    link: './instructors',
    icon: 'users',
    label: 'Instructeurs',
  },
  { roles: [ADMIN], link: './students', icon: 'users', label: 'Apprenants' },
  {
    roles: [STUDENT],
    link: './calendar',
    icon: 'video-camera',
    label: 'En direct',
  },
  { roles: [STUDENT], link: './offres', icon: 'layers', label: 'Offres' },
  { roles: [STUDENT], link: './matieres', icon: 'book', label: 'Matières' },
  // { roles: [STUDENT], link: "./assistance", icon: "headphones", label: "Assistance" }
];

@Component({
  selector: 'lms-component',
  templateUrl: './lms.component.html',
  styleUrls: ['./lms.component.css'],
})
export class LmsComponent {
  user: User;

  constructor(private router: Router, public userService: UserService) {}

  /**
   * LifeCycle hook of Angular that runs literally after anything happens.
   * Best used for custom change-detection that `ngOnChanges` can't pick up.
   *
   * From my understanding, using this is a bad idea if doing anything intensive. But for our purposes, it's fine.
   * `this.user` in this component is the same reference as the one in the service, so there's no copying or reinstantiation.
   */
  routes: Array<Route>;
  ngDoCheck() {
    this.user = this.userService.getCurrentUser();
    if (this.user && this.user.type) {
      this.routes = ROUTES.filter((route) =>
        route.roles.includes(this.user.type)
      );
    }
  }

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
