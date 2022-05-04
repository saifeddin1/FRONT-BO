import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UsersService } from 'src/app/eidentity/services/users.service';
import { User } from '../../models/user.model';
import { ToasterService } from '../../services/toaster.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnInit {
  user: any;
  image: string;
  fullname: string;
  phone:string;
  address: string;
  email: string;
  description: string;
  err: string; // `backend/routes/user.js`
  sameUser: boolean;
  username: string;
  loading: boolean = true;
  updateduser = {
      username: '',
      email: '',
      phone: '',
      address :'',
      description : ''
     }

  
  constructor(
    private toasterService: ToasterService,
    private usersServiceidentity:UsersService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes('user/')) this.initComponent();
      });
  }

  ngOnInit(): void {
    this.initComponent();
  }

  ngOnChanges(): void {
    this.initComponent();
  }

  initComponent(): void {
    this.username = this.route.snapshot.paramMap.get('username');
    this.user = this.userService.getCurrentUser();
    
    

    this.usersServiceidentity.getOneUser(this.user._id).subscribe(
      (res)=>{
        console.log("******* req *******", res.response)
        this.updateduser.username = res.response.username;
        this.updateduser.email = res.response.email;
        this.updateduser.phone = res.response.phone;
        this.updateduser.address = res.response.address;
        this.updateduser.description = res.response.description


      },
     
    )
  
}

updateuser(){
 

 this.usersServiceidentity.updateUser(this.user._id,this.updateduser).subscribe(
   (res)=>{
     this.toasterService.success("upadted successfully")

   },
   (err)=>{
    this.toasterService.error("something wrong when updating")
   }
 )
}

}

