import { Component,  OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToasterService } from 'src/app/lms/services/toaster.service';

import { User } from '../../models/user.model';

import { UserService } from '../../services/user.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  
  constructor(private userService: UserService, public dialog: MatDialog) {
    
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data) => {
     
          this.users = data.response;
        
     
    }
   
    );
  }

  openDialog(id:string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      height: '600px',
      width: '600px',
      data: id 
      
    });
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(
      (result) => {
        
        this.userService.showNotification('Deleted successfully');
        console.log(result);
        location.reload()
      },
      (err) => {
        this.userService.showNotification('ERROR');
        console.log(err);
      }
    );
  }

  activateUser(id:string){
    this.userService.activateUser(id).subscribe(
      (result) => {
       
        this.userService.showNotification('Activated successfully');
        console.log(result);
        location.reload();
      },
      (err) => {
        this.userService.showNotification('ERROR');
        console.log(err);
      }
    );
  }
}
