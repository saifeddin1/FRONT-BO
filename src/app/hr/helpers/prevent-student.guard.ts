import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { HR, STUDENT } from 'src/app/lms/constants/roles.constant';
import { User } from 'src/app/lms/models/user.model';
import { UserService } from 'src/app/lms/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class PreventStudentGuard implements CanActivate {
  constructor(private userservice: UserService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const user: User = this.userservice.getCurrentUser();
    if (user['type'] === STUDENT) {
      this.router.navigateByUrl('/lms');
      return false;
    }
    return true;
  }
}
