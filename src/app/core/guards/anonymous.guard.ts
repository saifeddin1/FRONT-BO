import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { User } from 'src/app/lms/models/user.model';
import { UserService } from 'src/app/lms/services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AnonymousGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    var token: string = this.userService.getToken();
    // const user: User = this.userService.getCurrentUser();
    if (token) {
      this.router.navigateByUrl('/about');
      return false;
    }
    return true;
  }
}
