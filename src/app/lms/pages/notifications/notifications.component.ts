import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { getToken } from '../../constants/getToken';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  constructor(private MatDialog:MatDialog, private NotificationService:NotificationService) { }
  user:any
  notif:any={
    title:"",
    body:"",
    niveau:"",
    currentUserNiv:""
  }
  ngOnInit(): void {
    this.user=jwtDecode(getToken())
    this.notif.currentUserNiv=this.user.username
    console.log(this.notif)
    
    console.log(this.user)
    this.NotificationService.requestPerm("aaa")
  }
  openModal(templateRef){
      this.MatDialog.open(templateRef)
  }


  sendNotification(){
    
    console.log(this.notif)
    console.log(this.notif)
      this.NotificationService.notifier(this.notif).subscribe(res=>{

      })
  }
}
