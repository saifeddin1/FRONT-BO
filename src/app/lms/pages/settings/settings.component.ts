import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { STUDENT } from '../../constants/roles.constant';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnInit {
  opened: boolean = false;
  user: User;
  roles = { student: STUDENT };

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.userService.getCurrentUser();
  }

  onPressDelete(): void {
    this.opened = false;
    this.userService.deleteUser(this.user._id).subscribe(
      (res) => {
        console.log('Deleted User Successfully');
        this.userService.setUser(res);
        this.router.navigate(['']);
      },
      (err) => console.log(err)
    );
  }
}
