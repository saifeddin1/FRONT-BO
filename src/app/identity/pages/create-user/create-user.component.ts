import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Niveau } from 'src/app/lms/pages/admin/niveau/niveau.service';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {

  public studentniv: Niveau[]=[];
  public user = {
    username:'',
    email:'',
    firstname:'',
    lastname:'',
    password:'',
    type:'',
    birthday:'',
    studentNiveauId:'',
  }
  username = new FormControl('');
  email = new FormControl('');
  type = new FormControl('');
  password= new FormControl('');
  firstname = new FormControl('');
  lastname = new FormControl('');
  birthday = new FormControl('');
  studentNiveauId= new FormControl('');
  constructor(private userService:UserService) { }

  ngOnInit(): void {
    
      this.userService.getStudetNiv().subscribe((data)=>{
        this.studentniv = data;
        console.log("*************",this.studentniv)
      });

  }

  createUser(){
    
    this.userService.postUser(this.user).subscribe(
      (result)=>{
        this.userService.showNotification("Created Successfully")
        console.log(result)
      },
      (err)=>{
        this.userService.showNotification("ERROR");
        console.log(err);
      }
      
      
    )
  }

}