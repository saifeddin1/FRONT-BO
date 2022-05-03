import { UserService } from './../lms/services/user.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { User } from '../lms/models/user.model';




interface Route {
  link: string;
  icon: string;
  label:string;  
}

const ROUTES : Array<Route>=[
  {
    link:'./summary',
    icon:'layers',
    label:'Summary',
  },
  {
    link:'./program',
    icon:'layers',
    label:'Program',
  },
  
  {
    link:'./feeCategory',
    icon:'layers',
    label:'Fee Category',
  },
  {
    link:'./academicyear',
    icon:'layers',
    label:'Academic Year',
  },
  {
    link:'./academicterm',
    icon:'layers',
    label:'Academic Term',
  },

  {
    link:'./feestructure',
    icon:'layers',
    label:'Fee Structure',
  },
  {
    link:'./groupstudent',
    icon:'layers',
    label:'Group Student',
  },
  {
    link:'./feeSchedule',
    icon:'layers',
    label:'Fee schedule',
  }
 
 
 
]

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.css']
})
export class AccountingComponent  {
 user:User;
 routes: Array<Route> = ROUTES;

  constructor(private router :Router, public userService: UserService) { }

 
  

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
