import { Component, Input, OnInit } from '@angular/core';

import { User } from 'src/app/models/user.model';
import { DEFAULT_MESSAGES, ToasterService } from 'src/app/services/toaster.service';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ic-il-profile',
  templateUrl: './ic-il-profile.component.html',
  styleUrls: ['./ic-il-profile.component.css'],
})
export class IcIlProfileComponent implements OnInit {
  @Input()
  user: User;
  email: String;
  username: String;

  @Input()
  sameUser: boolean;
  global: String;
  observing: {};

  isProfileComplete: boolean = false;

  shouldEditShow: boolean = false;
  addMoneyShow: boolean = false;

  model = {
    name: '',
    creditCardNumber: '',
    CVV: '',
    exp: '',
    credit: '',
  };

  linkedIn: string = '';
  facebook: string = '';
  fullName: string = '';
  phone: string = '';

  constructor(private toasterService: ToasterService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.ngOnChanges();
  }

  ngOnChanges(): void {
    this.userService.getUserById(this.user._id)
      .subscribe(res => {
        if (this.sameUser) {
          this.user = res;
          if (this.user && this.user.profile) {
            if (this.user.profile.fullName)
              this.fullName = this.user.profile.fullName;
            if (this.user.profile.phone)
              this.phone = this.user.profile.phone;
            if (this.user.profile.linkedIn)
              this.linkedIn = this.user.profile.linkedIn;
            if (this.user.profile.facebook)
              this.facebook = this.user.profile.facebook;
          }
        }
        this.initProfile();
      }, err => {
        console.log("error :", err);
      })
  }

  /**
   * USER SERVICE STUFF HERE
   */
  initProfile(): void {
    if (this.user.profile) {
      const { fullName, phone } = this.user.profile;
      this.isProfileComplete = !!fullName && !!phone;
    } else {
      this.isProfileComplete = false;
    }
  }

  goTo(url: string, type: number): void {
    if (!url) return;
    try {
      let link = new URL(url);
      window.open(link.href);
    } catch {
      switch (type) {
        case 0:
          window.open(url, '_blank');
          break;
        case 1:
          window.open(url, '_blank');
          break;
        default:
          return;
      }
    }
  }

  addCredit() {
    var val = parseFloat(this.model.credit);
    if (!isNaN(val) && val > 0 && this.sameUser) {
      // work
      this.userService.updateCredit(this.user._id, val).subscribe(
        (res) => {
          this.userService.setUser(res);
          this.ngOnChanges();
        },
        (err) => console.log(err)
      );
    }
    this.model.credit = '';
    this.addMoneyShow = false;
  }

  onChangeUser() {
    debugger
    if (this.sameUser) {
      this.shouldEditShow = true;
      var profile = {
        fullName: this.fullName,
        phone: this.phone,
        linkedIn: this.linkedIn,
        facebook: this.facebook,
      };
      // work
      debugger
      this.userService.editProfile(profile).subscribe(
        (res) => {
          this.userService.setUser(res);
          this.toasterService.success(DEFAULT_MESSAGES.success.edit)
          this.ngOnChanges();
        },
        (err) => {
          console.log(err),
            this.toasterService.error(DEFAULT_MESSAGES.error.default)
        }
      );

      this.ngOnChanges();
    }
    this.shouldEditShow = false;
  }
}
