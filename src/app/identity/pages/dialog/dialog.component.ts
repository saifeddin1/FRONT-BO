import { Component, Inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { setupMaster } from 'cluster';
import { userInfo } from 'os';
import { User } from '../../models/user.model';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  
  public user = {
    username: '',
    email: '',
    phone: '',
    type: '',
  };
  
  public id:string;
  

  username = new FormControl('');
  email = new FormControl('');
  type = new FormControl('');
  phone= new FormControl('');
  

  constructor(private userService:UserService,  @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit(): void {
    console.log("dddddddddddddddddd",this.data)
    this.userService.getOneUser(this.data).subscribe(data =>{
      this.username.setValue(data.response.username);
      this.email.setValue(data.response.email);
      this.type.setValue(data.response.type);
      this.phone.setValue(data.response.phone);
      this.id = data.response._id
      
     
     })
     
    console.log(this.data)
  }
 

  
  updateUser(){
   
    this.userService.updateUser(this.data,this.user)
    .subscribe(
      (result) => {
      
        this.userService.showNotification("Updated successfully");
        console.log(result);
        location.reload();
      },
      (err) => {
        this.userService.showNotification("ERROR");
        console.log(err);
      }
    );
  }
}
  