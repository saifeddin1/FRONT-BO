import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { DEFAULT_MESSAGES, ToasterService } from 'src/app/services/toaster.service';
import { ADMIN, INSTRUCTOR, STUDENT } from 'src/app/constants/roles.constant';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private userService: UserService,
        private toasterService: ToasterService,
        private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err) {
                if (err.status == 401) {
                    //todo expiration information
                    if (err && err.error && err.error.message) {
                        this.toasterService.error(err.error.message)
                    }
                    this.userService.logOut()
                }
                else if (err.status == 403) {
                    if (err.error && err.error.code && err.error.code == "WITHLIVE") {
                        // console.log(err.error.message)
                        this.toasterService.info(DEFAULT_MESSAGES.error.permission.withLive)
                        // this.router.navigate([`offres`]);
                    } else {
                        const user = this.userService.getCurrentUser()
                        if (user) {
                            if (user.type == ADMIN) { this.router.navigate(['dashboard']); }
                            else if (user.type == INSTRUCTOR) { this.router.navigate(['dashboard']); }
                            else if (user.type == STUDENT) { this.router.navigate(['offres']); }
                        } else {
                            this.userService.logOut()
                        }
                    }
                }
            }
            console.log('Backend Error', err)
            return throwError(err);
        }))
    }
}
