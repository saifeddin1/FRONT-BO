import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { UsersService } from 'src/app/eidentity/services/users.service';

@Injectable({
  providedIn: 'root',
})
@Pipe({
  name: 'username',
  pure: false,
})
export class UsernamePipe implements PipeTransform {
  employee_username: string;
  prevalue: string;
  constructor(private userService: UsersService) {}
  transform(value: string, ...args: unknown[]): any {
    if (value !== this.prevalue) {
      this.prevalue = value;
      this.employee_username = '';

      setTimeout(() => {
        this.userService.getOneUser(value).subscribe((result) => {
          this.employee_username = result['response']['username'];
        });
      }, 1000);
    }

    return this.employee_username;
  }
}
